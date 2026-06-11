import React, { useState, useEffect, useRef } from 'react';

export function OnboardingScreen({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [target, setTarget] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (step === 1 && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 500);
    }
  }, [step]);

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length > 0) {
      setStep(2);
    }
  };

  const handleTargetSelect = (selectedTarget: string) => {
    setTarget(selectedTarget);
    setStep(3);
  };

  useEffect(() => {
    if (step === 3) {
      setIsSyncing(true);
      // Simulate Neural Sync process before completing
      setTimeout(() => {
        onComplete();
      }, 3500);
    }
  }, [step, onComplete]);

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center text-white overflow-hidden font-sans z-[9000]">
      <style>{`
        /* Global Minimal Onboarding Styles */
        
        /* Step 1: Designation Input */
        .designation-input {
          background: transparent;
          border: none;
          outline: none;
          color: #ffffff;
          font-size: 28px;
          font-weight: 200;
          letter-spacing: 0.1em;
          text-align: center;
          width: 100%;
          caret-color: #ffffff;
        }
        .designation-input::placeholder { color: rgba(255,255,255,0.05); }
        .input-line {
          width: 250px;
          height: 1px;
          background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 100%);
          margin-top: 12px;
          transition: width 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease;
          opacity: 0.3;
        }
        .designation-input:focus + .input-line { 
          width: 400px; 
          opacity: 1;
        }

        /* Step 2: Monolithic Blocks */
        .target-block {
          width: 260px;
          padding: 28px;
          margin: 12px 0;
          border: 1px solid rgba(255,255,255,0.05);
          background: #000000;
          color: rgba(255,255,255,0.3);
          text-align: center;
          text-transform: uppercase;
          font-weight: 300;
          letter-spacing: 0.3em;
          cursor: pointer;
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: transform, background, color, border-color;
        }
        .target-block:hover {
          border-color: rgba(255,255,255,0.2);
          color: #ffffff;
          transform: translateZ(0) scale(1.02);
        }
        .target-block.selected {
          background: #ffffff;
          color: #000000;
          border-color: #ffffff;
          transform: translateZ(0) scale(1.05);
        }
        
        /* Mobile adjustment for blocks */
        @media (min-width: 768px) {
          .target-block { margin: 0 12px; }
        }

        /* Step 3: Neural Sync Wireframe */
        .sync-wireframe {
          width: 100px;
          height: 100px;
          position: relative;
          transform-style: preserve-3d;
          animation: spin3D 8s linear infinite;
        }
        .sync-wireframe::before, .sync-wireframe::after {
          content: '';
          position: absolute;
          inset: 0;
          border: 1px solid rgba(255,255,255,0.15);
        }
        .sync-wireframe::before { transform: translateZ(0) rotateX(45deg) rotateY(45deg); }
        .sync-wireframe::after { transform: translateZ(0) rotateX(-45deg) rotateY(-45deg); }

        @keyframes spin3D {
          0% { transform: translateZ(0) rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
          100% { transform: translateZ(0) rotateX(360deg) rotateY(360deg) rotateZ(180deg); }
        }

        .sync-flash {
          position: fixed;
          inset: 0;
          background: #ffffff;
          opacity: 0;
          pointer-events: none;
          z-index: 50;
          transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        /* Trigger the flash right before completing */
        .sync-flash.active { 
          opacity: 1; 
          transition-delay: 2.8s; 
        }
      `}</style>

      {/* STEP 1: DESIGNATION */}
      <div 
        className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000 ease-in-out ${
          step === 1 ? 'opacity-100 z-10' : 'opacity-0 scale-95 pointer-events-none'
        }`}
      >
        <h1 className="text-[10px] md:text-[12px] uppercase tracking-[0.8em] md:tracking-[1em] text-white/30 mb-16 font-light pl-[0.8em]">
          Initialize Connection
        </h1>
        <form onSubmit={handleNameSubmit} className="flex flex-col items-center w-full px-8">
          <input 
            ref={inputRef}
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="DESIGNATION" 
            className="designation-input"
            spellCheck="false"
            autoComplete="off"
            autoFocus
          />
          <div className="input-line"></div>
          
          {/* Subtle hint to press enter, only shows when typed */}
          <div className={`mt-12 text-[10px] uppercase tracking-[0.3em] text-white/20 transition-opacity duration-500 ${name.length > 0 ? 'opacity-100' : 'opacity-0'}`}>
            Press Enter to Confirm
          </div>
        </form>
      </div>

      {/* STEP 2: TRAJECTORY */}
      <div 
        className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000 ease-in-out delay-300 ${
          step === 2 ? 'opacity-100 z-10' : 'opacity-0 scale-95 pointer-events-none'
        }`}
      >
        <h1 className="text-[10px] md:text-[12px] uppercase tracking-[0.8em] md:tracking-[1em] text-white/30 mb-16 font-light pl-[0.8em]">
          Establish Trajectory
        </h1>
        <div className="flex flex-col md:flex-row items-center justify-center">
          {['JEE Advanced', 'NEET UG', 'Foundation'].map((exam) => (
            <div 
              key={exam}
              onClick={() => handleTargetSelect(exam)}
              className={`target-block ${target === exam ? 'selected' : ''}`}
            >
              {exam}
            </div>
          ))}
        </div>
      </div>

      {/* STEP 3: NEURAL SYNC */}
      <div 
        className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000 ease-in-out delay-300 ${
          step === 3 ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="sync-wireframe mb-20"></div>
        <div className="text-[11px] uppercase tracking-[1em] font-light text-white/70 pl-[1em] animate-pulse">
          Syncing
        </div>
        
        {/* The blinding white flash before transitioning to the app */}
        <div className={`sync-flash ${isSyncing ? 'active' : ''}`}></div>
      </div>

    </div>
  );
}
