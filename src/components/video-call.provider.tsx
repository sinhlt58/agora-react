import { createContext, useContext, useState } from "react";
import { VideoCallCustom } from "./video-call-custom";
// import {} from "agora-rtm-react";
// import {} from "agora-rtm-sdk";
import VideoCallUIKit from "./video-call-uikit";
// import {} from "agora-rtc-react";

interface VideoCallState {
  appId: string;
  channel: string;
  token: string;
}

export const VideoCallContext = createContext({} as VideoCallState);

export const useVideoCallContext = () => {
  return useContext(VideoCallContext);
};

interface Props {
  children?: React.ReactNode | React.ReactNode[];
}
export function VideoCallProvider({ children }: Props) {
  const appId = "b84167854ccb4b03a50ae63bfe79fee3";
  const channel = "demo-cross";
  const token =
    "007eJxTYAiVupl7Rl3eIr/T7xuXvbrkF+eQzhs11jbMnZ8bmCemiSgwJFmYGJqZW5iaJCcnmSQZGCeaGiSmmhknpaWaW6alphovXNuX3BDIyOCxwIuRkQECQXwuhpTU3Hzd5KL84mIGBgAjbR80";

  const [isUseUIKit, setIsUseUIKit] = useState(true);

  const value: VideoCallState = {
    appId,
    channel,
    token,
  };

  return (
    <VideoCallContext.Provider value={value}>
      <div className="flex flex-col h-screen w-full">
        <div className="flex justify-center gap-2">
          <input
            type="checkbox"
            checked={isUseUIKit}
            onChange={(e) => setIsUseUIKit(e.target.checked)}
          />
          <span>Use UIKIT</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div className="grid-cols-0 lg:col-span-2"></div>
          <div className="col-span-1 lg:col-span-8 p-2 mb-4">
            <div className="flex flex-col gap-1 mb-4">
              <div className="flex items-center gap-2">
                <span className="font-bold">App ID: </span>
                <span>{appId}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">Channel: </span>
                <span>{channel}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">Token: </span>
                <input
                  className="input-primary flex-1"
                  value={token}
                  onChange={(_) => {}}
                />
              </div>
            </div>
            {isUseUIKit && <VideoCallUIKit />}
            {!isUseUIKit && <VideoCallCustom />}
          </div>
          <div className="grid-cols-0 lg:col-span-2"></div>
        </div>
      </div>
    </VideoCallContext.Provider>
  );
}
