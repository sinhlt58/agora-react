import React, { useState, useEffect, useRef } from "react";
import {
  ILocalVideoTrack,
  ILocalAudioTrack,
  createMicrophoneAndCameraTracks,
  IRemoteVideoTrack,
  IRemoteAudioTrack,
  UID,
} from "agora-rtc-react";
import { TracksContext } from "agora-react-uikit";
import AgoraRTC from "agora-rtc-sdk-ng";

interface media {
  videoTrack?: IRemoteVideoTrack;
  audioTrack?: IRemoteAudioTrack;
}
interface localMedia {
  videoTrack?: ILocalVideoTrack;
  audioTrack?: ILocalAudioTrack;
}

export type mediaStore = {
  [key in UID]: media | localMedia;
};

const useTracks = createMicrophoneAndCameraTracks(
  { encoderConfig: {} },
  { encoderConfig: {} }
);
/**
 * React component that create local camera and microphone tracks and assigns them to the child components
 */
const TracksConfigureCustom: React.FC<any> = (props: any) => {
  const [ready, setReady] = useState<boolean>(false);
  const [localVideoTrack, setLocalVideoTrack] =
    useState<ILocalVideoTrack | null>(null);
  const [localAudioTrack, setLocalAudioTrack] =
    useState<ILocalAudioTrack | null>(null);
  // const { ready: trackReady, tracks, error } = useTracks();
  const mediaStore = useRef<mediaStore>({});
  const isCreateTracks = useRef(false);

  useEffect(() => {
    const createTracks = async () => {
      if (isCreateTracks.current) return;
      isCreateTracks.current = true;

      const tracks = await AgoraRTC.createMicrophoneAndCameraTracks();

      setLocalAudioTrack(tracks[0]);
      setLocalVideoTrack(tracks[1]);
      mediaStore.current[0] = {
        audioTrack: tracks[0],
        videoTrack: tracks[1],
      };
      setReady(true);
      document.dispatchEvent(new CustomEvent("tracks", { detail: tracks }));
    };

    createTracks();
  }, []);

  // useEffect(() => {
  //   if (tracks !== null) {
  //     setLocalAudioTrack(tracks[0]);
  //     setLocalVideoTrack(tracks[1]);
  //     mediaStore.current[0] = {
  //       audioTrack: tracks[0],
  //       videoTrack: tracks[1],
  //     };
  //     setReady(true);
  //     // tracks[0].close();
  //     // tracks[1].close();
  //     document.dispatchEvent(new CustomEvent("tracks", { detail: tracks }));
  //   } else if (error) {
  //     console.error(error);
  //     setReady(false);
  //   }
  //   return () => {
  //     if (tracks) {
  //       for (const track of tracks) {
  //         track.close();
  //       }
  //     }
  //   };
  // }, [trackReady, error]); //, ready])

  return (
    <TracksContext.Provider
      value={{
        localVideoTrack: localVideoTrack,
        localAudioTrack: localAudioTrack,
      }}
    >
      {ready ? props.children : null}
    </TracksContext.Provider>
  );
};

export default TracksConfigureCustom;
