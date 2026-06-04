"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Menu, PenLine, Ellipsis, ArrowUp, Mic, Paperclip,
  Calendar, TrendingUp, Zap,
} from "lucide-react";

interface ChatViewProps {
  onOpenSidebar: () => void;
  onOpenVault: () => void;
}

interface Message {
  id: string;
  role: "user" | "fp";
  text: string;
}

const CHAT_SUGGESTIONS = [
  { emoji: "🗺️", label: "Map a 90-day execution sprint" },
  { emoji: "🔍", label: "Audit my last week of work" },
  { emoji: "⚡", label: "First-principles my biggest goal" },
  { emoji: "📍", label: "Find arbitrage in my locality" },
];

const STAT_CARDS = [
  { icon: Calendar,    label: "Sprint Day",   value: "14",  sub: "of 90",         color: "#818cf8" },
  { icon: TrendingUp,  label: "Consistency",  value: "73%", sub: "↑ vs last week", color: "#4ade80" },
  { icon: Zap,         label: "Streak",       value: "5d",  sub: "locked in",      color: "#fb923c" },
];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 5)  return "Good night.";
  if (h < 12) return "Good morning.";
  if (h < 17) return "Good afternoon.";
  if (h < 21) return "Good evening.";
  return "Good night.";
}

export function ChatView({ onOpenSidebar, onOpenVault }: ChatViewProps) {
  const [messages, setMessages]     = useState<Message[]>([]);
  const [input, setInput]           = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isThinking]);

  // Auto-resize textarea
  useEffect(() => {
    const ta = inputRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 200) + "px";
  }, [input]);

  const handleSend = async (textOverride?: string) => {
    const text = (textOverride ?? input).trim();
    if (!text || isThinking) return;

    setMessages((prev) => [...prev, { id: String(Date.now()), role: "user", text }]);
    setInput("");
    setIsThinking(true);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res  = await fetch(`${baseUrl}/api/v1/interaction/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();

      let reply = "System response received.";
      if (data?.error) {
        try { reply = "Backend Error: " + (JSON.parse(data.error)?.error?.message ?? data.error); }
        catch { reply = "Backend Error: " + data.error; }
      } else if (data?.data?.ai_response?.response_text) {
        reply = data.data.ai_response.response_text;
      } else if (data?.data?.engine_result?.data?.systemPrompt) {
        reply = "Prompt generated: " + data.data.engine_result.data.systemPrompt.substring(0, 100) + "…";
      }

      setMessages((prev) => [...prev, { id: String(Date.now()), role: "fp", text: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: String(Date.now()), role: "fp", text: "Connection to FP-OS core failed. Ensure backend is running on port 8000." },
      ]);
    } finally {
      setIsThinking(false);
      inputRef.current?.focus();
    }
  };

  const isInitial = messages.length === 0;

  return (
    <div className="flex-1 flex flex-col min-w-0 relative overflow-hidden" style={{ background: "#000" }}>
      {/* Very subtle top gradient */}
      <div
        className="pointer-events-none absolute top-0 left-0 right-0 h-24 z-0"
        style={{ background: "linear-gradient(to bottom, rgba(129,140,248,0.025), transparent)" }}
      />

      {/* ── Header ── */}
      <header
        className="relative z-10 flex items-center justify-between gap-2 px-3 md:px-5 h-14 shrink-0"
        style={{ borderBottom: "1px solid var(--border-soft)", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(20px)" }}
      >
        <div className="flex items-center gap-1.5">
          <button
            onClick={onOpenSidebar}
            className="lg:hidden size-9 grid place-items-center rounded-full cursor-pointer"
            style={{ color: "var(--text-secondary)" }}
          >
            <Menu className="size-[18px]" />
          </button>

          {/* Model selector */}
          <button
            className="flex items-center gap-1.5 px-2.5 h-8 rounded-full cursor-pointer transition-all duration-150 group"
            style={{ color: "var(--text-secondary)" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)";
              (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
              (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
            }}
          >
            <span className="font-display text-[16px] font-medium" style={{ color: "var(--text-primary)" }}>FP</span>
            <span className="font-display text-[16px]">Flash</span>
            <svg className="size-3.5 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-0.5">
          <HeaderIconBtn onClick={onOpenVault} label="New chat">
            <PenLine className="size-[17px]" />
          </HeaderIconBtn>
          <HeaderIconBtn label="Options">
            <Ellipsis className="size-[18px]" />
          </HeaderIconBtn>
        </div>
      </header>

      {/* ── Messages ── */}
      <div ref={scrollRef} className="relative z-10 flex-1 overflow-y-auto no-scrollbar px-4 md:px-8">
        <div className="max-w-2xl mx-auto py-6">

          {/* Empty state */}
          {isInitial && (
            <div className="pt-14 md:pt-20 space-y-8 animate-fade-up">
              {/* Greeting */}
              <div>
                <h2
                  className="font-display font-medium tracking-tight leading-[1.06]"
                  style={{ fontSize: "clamp(2.5rem,7vw,4rem)" }}
                >
                  <span className="shimmer-text">{getGreeting()}</span>
                </h2>
                <p className="mt-2.5 text-[16px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  What are we executing today?
                </p>
              </div>

              {/* Stat mini-cards */}
              <div className="grid grid-cols-3 gap-2.5">
                {STAT_CARDS.map(({ icon: Icon, label, value, sub, color }, i) => (
                  <div key={label} className={`stat-card animate-fade-up stagger-${i + 1}`}>
                    <Icon className="size-4 mb-2.5" style={{ color }} />
                    <div className="font-mono text-[20px] font-semibold leading-tight" style={{ color: "var(--text-primary)" }}>
                      {value}
                    </div>
                    <div className="font-mono text-[9px] tracking-[0.18em] uppercase mt-1" style={{ color: "var(--text-tertiary)" }}>
                      {label}
                    </div>
                    <div className="text-[11px] mt-0.5" style={{ color: "var(--text-tertiary)" }}>{sub}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          <div className={`space-y-5 ${isInitial ? "mt-8" : "pt-2"}`}>
            {messages.map((msg) =>
              msg.role === "user"
                ? <UserBubble key={msg.id} text={msg.text} />
                : <FPMessage  key={msg.id} text={msg.text} />
            )}

            {/* Thinking */}
            {isThinking && <ThinkingIndicator />}
          </div>
        </div>
      </div>

      {/* ── Input ── */}
      <div className="relative z-10 shrink-0 px-4 md:px-8 pb-5 pt-3">
        <div className="max-w-2xl mx-auto space-y-2.5">

          {/* Suggestion chips */}
          {isInitial && (
            <div className="flex flex-wrap gap-2">
              {CHAT_SUGGESTIONS.map(({ emoji, label }, i) => (
                <button
                  key={label}
                  onClick={() => handleSend(label)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-[13px] cursor-pointer transition-all duration-200 animate-fade-up stagger-${i + 1}`}
                  style={{
                    border: "1px solid var(--border-soft)",
                    background: "rgba(255,255,255,0.02)",
                    color: "var(--text-secondary)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.055)";
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--border-mid)";
                    (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)";
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--border-soft)";
                    (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
                  }}
                >
                  <span>{emoji}</span>
                  {label}
                </button>
              ))}
            </div>
          )}

          {/* Input box */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="relative rounded-[26px] input-focus-ring transition-all duration-200"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: inputFocused ? "1px solid hsla(243,80%,65%,0.3)" : "1px solid var(--border-soft)",
              boxShadow: inputFocused ? "0 0 0 3px hsla(243,80%,65%,0.07), 0 0 20px hsla(243,80%,65%,0.05)" : "none",
            }}
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask FP"
              rows={1}
              className="w-full bg-transparent outline-none resize-none px-5 pt-[14px] pb-1 text-[15px] leading-relaxed no-scrollbar"
              style={{
                color: "var(--text-primary)",
                maxHeight: "200px",
                overflowY: "auto",
              }}
            />

            <div className="flex items-center justify-between px-2 pb-2">
              {/* Left actions */}
              <button
                type="button"
                className="size-9 grid place-items-center rounded-full cursor-pointer transition-colors duration-150"
                style={{ color: "var(--text-tertiary)" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)";
                  (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                  (e.currentTarget as HTMLElement).style.color = "var(--text-tertiary)";
                }}
                aria-label="Attach"
              >
                <Paperclip className="size-[17px]" />
              </button>

              {/* Right: mic or send */}
              {input.trim() ? (
                <button
                  type="submit"
                  disabled={isThinking}
                  className="size-9 grid place-items-center rounded-full cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95"
                  style={{
                    background: "var(--text-primary)",
                    color: "#000",
                    boxShadow: inputFocused ? "0 0 16px rgba(242,239,232,0.2)" : "none",
                  }}
                  aria-label="Send"
                >
                  <ArrowUp className="size-4" />
                </button>
              ) : (
                <button
                  type="button"
                  className="size-9 grid place-items-center rounded-full cursor-pointer transition-colors duration-150"
                  style={{ color: "var(--text-tertiary)" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)";
                    (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                    (e.currentTarget as HTMLElement).style.color = "var(--text-tertiary)";
                  }}
                  aria-label="Voice"
                >
                  <Mic className="size-[17px]" />
                </button>
              )}
            </div>
          </form>

          {/* Status bar — VS Code terminal aesthetic */}
          <div className="flex items-center justify-between px-1">
            <span className="font-mono text-[10px]" style={{ color: "var(--text-tertiary)", letterSpacing: "0.12em" }}>
              FP-OS · Flash · 128k ctx
            </span>
            <span className="font-mono text-[10px]" style={{ color: "var(--text-tertiary)", letterSpacing: "0.12em" }}>
              Double-tap to open Vault
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── User bubble (right, glass pill, slides in from right) ── */
function UserBubble({ text }: { text: string }) {
  return (
    <div className="flex justify-end animate-msg-right">
      <div
        className="max-w-[82%] rounded-[20px] rounded-tr-[5px] px-4 py-3 text-[15px] leading-[1.65]"
        style={{
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.09)",
          color: "var(--text-primary)",
          backdropFilter: "blur(12px)",
        }}
      >
        {text}
      </div>
    </div>
  );
}

