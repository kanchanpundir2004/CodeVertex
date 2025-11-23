// import { useState, useRef, useEffect } from "react";
// import { Pause, Play } from "lucide-react";

// const Editorial = ({ secureUrl, thumbnailUrl, duration }) => {
//   const videoRef = useRef(null);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [currentTime, setCurrentTime] = useState(0);
//   const [isHovering, setIsHovering] = useState(false);

//   // Format seconds to MM:SS
//   const formatTime = (seconds) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = Math.floor(seconds % 60);
//     return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
//   };

//   const togglePlayPause = () => {
//     if (videoRef.current) {
//       if (isPlaying) {
//         videoRef.current.pause();
//       } else {
//         videoRef.current.play();
//       }
//       setIsPlaying(!isPlaying);
//     }
//   };

//   // Update current time during playback
//   useEffect(() => {
//     const video = videoRef.current;

//     const handleTimeUpdate = () => {
//       if (video) setCurrentTime(video.currentTime);
//     };

//     if (video) {
//       video.addEventListener("timeupdate", handleTimeUpdate);
//       return () => video.removeEventListener("timeupdate", handleTimeUpdate);
//     }
//   }, []);

//   return (
//     <div
//       className="relative w-full max-w-2xl mx-auto rounded-xl overflow-hidden shadow-lg"
//       onMouseEnter={() => setIsHovering(true)}
//       onMouseLeave={() => setIsHovering(false)}
//     >
//       {/* Video Element */}
//       <video
//         ref={videoRef}
//         src={secureUrl}
//         poster={thumbnailUrl}
//         onClick={togglePlayPause}
//         className="w-full aspect-video bg-black cursor-pointer"
//       />

//       {/* Video Controls Overlay */}
//       <div
//         className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 transition-opacity ${
//           isHovering || !isPlaying ? "opacity-100" : "opacity-0"
//         }`}
//       >
//         {/* Play/Pause Button */}
//         <button
//           onClick={togglePlayPause}
//           className="btn btn-circle btn-primary mr-3"
//           aria-label={isPlaying ? "Pause" : "Play"}
//         >
//           {isPlaying ? <Pause /> : <Play />}
//         </button>

//         {/* Progress Bar */}
//         <div className="flex items-center w-full mt-2">
//           <span className="text-white text-sm mr-2">
//             {formatTime(currentTime)}
//           </span>
//           <input
//             type="range"
//             min="0"
//             max={duration}
//             value={currentTime}
//             onChange={(e) => {
//               if (videoRef.current) {
//                 videoRef.current.currentTime = Number(e.target.value);
//               }
//             }}
//             className="range range-primary range-xs flex-1"
//           />
//           <span className="text-white text-sm ml-2">
//             {formatTime(duration)}
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Editorial;

import { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
} from "lucide-react";

const Editorial = ({ secureUrl, thumbnailUrl, duration }) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  // STATES
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // FORMAT TIME MM:SS
  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // PLAY / PAUSE
  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) video.pause();
    else video.play();

    setIsPlaying(!isPlaying);
  };

  // UPDATE CURRENT TIME
  useEffect(() => {
    const video = videoRef.current;

    const updateTime = () => setCurrentTime(video.currentTime);
    video.addEventListener("timeupdate", updateTime);

    return () => video.removeEventListener("timeupdate", updateTime);
  }, []);

  // VOLUME CONTROL
  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    const newMuted = !isMuted;
    setIsMuted(newMuted);
    video.muted = newMuted;
  };

  const handleVolumeChange = (v) => {
    setVolume(v);
    videoRef.current.volume = v;
    if (v > 0) {
      setIsMuted(false);
      videoRef.current.muted = false;
    }
  };

  // FULLSCREEN HANDLER
  const toggleFullscreen = () => {
    const container = containerRef.current;

    if (!document.fullscreenElement) {
      container.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // KEYBOARD SHORTCUTS
  useEffect(() => {
    const handleKey = (e) => {
      if (!videoRef.current) return;

      if (e.code === "Space") {
        e.preventDefault();
        togglePlayPause();
      }
      if (e.code === "ArrowRight") videoRef.current.currentTime += 5;
      if (e.code === "ArrowLeft") videoRef.current.currentTime -= 5;
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isPlaying]);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-3xl mx-auto bg-black rounded-xl overflow-hidden shadow-2xl group"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* VIDEO ELEMENT */}
      <video
        ref={videoRef}
        src={secureUrl}
        poster={thumbnailUrl}
        className="w-full aspect-video"
        onClick={togglePlayPause}
      />

      {/* CENTER PLAY BUTTON */}
      {!isPlaying && (
        <button
          onClick={togglePlayPause}
          className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition"
        >
          <div className="bg-white/20 backdrop-blur-md p-5 rounded-full shadow-xl">
            <Play className="w-14 h-14 text-white" />
          </div>
        </button>
      )}

      {/* CONTROL BAR */}
      <div
        className={`absolute bottom-0 w-full px-4 py-3 bg-gradient-to-t from-black/90 to-transparent 
        transition-opacity duration-300 ${
          isHovering || !isPlaying ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex items-center gap-4">
          {/* Play/Pause */}
          <button
            onClick={togglePlayPause}
            className="text-white hover:text-gray-300 transition"
          >
            {isPlaying ? <Pause size={22} /> : <Play size={22} />}
          </button>

          {/* Current Time */}
          <span className="text-white text-sm">{formatTime(currentTime)}</span>

          {/* Progress Bar */}
          <input
            type="range"
            min="0"
            max={duration}
            step="0.1"
            value={currentTime}
            onChange={(e) => {
              videoRef.current.currentTime = Number(e.target.value);
            }}
            className="flex-1 range range-xs accent-red-600"
          />

          {/* Duration */}
          <span className="text-white text-sm">{formatTime(duration)}</span>

          {/* Volume */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleMute}
              className="text-white hover:text-gray-300"
            >
              {isMuted || volume === 0 ? (
                <VolumeX size={20} />
              ) : (
                <Volume2 size={20} />
              )}
            </button>

            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => handleVolumeChange(Number(e.target.value))}
              className="range range-xs w-24 accent-white"
            />
          </div>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="text-white hover:text-gray-300 transition"
          >
            {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Editorial;
