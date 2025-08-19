import React, { useState } from 'react';
import { SkipIcon } from './icons';

interface IntroVideoProps {
  videoSrc: string;
  onFinish: () => void;
}

export const IntroVideo: React.FC<IntroVideoProps> = ({ videoSrc, onFinish }) => {
  const [isFadingOut, setIsFadingOut] = useState(false);

  const handleFinish = () => {
    setIsFadingOut(true);
    // Wait for the fade-out animation to complete before calling onFinish
    setTimeout(onFinish, 500);
  };

  return (
    <div
      className={`fixed inset-0 bg-black z-[100] transition-opacity duration-500 ease-in-out ${
        isFadingOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <video
        src={videoSrc}
        autoPlay
        muted // Autoplay on most browsers requires the video to be muted
        onEnded={handleFinish}
        className="w-full h-full object-cover"
        playsInline // Important for iOS
      ></video>
      <button
        onClick={handleFinish}
        className="absolute bottom-6 right-6 bg-black/50 text-white px-5 py-2 rounded-full hover:bg-white/30 transition-all duration-300 backdrop-blur-sm flex items-center gap-2 animate-pulse-slow shadow-lg"
        style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}
        aria-label="Skip intro"
      >
        <span>ข้าม (Skip)</span>
        <SkipIcon className="w-5 h-5" />
      </button>
    </div>
  );
};

// Add keyframes for animation
const style = document.createElement('style');
style.innerHTML = `
@keyframes pulse-slow {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4);
  }
  50% {
    transform: scale(1.03);
    box-shadow: 0 0 0 8px rgba(255, 255, 255, 0);
  }
}
.animate-pulse-slow {
  animation: pulse-slow 2.5s infinite;
}
`;
document.head.appendChild(style);
