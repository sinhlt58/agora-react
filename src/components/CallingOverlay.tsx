import { useRef, useEffect } from "react";

interface Props {
  name: string;
  callingText?: string;
  playAudio?: boolean;
}
export const CallingOverlay = ({
  name,
  callingText = "Calling...",
  playAudio = true,
}: Props) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  return (
    <>
      <div
        style={{
          position: "absolute",
          display: "flex",
          flexDirection: "column",
          left: "50%",
          top: "50%",
          transform: "translate(-50%) translateY(-50%)",
          alignItems: "center",
          gap: 4,
          width: "100%",
        }}
      >
        <img
          style={{
            width: "15%",
            aspectRatio: 1,
            borderRadius: "100%",
          }}
          src="https://placeimg.com/400/400/people"
          alt=""
          width="135"
        />
        <h1
          style={{
            color: "white",
            fontWeight: "bold",
          }}
        >
          {name}
        </h1>
        <span
          style={{
            color: "white",
          }}
        >
          {callingText}
        </span>
      </div>
      <audio
        ref={audioRef}
        src={"/calling_sound.mp3"}
        style={{ opacity: 0 }}
        autoPlay={playAudio}
        onEnded={() => {
          if (!playAudio) return;

          if (audioRef.current) {
            audioRef.current.currentTime = 0;
          }
          const delay = setTimeout(() => {
            audioRef.current?.play();
            clearTimeout(delay);
          }, 2000);
        }}
      />
    </>
  );
};
