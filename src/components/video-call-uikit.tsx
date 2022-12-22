import AgoraUIKit, {
  CallbacksInterface,
  RtcPropsInterface,
  StylePropInterface,
} from "agora-react-uikit";
import AgoraRTC, {
  ICameraVideoTrack,
  ILocalTrack,
  IMicrophoneAudioTrack,
  NetworkQuality,
} from "agora-rtc-sdk-ng";
import { useEffect, useRef, useState } from "react";
import AgoraUIKitCustom from "./agoraUIKitCustom";
import { NetworkQualityComponent } from "./network-quality.component";
import { AgoraAuthInfo, useVideoCallContext } from "./video-call.provider";
import { CallingOverlay } from "./CallingOverlay";

AgoraRTC.setLogLevel(4);

interface Props {
  agoraAuthInfo: AgoraAuthInfo;
}
export default function VideoCallUIKit({ agoraAuthInfo }: Props) {
  const { callingVisibility } = useVideoCallContext();

  const [videoCall, setVideoCall] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  // network quality
  const [uplinkQuality, setUplinkQuality] = useState(0);
  const [downlinkQuality, setDownlinkQuality] = useState(0);

  // local tracks
  const localTracks = useRef<ILocalTrack[]>([]);

  const rtcProps: RtcPropsInterface = {
    layout: 1,
    appId: agoraAuthInfo.appId,
    channel: agoraAuthInfo.channelName,
    token: agoraAuthInfo.token,
    uid: agoraAuthInfo.uid,
    disableRtm: true,
    // enableDualStream: true,
    // dualStreamMode: RemoteStreamFallbackType.LOW_STREAM,
    enableAudio: false,
    enableVideo: false,
  };

  const styleProps: Partial<StylePropInterface> = {
    UIKitContainer: {
      position: "relative",
    },
    localBtnContainer: {
      background: "",
      position: "absolute",
      display: "flex",
      alignItems: "center",
      gap: 8,
      justifyContent: "normal",
      width: "fit-content",
      bottom: 0,
      left: "50%",
      translate: "-50%",
    },
    pinnedVideoContainer: {
      position: "relative",
    },
    scrollViewContainer: {
      position: "absolute",
      right: 4,
      top: 4,
      width: "20%",
      aspectRatio: 0.8,
    },
    minViewContainer: {
      minWidth: "100%",
      minHeight: "100%",
      width: "100%",
      height: "100%",
    },
  };

  const callbacks: Partial<CallbacksInterface> = {
    "connection-state-change": (crrState) => {
      if (crrState === "CONNECTED") {
        setIsConnected(true);
      }
    },
    EndCall: async () => {
      setVideoCall(false);
      setIsConnected(false);
      for (const track of localTracks.current) {
        track.close();
      }
    },
    "network-quality": (stats: NetworkQuality) => {
      setUplinkQuality(stats.uplinkNetworkQuality);
      setDownlinkQuality(stats.downlinkNetworkQuality);
    },
    "update-user-video": (
      tracks: [IMicrophoneAudioTrack, ICameraVideoTrack]
    ) => {
      localTracks.current = tracks;
    },
  };

  useEffect(() => {
    const handleTracks = (e: any) => {
      const tracks: any = e.detail;
      localTracks.current = tracks;
    };

    document.addEventListener("tracks", handleTracks);

    return () => {
      document.removeEventListener("trackts", handleTracks);
      for (const track of localTracks.current) {
        track.close();
      }
    };
  }, []);

  const handleClickJoin = () => {
    setVideoCall(true);
  };

  if (!agoraAuthInfo) return null;

  return (
    <div className="w-full h-full">
      <div className="flex items-center gap-2 mb-2">
        {!videoCall && (
          <button className="btn-primary" onClick={handleClickJoin}>
            Join
          </button>
        )}
        {videoCall && (
          <button className="btn-primary" onClick={handleClickJoin}>
            Show stats
          </button>
        )}
        <div className="flex items-center gap-1">
          <div className="flex items-center gap-1">
            <span>Uplink quality: </span>
            <NetworkQualityComponent quality={uplinkQuality} />
          </div>
          <span>-</span>
          <div className="flex items-center gap-1">
            <span>Downlink quality: </span>
            <NetworkQualityComponent quality={downlinkQuality} />
          </div>
        </div>
      </div>
      {videoCall && (
        <div
          style={{
            display: "flex",
            width: "100%",
            aspectRatio: 1.5,
            position: "relative",
          }}
        >
          <AgoraUIKitCustom
            rtcProps={rtcProps}
            callbacks={callbacks}
            styleProps={styleProps}
          />
          {callingVisibility && isConnected && (
            <CallingOverlay name="Nguyen Van A" callingText="Calling..." />
          )}
        </div>
      )}
    </div>
  );
}
