/**
 * @module AgoraUIKit
 */
import React, { useContext } from "react";
import {
  GridVideo,
  layout,
  LocalControls,
  LocalUserContext,
  PinnedVideo,
  PropsContext,
  PropsInterface,
  RemoteMutePopUp,
  RtmConfigure,
} from "agora-react-uikit";

import { RtcConfigureJs } from "./agora-uikit-import";
import TracksConfigureCustom from "./TracksConfigureCustom";

/**
 * High level component to render the UI Kit
 * @param props {@link PropsInterface}
 */
const AgoraUIKitCustom: React.FC<PropsInterface> = (props) => {
  const { styleProps, rtcProps } = props;
  const { UIKitContainer } = styleProps || {};

  return (
    <PropsContext.Provider value={props}>
      <div
        style={{
          ...style,
          ...UIKitContainer,
        }}
      >
        {rtcProps.role === "audience" ? (
          <VideocallUI />
        ) : (
          <TracksConfigureCustom>
            <VideocallUI />
          </TracksConfigureCustom>
        )}
      </div>
    </PropsContext.Provider>
  );
};

export const VideocallUI = () => {
  const { rtcProps } = useContext(PropsContext);
  return (
    <RtcConfigureJs callActive={rtcProps.callActive}>
      <LocalUserContext>
        {rtcProps.disableRtm ? (
          <React.Fragment>
            {rtcProps?.layout === layout.grid ? <GridVideo /> : <PinnedVideo />}
            <LocalControls />
          </React.Fragment>
        ) : (
          <RtmConfigure>
            <RemoteMutePopUp />
            {rtcProps?.layout === layout.grid ? <GridVideo /> : <PinnedVideo />}
            <LocalControls />
          </RtmConfigure>
        )}
      </LocalUserContext>
    </RtcConfigureJs>
  );
};

const style = {
  display: "flex",
  flex: 1,
  minHeight: 0,
  flexDirection: "column",
} as React.CSSProperties;

export default AgoraUIKitCustom;
