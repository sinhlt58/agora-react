import { useEffect, useRef, useState } from "react";
import AgoraRTC, {
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
  IRemoteAudioTrack,
  IRemoteVideoTrack,
} from "agora-rtc-sdk-ng";
import { useVideoCallContext } from "./video-call.provider";
import { NetworkQualityComponent } from "./network-quality.component";

interface ChannelParameters {
  localAudioTrack?: IMicrophoneAudioTrack;
  localVideoTrack?: ICameraVideoTrack;

  remoteAudioTrack?: IRemoteAudioTrack;
  remoteVideoTrack?: IRemoteVideoTrack;

  remoteUid?: string;
}

export const VideoCallCustom = () => {
  const { appId, channel, token } = useVideoCallContext();

  const options = {
    // Pass your App ID here.
    appId,
    // Set the channel name.
    channel,
    // Pass your temp token here.
    token,
    // Set the user ID.
    // uid: 0,
  };

  const channelParameters = useRef<ChannelParameters>({});
  const agoraEngine = useRef(
    AgoraRTC.createClient({ mode: "rtc", codec: "vp8" })
  );

  const remotePlayerContainer = useRef<HTMLDivElement>(null);
  const localPlayerContainer = useRef<HTMLDivElement>(null);

  const [localUserId, setLocalUserId] = useState("");
  const [remoteUserId, setRemoteUserId] = useState("");

  // network quality
  const [uplinkQuality, setUplinkQuality] = useState(0);
  const [downlinkQuality, setDownlinkQuality] = useState(0);

  useEffect(() => {
    // Listen for the "user-published" event to retrieve a AgoraRTCRemoteUser object.
    agoraEngine.current.on("user-published", async (user, mediaType) => {
      // Subscribe to the remote user when the SDK triggers the "user-published" event.
      await agoraEngine.current.subscribe(user, mediaType);
      console.log("subscribe success");
      // Subscribe and play the remote video in the container If the remote user publishes a video track.
      if (mediaType == "video") {
        // Retrieve the remote video track.
        channelParameters.current.remoteVideoTrack = user.videoTrack;
        // Retrieve the remote audio track.
        channelParameters.current.remoteAudioTrack = user.audioTrack;
        // Save the remote user id for reuse.
        channelParameters.current.remoteUid = user.uid.toString();

        // Set a stream fallback option to automatically switch remote video quality when network conditions degrade. 
        agoraEngine.current.setStreamFallbackOption(channelParameters.current.remoteUid, 1);

        // Specify the ID of the DIV container. You can use the uid of the remote user.
        setRemoteUserId(user.uid.toString());
        if (remotePlayerContainer.current) {
          // Play the remote video track.
          channelParameters.current.remoteVideoTrack?.play(
            remotePlayerContainer.current
          );
        }
      }

      // Subscribe and play the remote audio track If the remote user publishes the audio track only.
      if (mediaType == "audio") {
        // Get the RemoteAudioTrack object in the AgoraRTCRemoteUser object.
        channelParameters.current.remoteAudioTrack = user.audioTrack;
        // Play the remote audio track. No need to pass any DOM element.
        channelParameters.current.remoteAudioTrack?.play();
      }
      // Listen for the "user-unpublished" event.
      agoraEngine.current.on("user-unpublished", (user) => {
        channelParameters.current.remoteUid = undefined;
        setRemoteUserId("");
        console.log(user.uid + " has left the channel");
      });
    });

    agoraEngine.current.on("connection-state-change", (curState, prevState, reason) => {
      // The sample code uses debug console to show the connection state. In a real-world application, you can add
      // a label or a icon to the user interface to show the connection state. 

      // Display the current connection state.
      console.log("Connection state has changed to :" + curState);
      // Display the previous connection state.
      console.log("Connection state was : " + prevState);
      // Display the connection state change reason.
      console.log("Connection state change reason : " + reason);
    });

    agoraEngine.current.on("network-quality", (quality) => {
      setUplinkQuality(quality.uplinkNetworkQuality);
      setDownlinkQuality(quality.downlinkNetworkQuality);
    });

  }, []);

  const handleClickJoin = async () => {
    // Enable dual-stream mode.
    agoraEngine.current.enableDualStream();

    // Join a channel.
    const userId = await agoraEngine.current.join(
      options.appId,
      options.channel,
      options.token
    );
    setLocalUserId(userId.toString());
    // Create a local audio track from the audio sampled by a microphone.
    channelParameters.current.localAudioTrack =
      await AgoraRTC.createMicrophoneAudioTrack({ encoderConfig: "high_quality_stereo" });
    // Create a local video track from the video captured by a camera.
    channelParameters.current.localVideoTrack =
      await AgoraRTC.createCameraVideoTrack({
        // encoderConfig:
        // {
        //   width: 640,
        //   // Specify a value range and an ideal value
        //   height: { ideal: 480, min: 400, max: 500 },
        //   frameRate: 15,
        //   bitrateMin: 600, bitrateMax: 1000,
        // },
        optimizationMode: "motion",
      });

    // Publish the local audio and video tracks in the channel.
    await agoraEngine.current.publish([
      channelParameters.current.localAudioTrack,
      channelParameters.current.localVideoTrack,
    ]);
    // Play the local video track.
    if (localPlayerContainer.current) {
      channelParameters.current.localVideoTrack?.play(
        localPlayerContainer.current
      );
    }
    console.log("publish success!");
  };

  const handleClickLeave = async () => {
    // Destroy the local audio and video tracks.
    channelParameters.current.localAudioTrack?.close();
    channelParameters.current.localVideoTrack?.close();
    // Leave the channel
    await agoraEngine.current.leave();

    setUplinkQuality(0);
    setDownlinkQuality(0);
    setLocalUserId("");
  };

  // Audio quality
  const [isHighRemoteVideoQuality, setIsHighRemoteVideoQuality] = useState(false);

  const handleClickAudioMixing = async () => {

  }

  const handleClickShowStatistics = async () => {

  }

  const handleClickRemoteQuality = () => {
    if (!channelParameters.current.remoteUid) return;

    if (!isHighRemoteVideoQuality) {
      agoraEngine.current.setRemoteVideoStreamType(channelParameters.current.remoteUid, 0);
      setIsHighRemoteVideoQuality(true);
    } else {
      agoraEngine.current.setRemoteVideoStreamType(channelParameters.current.remoteUid, 1);
      setIsHighRemoteVideoQuality(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        {
          !localUserId &&
          <button className="btn-primary" onClick={handleClickJoin}>
            Join
          </button>
        }
        {
          localUserId &&
          <>
            <button className="btn-primary" onClick={handleClickLeave}>
              Leave
            </button>
            {/* <button className="btn-primary" onClick={handleClickAudioMixing}>
                Audio mixing
              </button>
              <button className="btn-primary" onClick={handleClickShowStatistics}>
                Show statistics
              </button> */}
            <button className="btn-primary" onClick={handleClickRemoteQuality}>
              {isHighRemoteVideoQuality && <span className="color-green-400">Remote high quality</span>}
              {!isHighRemoteVideoQuality && <span className="color-red-400">Remote low quality</span>}
            </button>
          </>
        }
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <span>Uplink quality: </span>
          <NetworkQualityComponent quality={uplinkQuality} />
        </div>
        <span>-</span>
        <div className="flex items-center gap-2">
          <span>Downlink quality: </span>
          <NetworkQualityComponent quality={downlinkQuality} />
        </div>
      </div>

      <div className="flex flex-col gap-2 relative">
        <div
          className=""
          style={{ width: "100%", aspectRatio: 1.4 }}
          ref={remotePlayerContainer}
        ></div>
        <div
          className="absolute top-2 right-2"
          style={{ width: remoteUserId ? "100px" : "100%", aspectRatio: remoteUserId ? 0.8 : 1.4 }}
          ref={localPlayerContainer}
        ></div>
      </div>
    </div>
  );
};
