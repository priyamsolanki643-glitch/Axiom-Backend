"use client";
import React from 'react';

export function GyroLogo({ className = "", size = 24 }: { className?: string; size?: number }) {
  // We use a unique class name per size so the inline style doesn't conflict
  // but shares the same animation logic.
  const sizeClass = `gyro-mini-${size}`;

  return (
    <div className={`relative flex items-center justify-center shrink-0 ${className}`} style={{ width: size, height: size }}>
      <style>{`
        .${sizeClass} {
          position: relative;
          width: ${size}px;
          height: ${size}px;
          perspective: 800px;
          transform-style: preserve-3d;
        }
        .${sizeClass} .ring {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.4);
          transform-style: preserve-3d;
          box-shadow: inset 0 0 4px rgba(255, 255, 255, 0.1);
        }
        .${sizeClass} .ring-1 { border-color: rgba(255,255,255,0.8); animation: miniSpin1 2s linear infinite; }
        .${sizeClass} .ring-2 { border-color: rgba(255,255,255,0.4); animation: miniSpin2 2.5s linear infinite; }
        .${sizeClass} .ring-3 { border-color: rgba(255,255,255,0.2); animation: miniSpin3 3s linear infinite; }
        .${sizeClass} .core {
          position: absolute;
          top: 50%; left: 50%;
          width: ${Math.max(2, size * 0.25)}px; height: ${Math.max(2, size * 0.25)}px;
          margin-top: -${Math.max(2, size * 0.25)/2}px; margin-left: -${Math.max(2, size * 0.25)/2}px;
          background: #ffffff;
          border-radius: 50%;
          box-shadow: 0 0 ${size * 0.2}px rgba(255,255,255,0.9);
          animation: miniCorePulse 1.5s ease-in-out infinite alternate;
        }
        @keyframes miniSpin1 { 0% { transform: rotateX(65deg) rotateY(0deg) rotateZ(0deg); } 100% { transform: rotateX(65deg) rotateY(0deg) rotateZ(360deg); } }
        @keyframes miniSpin2 { 0% { transform: rotateX(0deg) rotateY(65deg) rotateZ(0deg); } 100% { transform: rotateX(0deg) rotateY(65deg) rotateZ(360deg); } }
        @keyframes miniSpin3 { 0% { transform: rotateX(45deg) rotateY(45deg) rotateZ(0deg); } 100% { transform: rotateX(45deg) rotateY(45deg) rotateZ(360deg); } }
        @keyframes miniCorePulse { 0% { transform: scale(0.8); opacity: 0.8; } 100% { transform: scale(1.2); opacity: 1; } }
      `}</style>
      <div className={sizeClass}>
        <div className="ring ring-1"></div>
        <div className="ring ring-2"></div>
        <div className="ring ring-3"></div>
        <div className="core"></div>
      </div>
    </div>
  );
}
