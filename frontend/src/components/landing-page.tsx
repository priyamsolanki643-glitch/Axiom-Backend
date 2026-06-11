"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { AuthModal } from "@/components/auth-modal";

interface LandingPageProps {
  onLock: () => void;
  hasSession: boolean;
}

export function LandingPage({ onLock, hasSession }: LandingPageProps) {
  const [isExiting, setIsExiting] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("signup");

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  const handleStart = () => {
    if (hasSession) {
      if (!isExiting) {
        setIsExiting(true);
        setTimeout(onLock, 500);
      }
    } else {
      setAuthMode("signup");
      setIsAuthOpen(true);
    }
  };

  const handleAuthSuccess = () => {
    setIsAuthOpen(false);
    if (!isExiting) {
      setIsExiting(true);
      setTimeout(onLock, 500);
    }
  };

  return (
    <div className="lp-root relative min-h-screen bg-black text-white flex flex-col justify-between overflow-hidden select-none font-sans">

      {/* Standard React CSS Injector */}
      <style>{`
        .lp-root {
          background-color: #000000 !important;
          background-image: none !important;
        }

        .monolith-glow {
          position: absolute;
          top: -20vh;
          left: 50%;
          transform: translateX(-50%);
          width: 80vw;
          height: 80vw;
          max-width: 1000px;
          max-height: 1000px;
          background: radial-gradient(circle, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0) 70%);
          border-radius: 50%;
          pointer-events: none;
        }

        /* The Mechanical Sweep Reveal for "Start executing." */
        .reveal-mask {
          position: relative;
          display: inline-block;
          overflow: hidden;
        }
        .reveal-mask::after {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 100%;
          height: 100%;
          background: #000000;
          animation: maskReveal 1.2s cubic-bezier(0.8, 0, 0.2, 1) forwards;
          animation-delay: 0.6s;
          border-left: 2px solid #ffffff; /* Optical cutting blade */
        }
        @keyframes maskReveal {
          0% { width: 100%; opacity: 1; }
          99% { width: 0%; opacity: 1; }
          100% { width: 0%; opacity: 0; border-left: none; }
        }

        /* Psychological Dominance CTA: Monolithic White Block */
        .btn-lumensky-core {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 16px 42px;
          border-radius: 0px; /* Sharp Machine Aesthetic */
          background: #ffffff;
          color: #000000;
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          font-size: 14px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), background 0.4s ease;
          overflow: hidden;
          z-index: 10;
        }

        .btn-lumensky-core:hover {
          transform: translateY(-2px) scale(1.02);
          background: #e0e0e0;
        }

        .btn-lumensky-core:active {
          transform: translateY(1px) scale(0.98);
        }

        .btn-lumensky-core .arrow-icon {
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .btn-lumensky-core:hover .arrow-icon {
          transform: translateX(4px);
        }

        .btn-signin-lumensky {
          background: transparent;
          border: none;
          cursor: pointer;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          padding: 8px 16px;
          color: rgba(255, 255, 255, 0.6);
          font-weight: 500;
          transition: color 0.3s ease;
        }
        .btn-signin-lumensky:hover {
          color: #ffffff;
        }

        .btn-login-lumensky {
          background: #ffffff;
          border: none;
          border-radius: 0px;
          cursor: pointer;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          padding: 8px 24px;
          color: #000000;
          font-weight: 600;
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .btn-login-lumensky:hover {
          transform: translateY(-1px);
          background: #e0e0e0;
        }
      `}</style>

      {/* ── Header ── */}
      <header 
        className="flex items-center justify-end px-6 py-5 md:px-12 relative z-10 w-full"
        style={{
          transition: "transform 500ms cubic-bezier(0.16, 1, 0.3, 1), opacity 500ms cubic-bezier(0.16, 1, 0.3, 1)",
          opacity: isExiting ? 0 : (visible ? 1 : 0),
          transform: isExiting ? "translate3d(0, -20px, 0) scale(0.95)" : (visible ? "translate3d(0, 0, 0) scale(1)" : "translate3d(0, -10px, 0) scale(0.98)"),
          willChange: "transform, opacity",
        }}
      >
        <div className="flex items-center gap-3">
          <button onClick={() => { setAuthMode("signup"); setIsAuthOpen(true); }} className="btn-signin-lumensky">Sign in</button>
          <button onClick={() => { setAuthMode("login"); setIsAuthOpen(true); }} className="btn-login-lumensky">Log in</button>
        </div>
      </header>

      {/* ── Hero Main Content ── */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center relative z-10 max-w-4xl mx-auto w-full pointer-events-none">
        <div className="monolith-glow"></div>
        <div 
          className="flex flex-col items-center w-full relative pointer-events-auto"
          style={{
            transition: "transform 600ms cubic-bezier(0.16, 1, 0.3, 1), opacity 600ms cubic-bezier(0.16, 1, 0.3, 1)",
            opacity: isExiting ? 0 : (visible ? 1 : 0),
            transform: isExiting ? "scale(0.85) translate3d(0, -60px, 0)" : (visible ? "scale(1) translate3d(0, 0, 0)" : "scale(0.95) translate3d(0, 20px, 0)"),
            willChange: "transform, opacity",
          }}
        >
          {/* Headline */}
          <h1 className="text-white font-medium font-display mb-6 flex flex-col items-center">
            {/* First Line - Stop planning. */}
            <div 
              className="tracking-tighter pb-1 text-white/95 leading-[1.1] whitespace-nowrap"
              style={{ fontSize: "clamp(1.8rem, 9.5vw, 5.0rem)", fontWeight: 300 }}
            >
              Stop planning.
            </div>
            
            {/* Second Line - Start executing. */}
            <div className="reveal-mask">
              <div 
                className="tracking-tighter pb-2 md:pb-4 leading-[1.15] whitespace-nowrap text-white"
                style={{ fontSize: "clamp(2.5rem, 12vw, 6.8rem)", fontWeight: 700, marginTop: "-0.05em" }}
              >
                Start executing.
              </div>
            </div>
          </h1>

          {/* Subtext */}
          <p className="text-[#a1a1aa] text-[13px] sm:text-[15px] md:text-[17px] leading-relaxed max-w-xl mx-auto mb-12 px-2 font-sans font-light tracking-wide">
            A strategist and executioner that converts your ambition into
            raw, immutable daily action. No fluff. No excuses. No mercy.
          </p>

          {/* Centered CTA Row */}
          <div className="flex justify-center w-full mt-2">
            <button onClick={handleStart} className="btn-lumensky-core group">
              <span>Get started</span>
              <ArrowRight size={18} className="arrow-icon opacity-80 group-hover:opacity-100" />
            </button>
          </div>
        </div>
      </main>

      {isAuthOpen && <AuthModal onClose={() => setIsAuthOpen(false)} onSuccess={handleAuthSuccess} initialMode={authMode} />}

      {/* ── Empty/Hidden Clean Footer ── */}
      <footer className="px-6 py-6 md:px-12 relative z-10 h-10 w-full" />
    </div>
  );
}
