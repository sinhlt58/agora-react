import AgoraUIKit, {
  CallbacksInterface,
  RtcPropsInterface,
} from "agora-react-uikit";
import AgoraRTC, {
  ICameraVideoTrack,
  ILocalTrack,
  IMicrophoneAudioTrack,
  NetworkQuality,
  RemoteStreamFallbackType,
} from "agora-rtc-sdk-ng";
import { useRef, useState } from "react";
import { NetworkQualityComponent } from "./network-quality.component";
import { useVideoCallContext } from "./video-call.provider";

AgoraRTC.setLogLevel(4);

export default function VideoCallUIKit() {
  const { appId, channel, token } = useVideoCallContext();

  const [videoCall, setVideoCall] = useState(false);
  // network quality
  const [uplinkQuality, setUplinkQuality] = useState(0);
  const [downlinkQuality, setDownlinkQuality] = useState(0);

  // local tracks
  const localTracks = useRef<ILocalTrack[]>([]);

  const rtcProps: RtcPropsInterface = {
    layout: 0,
    appId,
    channel,
    token,
    // enableDualStream: true,
    // dualStreamMode: RemoteStreamFallbackType.LOW_STREAM,
    // enableAudio: false,
    // enableVideo: false,
    // disableRtm: true,
  };

  const callbacks: Partial<CallbacksInterface> = {
    EndCall: async () => {
      setVideoCall(false);
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

  const handleClickJoin = () => {
    setVideoCall(true);
  };

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
        <div style={{ display: "flex", width: "100%", aspectRatio: 1.5 }}>
          <AgoraUIKit rtcProps={rtcProps} callbacks={callbacks} />
        </div>
      )}
    </div>
  );
}
