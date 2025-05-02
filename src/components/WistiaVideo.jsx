import React from "react";

const WistiaVideo = ({ videoId }) => {
  return (
    <div className="relative h-0 overflow-hidden max-w-full pb-[56.25%]">
      {" "}
      {/* 16:9 aspect ratio */}
      <iframe
        title="Wistia Video"
        src={`https://fast.wistia.net/embed/iframe/${videoId}`}
        allow="autoplay; fullscreen"
        className="absolute top-0 left-0 w-full h-full"
      ></iframe>
    </div>
  );
};

export default WistiaVideo;
