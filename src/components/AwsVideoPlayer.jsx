import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, Loader } from "lucide-react";

function AwsVideoPlayer({
  videoUrl,
  title = "Video",
  poster = null,
  className = "",
  autoPlay = false,
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef(null);

  // Auto-play effect when component mounts and autoPlay is true
  useEffect(() => {
    if (autoPlay && videoRef.current && !hasError) {
      const timer = setTimeout(() => {
        videoRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch((error) => {
            console.log("Auto-play failed:", error);
            // Auto-play failed, which is normal in many browsers
          });
      }, 100); // Small delay to ensure video is loaded

      return () => clearTimeout(timer);
    }
  }, [autoPlay, hasError]);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch((error) => {
            console.log("Play failed:", error);
            setHasError(true);
          });
      }
    }
  };

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedData = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setIsLoading(false);
    }
  };

  const handleSeek = (e) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentage = clickX / rect.width;
      const newTime = percentage * duration;
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  if (!videoUrl) {
    return (
      <div
        className={`relative bg-gray-100 rounded-lg overflow-hidden ${className}`}
      >
        <div className="flex items-center justify-center h-48 text-gray-500">
          No video available
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div
        className={`relative bg-gray-100 rounded-lg overflow-hidden ${className}`}
      >
        <div className="flex flex-col items-center justify-center h-48 text-gray-500">
          <div className="text-red-500 mb-2">Failed to load video</div>
          <div className="text-sm">Please check your internet connection</div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative bg-black rounded-lg overflow-hidden group ${className}`}
    >
      <video
        ref={videoRef}
        src={videoUrl}
        poster={poster}
        className="w-full h-full object-cover"
        onTimeUpdate={handleTimeUpdate}
        onLoadedData={handleLoadedData}
        onPlay={handlePlay}
        onPause={handlePause}
        onError={handleError}
        onWaiting={() => setIsLoading(true)}
        onCanPlay={() => setIsLoading(false)}
        preload="metadata"
        playsInline
      />

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <Loader className="h-8 w-8 text-white animate-spin" />
        </div>
      )}

      {/* Play/Pause overlay */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button
          onClick={handlePlayPause}
          className="bg-black bg-opacity-50 text-white p-4 rounded-full hover:bg-opacity-75 transition-all duration-200"
          aria-label={isPlaying ? "Pause video" : "Play video"}
        >
          {isPlaying ? (
            <Pause className="h-8 w-8" />
          ) : (
            <Play className="h-8 w-8 ml-1" />
          )}
        </button>
      </div>

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {/* Progress bar */}
        <div
          className="w-full h-2 bg-white bg-opacity-30 rounded-full mb-3 cursor-pointer"
          onClick={handleSeek}
        >
          <div
            className="h-full bg-white rounded-full transition-all duration-200"
            style={{
              width: `${duration ? (currentTime / duration) * 100 : 0}%`,
            }}
          />
        </div>

        {/* Control buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={handlePlayPause}
              className="text-white hover:text-gray-300 transition-colors"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5" />
              )}
            </button>

            <button
              onClick={handleMuteToggle}
              className="text-white hover:text-gray-300 transition-colors"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? (
                <VolumeX className="h-5 w-5" />
              ) : (
                <Volume2 className="h-5 w-5" />
              )}
            </button>

            <div className="text-white text-sm">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          <button
            onClick={handleFullscreen}
            className="text-white hover:text-gray-300 transition-colors"
            aria-label="Fullscreen"
          >
            <Maximize className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default AwsVideoPlayer;
