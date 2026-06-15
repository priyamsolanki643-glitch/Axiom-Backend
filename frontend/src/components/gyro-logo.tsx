"use client";
import React from 'react';

export function GyroLogo({ className = "", size = 24 }: { className?: string; size?: number }) {
  // The original splash screen container is 60px.
  // We compute the scale factor to fit the requested size exactly.
  const scale = size / 60;

  return (
    <div 
      className={`relative flex items-center justify-center shrink-0 ${className}`} 
      style={{ width: size, height: size }}
    >
      <style>{`
        .gyro-container-exact {
          position: relative;
          width: 60px;
          height: 60px;
          perspective: 1000px;
          transform-style: preserve-3d;
          display: flex;
          align-items: center;
          justify-content: center;
          /* Scale it down to match the requested size container perfectly */
          transform: scale(${scale});
          transform-origin: center center;
        }

        .gyro-core-exact {
          position: absolute;
          width: 3px;
          height: 3px;
          background: #ffffff;
          border-radius: 50%;
          animation: corePulseExact 2s cubic-bezier(0.4, 0, 0.2, 1) infinite alternate;
        }

        .gyro-ring-exact {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.06);
          border-top: 1px solid rgba(255,255,255,0.8);
          border-right: 1px solid rgba(255,255,255,0.3);
          box-shadow: inset 0 0 10px rgba(255,255,255,0.02),
                      -1px 0 3px rgba(255, 255, 255, 0.2), /* Subtle white blur */
                      1px 0 3px rgba(255, 255, 255, 0.4);  /* Sharp white edge */
          transform-style: preserve-3d;
        }

        .ring-exact-1 { animation: spinExact1 1.8s linear infinite; }
        .ring-exact-2 { animation: spinExact2 2.4s linear infinite; }
        .ring-exact-3 { animation: spinExact3 3s linear infinite; }

        @keyframes spinExact1 { 
          0% { transform: rotateX(65deg) rotateY(0deg) rotateZ(0deg); }
          100% { transform: rotateX(65deg) rotateY(0deg) rotateZ(360deg); } 
        }
        @keyframes spinExact2 { 
          0% { transform: rotateX(0deg) rotateY(65deg) rotateZ(0deg); }
          100% { transform: rotateX(0deg) rotateY(65deg) rotateZ(360deg); } 
        }
        @keyframes spinExact3 { 
          0% { transform: rotateX(45deg) rotateY(45deg) rotateZ(0deg); }
          100% { transform: rotateX(45deg) rotateY(45deg) rotateZ(360deg); } 
        }
        
        @keyframes corePulseExact {
          0% { transform: scale(0.5); opacity: 0.3; box-shadow: 0 0 2px rgba(255,255,255,0.1); }
          100% { transform: scale(1.5); opacity: 1; box-shadow: 0 0 15px rgba(255,255,255,1); }
        }
      `}</style>

      {/* 
        This is the EXACT inner structure of the splash screen gyro-container, 
        but wrapped in our scaled container so it fits dynamically.
      */}
      <div className="gyro-container-exact">
        <div className="gyro-ring-exact ring-exact-1"></div>
        <div className="gyro-ring-exact ring-exact-2"></div>
        <div className="gyro-ring-exact ring-exact-3"></div>
        <div className="gyro-core-exact"></div>
      </div>
    </div>
  );
}
