import { createContext, useContext, useEffect, useState } from "react";
import { getRtmToken } from "./tokens.apis";
import { VideoCallCustom } from "./video-call-custom";
// import {} from "agora-rtm-react";
// import {} from "agora-rtm-sdk";
import VideoCallUIKit from "./video-call-uikit";
// import {} from "agora-rtc-react";

export interface AgoraAuthInfo {
  appId: string;
  channelName: string;
  token: string;
  uid: number;
}
interface VideoCallState {
  agoraAuthInfo: AgoraAuthInfo | undefined;
  callingVisibility: boolean;
  setCallingVisibility: (v: boolean) => void;
}

export const VideoCallContext = createContext({} as VideoCallState);

export const useVideoCallContext = () => {
  return useContext(VideoCallContext);
};

interface Props {
  children?: React.ReactNode | React.ReactNode[];
}
export function VideoCallProvider({ children }: Props) {
  const [agoraAuthInfo, setAgoraAuthInfo] = useState<AgoraAuthInfo>();
  const [isUseUIKit, setIsUseUIKit] = useState(true);
  const [callingVisibility, setCallingVisibility] = useState(true);

  useEffect(() => {
    const getToken = async () => {
      // const res = await getRtmToken({
      //   uid: Math.floor(Math.random() * 1e9),
      //   channelName: "integrate",
      // });
      const info: AgoraAuthInfo = {
        // ...res.data,
        uid: Math.floor(Math.random() * 1e9),
        appId: "b84167854ccb4b03a50ae63bfe79fee3",
        channelName: "tests",
        token:
          "007eJxTYPhZs3/dl20mG7f6HTU7tHi/yMqlZUmfV73kmeItsIXLPMhRgSHJwsTQzNzC1CQ5OckkycA40dQgMdXMOCkt1dwyLTXV2KR0SXJDICODyrQcJkYGCATxWRlKUotLihkYAPPvIPI=",
      };
      setAgoraAuthInfo(info);
    };
    getToken();
  }, []);

  const value: VideoCallState = {
    agoraAuthInfo,
    callingVisibility,
    setCallingVisibility,
  };

  if (!agoraAuthInfo) return;

  return (
    <VideoCallContext.Provider value={value}>
      <div className="flex flex-col h-screen w-full">
        <div className="flex justify-center gap-4">
          <div className="flex justify-center gap-2">
            <input
              type="checkbox"
              checked={isUseUIKit}
              onChange={(e) => setIsUseUIKit(e.target.checked)}
            />
            <span>Use UIKIT</span>
          </div>
          <div className="flex justify-center gap-2">
            <input
              type="checkbox"
              checked={callingVisibility}
              onChange={(e) => setCallingVisibility(e.target.checked)}
            />
            <span>Calling visibility</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div className="grid-cols-0 lg:col-span-2"></div>
          <div className="col-span-1 lg:col-span-8 p-2 mb-4">
            <div className="flex flex-col gap-1 mb-4">
              <div className="flex items-center gap-2">
                <span className="font-bold">App ID: </span>
                <span>{agoraAuthInfo.appId}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">Channel: </span>
                <span>{agoraAuthInfo.channelName}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">Token: </span>
                <input
                  className="input-primary flex-1"
                  value={agoraAuthInfo.token}
                  onChange={(_) => {}}
                />
              </div>
            </div>
            {isUseUIKit && !!agoraAuthInfo && (
              <VideoCallUIKit agoraAuthInfo={agoraAuthInfo} />
            )}
            {!isUseUIKit && !!agoraAuthInfo && <VideoCallCustom />}
          </div>
          <div className="grid-cols-0 lg:col-span-2"></div>
        </div>
      </div>
    </VideoCallContext.Provider>
  );
}
