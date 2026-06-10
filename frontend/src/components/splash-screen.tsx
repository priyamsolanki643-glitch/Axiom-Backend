"use client";

import { useEffect, useState } from "react";

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    // Phase 1: Core appears and spins
    const t1 = setTimeout(() => setPhase(1), 300);
    // Phase 2: Lumensky text tracks in
    const t2 = setTimeout(() => setPhase(2), 1200);
    // Phase 3: Hyper-drive Flash
    const t3 = setTimeout(() => setPhase(3), 2800);
    // Phase 4: Fade out screen
    const t4 = setTimeout(() => {
      setPhase(4);
      setTimeout(onComplete, 800);
    }, 3400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  return (
    <div 
      className={`fixed inset-0 z-[9999] bg-black text-white flex flex-col items-center justify-center overflow-hidden transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${phase === 4 ? 'opacity-0' : 'opacity-100'}`}
    >
      {/* Background grain texture for premium cinematic feel */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
      />

      <style>{`
        .gyro-container {
          position: relative;
          width: 50px;
          height: 50px;
          perspective: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: opacity 1s ease, transform 1.5s cubic-bezier(0.16, 1, 0.3, 1);
          opacity: 0;
          transform: scale(0.8) translateY(10px);
        }
        .gyro-container.phase-1 {
          opacity: 1;
          transform: scale(1) translateY(0);
        }
        .gyro-container.phase-3 {
          animation: flashExpand 0.7s cubic-bezier(0.85, 0, 0.15, 1) forwards;
        }

        .gyro-core {
          position: absolute;
          width: 10px;
          height: 10px;
          background: #fff;
          border-radius: 50%;
          animation: corePulse 1.5s ease-in-out infinite alternate;
        }
        .gyro-ring {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          border: 1px solid transparent;
          border-top: 2px solid rgba(255,255,255,1);
          border-right: 1.5px solid rgba(255,255,255,0.4);
          border-left: 1px solid rgba(255,255,255,0.1);
        }
        .ring-1 { animation: spin1 1.4s linear infinite; }
        .ring-2 { animation: spin2 1.9s linear infinite; }
        .ring-3 { animation: spin3 2.4s linear infinite; }

        @keyframes spin1 { 
          0% { transform: rotateX(65deg) rotateY(0deg) rotateZ(0deg); }
          100% { transform: rotateX(65deg) rotateY(0deg) rotateZ(360deg); } 
        }
        @keyframes spin2 { 
          0% { transform: rotateX(0deg) rotateY(65deg) rotateZ(0deg); }
          100% { transform: rotateX(0deg) rotateY(65deg) rotateZ(360deg); } 
        }
        @keyframes spin3 { 
          0% { transform: rotateX(45deg) rotateY(45deg) rotateZ(0deg); }
          100% { transform: rotateX(45deg) rotateY(45deg) rotateZ(360deg); } 
        }
        @keyframes corePulse {
          0% { transform: scale(0.8); opacity: 0.6; box-shadow: 0 0 6px rgba(255,255,255,0.4); }
          100% { transform: scale(1.1); opacity: 1; box-shadow: 0 0 16px rgba(255,255,255,0.9); }
        }

        @keyframes flashExpand {
          0% { transform: scale(1); filter: blur(0px); opacity: 1; background-color: transparent; }
          40% { transform: scale(20); filter: blur(2px); opacity: 1; background-color: #fff; }
          100% { transform: scale(150); filter: blur(10px); opacity: 1; background-color: #fff; }
        }

        .lumensky-text {
          margin-top: 40px;
          font-family: 'Inter', sans-serif;
          font-weight: 300;
          font-size: 18px;
          letter-spacing: 0.5em;
          text-transform: uppercase;
          background: linear-gradient(90deg, #222 0%, #fff 50%, #222 100%);
          background-size: 200% auto;
          color: transparent;
          -webkit-background-clip: text;
          background-clip: text;
          opacity: 0;
          transition: opacity 0.5s ease;
        }
        .lumensky-text.phase-2 {
          opacity: 1;
          animation: textShimmer 3s cubic-bezier(0.4, 0, 0.2, 1) infinite, trackInText 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes textShimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes trackInText {
          0% { letter-spacing: 0.8em; transform: translateY(15px); }
          100% { letter-spacing: 0.5em; transform: translateY(0); }
        }
      `}</style>

      {/* 3D Gyroscopic Core */}
      <div className={`gyro-container z-20 ${phase >= 1 ? 'phase-1' : ''} ${phase >= 3 ? 'phase-3' : ''}`}>
        <div className="gyro-ring ring-1"></div>
        <div className="gyro-ring ring-2"></div>
        <div className="gyro-ring ring-3"></div>
        <div className="gyro-core"></div>
      </div>

      {/* Lumensky Wordmark */}
      <div 
        className={`lumensky-text z-10 ${phase >= 2 ? 'phase-2' : ''} ${phase >= 3 ? 'opacity-0 transition-opacity duration-300' : ''}`}
        style={{ marginRight: '-0.5em' }} // Compensate for last letter spacing to stay perfectly centered
      >
        Lumensky
      </div>
      
    </div>
  );
}
