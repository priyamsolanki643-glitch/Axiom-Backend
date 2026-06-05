"use client";

import React, { useState, useEffect, useRef } from "react";
import { ArrowUp, Paperclip, Check } from "lucide-react";

interface ChatViewProps {
  onOpenSidebar: () => void;
  onOpenVault: () => void;
}

interface Message {
  id: string;
  role: "user" | "fp";
  text: string;
}

const SUGGESTION_CARDS = [
  { label: "PLAN", title: "Map my next 7 days" },
  { label: "AUDIT", title: "Run the brutal mirror on me" },
  { label: "MARKET", title: "Where is my opportunity window?" },
  { label: "WRITE", title: "Draft a cold email that actually lands" },
];

export function ChatView({ onOpenSidebar, onOpenVault }: ChatViewProps) {
  const [messages, setMessages]     = useState<Message[]>([]);
  const [input, setInput]           = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLTextAreaElement>(null);

  // Global double tap listener for Vault
  useEffect(() => {
    let lastTap = 0;
    const handleDoubleTap = (e: MouseEvent | TouchEvent) => {
      // Don't trigger if typing in an input
      if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') return;
      
      const currentTime = new Date().getTime();
      const tapLength = currentTime - lastTap;
      if (tapLength < 500 && tapLength > 0) {
        onOpenVault();
        e.preventDefault();
      }
      lastTap = currentTime;
    };

    window.addEventListener("touchend", handleDoubleTap);
    window.addEventListener("click", handleDoubleTap);
    return () => {
      window.removeEventListener("touchend", handleDoubleTap);
      window.removeEventListener("click", handleDoubleTap);
    };
  }, [onOpenVault]);

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
      }

      setMessages((prev) => [...prev, { id: String(Date.now()), role: "fp", text: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: String(Date.now()), role: "fp", text: "Connection failed. Backend might be offline." },
      ]);
    } finally {
      setIsThinking(false);
      inputRef.current?.focus();
    }
  };

  const isInitial = messages.length === 0;

  return (
    <div className="flex-1 flex flex-col min-w-0 relative overflow-hidden" style={{ background: "#000" }}>

      {/* ── Top Header ── */}
      <header className="absolute top-0 left-0 right-0 h-16 flex items-center justify-between px-6 z-20">
        <div className="flex-1" />
        
        {/* Center Pill HUD */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#27272a] bg-[#09090b]">
          <div className="size-1.5 rounded-full bg-white" />
          <span className="text-[11px] font-medium text-white">JEE 2025 — week plan</span>
          <span className="text-[10px] text-[#52525b] mx-1">|</span>
          <span className="text-[10px] font-mono tracking-widest text-[#52525b]">LIVE</span>
        </div>

        {/* Right Vault Button */}
        <div className="flex-1 flex justify-end">
          <button 
            onClick={onOpenVault}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#27272a] bg-[#09090b] hover:bg-[#18181b] transition-colors"
          >
            <div className="size-[14px] border border-[#52525b] rounded-[3px] grid place-items-center">
              <span className="text-[8px] text-[#a1a1aa]">⌘</span>
            </div>
            <span className="text-[12px] font-medium text-white">Vault</span>
            <span className="text-[10px] text-[#52525b] font-mono ml-1">v</span>
          </button>
        </div>
      </header>

      {/* ── Messages / Empty State Area ── */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto no-scrollbar relative z-10 pt-16">
        <div className="max-w-[760px] mx-auto px-4 md:px-8 h-full flex flex-col">

          {isInitial ? (
            // Empty State
            <div className="flex-1 flex flex-col items-center justify-center -mt-16">
              
              <div className="text-[#52525b] font-mono text-[10px] tracking-[0.2em] mb-8">
                — TODAY —
              </div>
              
              <h1 className="text-[4rem] text-white tracking-tight mb-4 text-center leading-none">
                What are we <span className="font-serif italic text-white pr-2">shipping?</span>
              </h1>
              
              <p className="text-[#a1a1aa] text-[15px] mb-12">
                Ask anything. Or <span className="underline decoration-[#52525b] underline-offset-4 cursor-pointer hover:text-white" onClick={onOpenVault}>double-tap anywhere</span> to open the Vault.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-[640px]">
                {SUGGESTION_CARDS.map((card, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(card.title)}
                    className="flex flex-col text-left p-5 rounded-2xl border border-[#18181b] bg-[#09090b] hover:border-[#27272a] transition-all group"
                  >
                    <div className="text-[#52525b] font-mono text-[9px] tracking-widest uppercase mb-3 flex justify-between w-full">
                      {card.label}
                    </div>
                    <div className="text-[14px] text-white flex justify-between items-center w-full">
                      {card.title}
                      <ArrowUp className="size-3 text-[#52525b] rotate-45 group-hover:text-white transition-colors" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            // Messages list
            <div className="py-8 space-y-8 flex-1">
              {messages.map((msg) => (
                <div key={msg.id} className={msg.role === "user" ? "flex justify-end" : "flex justify-start"}>
                  <div className={`max-w-[85%] text-[15px] leading-relaxed ${
                    msg.role === "user" 
                      ? "bg-[#18181b] text-white px-5 py-3 rounded-2xl rounded-tr-sm" 
                      : "text-[#e4e4e7] whitespace-pre-wrap px-2"
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isThinking && (
                <div className="flex justify-start px-2">
                  <div className="text-[#a1a1aa] text-[15px] animate-pulse">Thinking...</div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* ── Input Box Area ── */}
      <div className="shrink-0 px-4 md:px-8 pb-8 pt-2 relative z-20">
        <div className="max-w-[760px] mx-auto">
          
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex items-center gap-3 p-2 rounded-full border border-[#18181b] bg-[#09090b] focus-within:border-[#27272a] transition-colors"
          >
            <button type="button" className="p-2 ml-1 text-[#52525b] hover:text-white rounded-full transition-colors">
              <Paperclip className="size-[18px]" />
            </button>

            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask anything. Shift + Enter for newline."
              rows={1}
              className="flex-1 bg-transparent outline-none resize-none text-[15px] text-white placeholder:text-[#52525b] py-3 no-scrollbar"
              style={{ maxHeight: 200 }}
            />

            <div className="flex items-center gap-3 mr-1">
              {input.trim() ? (
                <button
                  type="submit"
                  disabled={isThinking}
                  className="size-9 bg-white text-black rounded-full grid place-items-center hover:scale-105 transition-transform"
                >
                  <ArrowUp className="size-4" />
                </button>
              ) : (
                <>
                  <div className="hidden sm:flex items-center gap-1.5 text-[#52525b]">
                    <span className="text-[11px] font-medium">double-tap to open</span>
                    <span className="font-serif italic text-[12px] font-bold">Vault</span>
                  </div>
                  <div className="size-9 bg-[#18181b] text-[#52525b] rounded-full grid place-items-center">
                    <ArrowUp className="size-4" />
                  </div>
                </>
              )}
            </div>
          </form>

          <div className="mt-4 text-center">
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#3f3f46]">
              FP can be wrong. Verify before you ship.
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
