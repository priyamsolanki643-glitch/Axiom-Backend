"use client";

import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";

interface LandingPageProps {
  onLock: () => void;
}

const STATUS_ITEMS = [
  { label: "System nominal" },
  { label: "AES-256 encrypted" },
  { label: "Zero logs" },
];

export function LandingPage({ onLock }: LandingPageProps) {
  const [shutter, setShutter] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  const handleStart = () => {
    if (!shutter) {
      setShutter(true);
      setTimeout(onLock, 560);
    }
  };

  return (
    <div className="lp-root">
      {shutter && <div className="fixed inset-0 z-50 bg-white animate-shutter" />}

      {/* ── Header ── */}
      <header className="lp-header">
        <div className="lp-logo">
          <div className="lp-logo-dot" />
          <span className="lp-logo-text">FP</span>
        </div>
        <button className="lp-signin">Sign in</button>
      </header>

      {/* ── Hero ── */}
      <main className="lp-main">
        <div
          className="lp-hero"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
          }}
        >
          {/* Eyebrow */}
          <div className="lp-eyebrow">
            <span className="lp-eyebrow-dot" />
            Operating System for Human Ambition
          </div>

          {/* Headline */}
          <h1 className="lp-headline">
            Stop planning.
            <br />
            <span className="shimmer-text">Start executing.</span>
          </h1>

          {/* Subtext */}
          <p className="lp-subtext">
            A strategist and executioner that converts your ambition into
            raw, immutable daily action. No fluff. No excuses. No mercy.
          </p>

          {/* CTAs */}
          <div className="lp-cta-row">
            <button onClick={handleStart} className="lp-cta-primary">
              Get started
              <span className="lp-cta-icon">
                <ArrowRight size={15} />
              </span>
            </button>
            <button className="lp-cta-ghost">Read the manifesto →</button>
          </div>

          {/* Status strip */}
          <div className="lp-status-strip" style={{ opacity: visible ? 1 : 0, transition: "opacity 0.8s ease 0.5s" }}>
            {STATUS_ITEMS.map(({ label }, i) => (
              <div key={label} className="lp-status-item">
                {i === 0 && <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#4ade80", flexShrink: 0, display: "inline-block" }} />}
                {label}
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="lp-footer">
        <span>FP · 2026</span>
        <span style={{ color: "var(--text-tertiary)", letterSpacing: "0.14em" }}>
          v1.0.0-operator
        </span>
      </footer>
    </div>
  );
}