/* ── FP message (left, no bubble, with icon, slides in from left) ── */
function FPMessage({ text }: { text: string }) {
  return (
    <div className="flex gap-3 animate-msg-left pt-1">
      {/* FP avatar mark */}
      <div className="shrink-0 mt-0.5">
        <div
          className="size-[22px] rounded-full grid place-items-center font-display text-[9px] font-semibold"
          style={{
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "var(--text-secondary)",
          }}
        >
          FP
        </div>
      </div>
      {/* Text */}
      <p
        className="text-[15px] leading-[1.72] flex-1 whitespace-pre-wrap"
        style={{ color: "var(--text-primary)" }}
      >
        {text}
      </p>
    </div>
  );
}

/* ── Thinking indicator ── */
function ThinkingIndicator() {
  return (
    <div className="flex gap-3 animate-msg-left pt-1">
      <div
        className="size-[22px] rounded-full shrink-0 grid place-items-center font-display text-[9px] font-semibold mt-0.5"
        style={{
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.1)",
          color: "var(--text-secondary)",
        }}
      >
        FP
      </div>
      <div className="flex items-center gap-1.5 pt-1" style={{ color: "var(--text-secondary)" }}>
        <span className="thinking-dot" />
        <span className="thinking-dot" />
        <span className="thinking-dot" />
      </div>
    </div>
  );
}

/* ── Header icon button ── */
function HeaderIconBtn({
  children, onClick, label,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className="size-9 grid place-items-center rounded-full cursor-pointer transition-colors duration-150"
      style={{ color: "var(--text-secondary)" }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)";
        (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background = "transparent";
        (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
      }}
      aria-label={label}
    >
      {children}
    </button>
  );
}
