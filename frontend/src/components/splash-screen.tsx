import React, { useEffect, useState } from 'react';

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    // Phase 0: Pure Void (0ms)
    // Phase 1: Accretion Disk Ignition (200ms)
    // Phase 2: Gravitational Compression (1600ms)
    // Phase 3: The Void Devours (2400ms)
    // Phase 4: Lumensky Monolith Emergence (2550ms)
    // Phase 5: Fade Sequence Initiated (4200ms)
    const timers = [
      setTimeout(() => setPhase(1), 200),
      setTimeout(() => setPhase(2), 1600),
      setTimeout(() => setPhase(3), 2400),
      setTimeout(() => setPhase(4), 2550),
      setTimeout(() => setPhase(5), 4200),
      setTimeout(() => onComplete(), 5000),
    ];

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div 
      className={`fixed inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden transition-opacity duration-700 ease-in-out ${phase === 5 ? 'opacity-0' : 'opacity-100'}`}
    >
      <style>{`
        /* The Eclipse Base */
        .eclipse-container {
          position: absolute;
          width: 160px;
          height: 160px;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
        }

        /* 1. Deep Core Glow */
        .eclipse-core-glow {
          position: absolute;
          width: 140px;
          height: 140px;
          border-radius: 50%;
          background: #ffffff;
          filter: blur(25px);
          opacity: 0;
          transform: translateZ(0) scale(0.8);
          transition: transform 2.5s cubic-bezier(0.25, 1, 0.5, 1), opacity 2s ease;
          will-change: transform, opacity;
        }
        .eclipse-core-glow.phase-1 {
          opacity: 0.6;
          transform: translateZ(0) scale(1.2);
        }
        .eclipse-core-glow.phase-2 {
          opacity: 1;
          transform: translateZ(0) scale(0.9); /* Tension compression */
        }
        .eclipse-core-glow.phase-3 {
          opacity: 0;
          transform: translateZ(0) scale(0);
          transition: transform 0.5s cubic-bezier(0.8, 0, 0.2, 1), opacity 0.3s ease;
        }

        /* 2. The Accretion Disk (Rotational Light) */
        .corona-wrapper {
          position: absolute;
          width: 150px;
          height: 150px;
          border-radius: 50%;
          opacity: 0;
          transform: translateZ(0) scale(0.8);
          transition: transform 2.5s cubic-bezier(0.25, 1, 0.5, 1), opacity 2s ease;
          filter: blur(8px); 
          will-change: transform, opacity;
        }
        .corona-wrapper.phase-1 {
          opacity: 1;
          transform: translateZ(0) scale(1.1);
        }
        .corona-wrapper.phase-2 {
          transform: translateZ(0) scale(0.95);
        }
        .corona-wrapper.phase-3 {
          opacity: 0;
          transform: translateZ(0) scale(0);
          transition: transform 0.4s ease-in, opacity 0.2s ease-in;
        }

        .corona-spin {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: conic-gradient(from 0deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 20%, rgba(255,255,255,0) 50%, rgba(255,255,255,1) 70%, rgba(255,255,255,0) 100%);
          animation: spin 3s linear infinite;
        }
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }

        /* 3. The Void (The Black Hole) */
        .eclipse-void {
          position: absolute;
          width: 142px;
          height: 142px;
          border-radius: 50%;
          background: #000000;
          transform: translateZ(0) scale(1);
          z-index: 20;
          transition: transform 1.2s cubic-bezier(0.8, 0, 0.2, 1);
          will-change: transform;
        }
        .eclipse-void.phase-3 {
          transform: translateZ(0) scale(40); /* Exponentially devours the screen */
        }

        /* 4. The Lumensky Monolith Text */
        .lumensky-god-text {
          position: absolute;
          z-index: 30;
          font-family: 'Inter', sans-serif;
          font-weight: 200;
          font-size: 26px;
          letter-spacing: 1.5em; /* Extreme wide tracking */
          padding-left: 1.5em; /* Optical centering */
          text-transform: uppercase;
          color: #ffffff;
          opacity: 0;
          filter: blur(12px);
          transform: translateZ(0) scale(0.9) translateY(10px);
          transition: opacity 1.8s cubic-bezier(0.16, 1, 0.3, 1),
                      filter 1.8s cubic-bezier(0.16, 1, 0.3, 1),
                      transform 1.8s cubic-bezier(0.16, 1, 0.3, 1),
                      letter-spacing 1.8s cubic-bezier(0.16, 1, 0.3, 1),
                      padding-left 1.8s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: transform, opacity, filter, letter-spacing;
        }
        .lumensky-god-text.phase-4 {
          opacity: 1;
          filter: blur(0px);
          transform: translateZ(0) scale(1) translateY(0);
          letter-spacing: 0.5em; /* Perfect resting lock */
          padding-left: 0.5em;
        }
      `}</style>

      {/* The Eclipse Event */}
      <div className="eclipse-container">
        <div className={`eclipse-core-glow ${phase >= 1 ? `phase-${phase}` : ''}`}></div>
        <div className={`corona-wrapper ${phase >= 1 ? `phase-${phase}` : ''}`}>
          <div className="corona-spin"></div>
        </div>
        <div className={`eclipse-void ${phase >= 3 ? 'phase-3' : ''}`}></div>
      </div>

      {/* The Monolith Emergence */}
      <div className={`lumensky-god-text ${phase >= 4 ? 'phase-4' : ''}`}>
        Lumensky
      </div>

    </div>
  );
}
