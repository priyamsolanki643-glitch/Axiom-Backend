"use client";

import React, { useState, useRef } from "react";
import { ArrowUp, Share2, Square, Lock, AlertTriangle, Target } from "lucide-react";
import html2canvas from "html2canvas";
import { supabase } from "@/utils/supabase/client";

export default function AuditPage() {
  const [input, setInput] = useState("I woke up at 11 AM, scrolled reels for 3 hours, attended one lecture, and watched Netflix.");
  const [isThinking, setIsThinking] = useState(false);
  const [result, setResult] = useState<{ roast: string; averageScore: number } | null>(null);
  const [email, setEmail] = useState("");
  const [waitlistSuccess, setWaitlistSuccess] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);

  const handleAudit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isThinking) return;

    setIsThinking(true);
    setResult(null);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      const res = await fetch(`${baseUrl}/api/v1/interaction/roast`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ routine: input }),
      });
      const json = await res.json();
      if (json.data) {
        setResult(json.data);
      }
      setInput(""); // clear after first use
    } catch (err) {
      console.error("Audit failed", err);
      setResult({ roast: "System offline. Lucky for you, average is safe today.", averageScore: 99 });
    } finally {
      setIsThinking(false);
    }
  };

  const handleShare = async () => {
    if (!cardRef.current) return;
    try {
      const canvas = await html2canvas(cardRef.current, { backgroundColor: '#000000', scale: 2 });
      const dataUrl = canvas.toDataURL("image/png");
      
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], 'lumensky-reality-check.png', { type: blob.type });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'My Reality Check',
          text: 'The AI brutalized my daily routine. I am officially average.',
          files: [file]
        });
      } else {
        // Fallback to download
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = 'lumensky-reality-check.png';
        a.click();
      }
    } catch (err) {
      console.error("Failed to share image", err);
    }
  };

  const handleJoinWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    // We can insert into a supabase table or simply fake the response for the MVP
    // Here we'll do a simple insert if table exists, otherwise just show success.
    try {
      await supabase.from('early_access_waitlist').insert([{ email }]);
    } catch (e) {}
    
    setWaitlistSuccess(true);
  };

  return (
    <div className="min-h-screen w-full bg-[#000000] text-white font-sans overflow-y-auto selection:bg-cyan-900 selection:text-white">
      
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-red-900/10 blur-[120px] rounded-full" />
        <div className="absolute top-[60%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-cyan-900/5 blur-[100px] rounded-full" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-12 flex flex-col items-center">
        
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-500/20 bg-red-500/10 mb-6">
            <AlertTriangle className="size-3.5 text-red-400" />
            <span className="font-mono text-[10px] text-red-400 uppercase tracking-widest">Public Interrogation</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white to-[#71717a] mb-4">
            The Reality Check
          </h1>
          <p className="text-[#a1a1aa] text-sm md:text-base font-medium max-w-md mx-auto">
            Input your real daily routine. Let an elite, unhinged AI auditor predict your future. 
          </p>
        </div>

        {/* Input Form */}
        <div className="w-full max-w-lg mb-12">
          <form 
            onSubmit={handleAudit}
            className={`relative flex items-center bg-[#09090b] border transition-all duration-300 rounded-[20px] p-2 ${
              isInputFocused ? "border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.15)]" : "border-white/10"
            }`}
          >
            <div className="pl-4 shrink-0">
              <span className="font-mono text-xs text-[#52525b] select-none">routine:~#</span>
            </div>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
              placeholder="What did you do today? Tell the truth."
              className="flex-1 bg-transparent border-none outline-none text-white font-sans text-[15px] px-3 py-3 placeholder:text-[#3f3f46]"
              disabled={isThinking}
            />
            <button
              type="submit"
              disabled={isThinking || !input.trim()}
              className={`shrink-0 size-10 rounded-[14px] flex items-center justify-center transition-all ${
                input.trim() 
                  ? "bg-white text-black hover:bg-gray-200" 
                  : "bg-[#18181b] text-[#52525b]"
              }`}
            >
              {isThinking ? (
                <Square className="size-4 fill-red-500 text-red-500 animate-pulse" />
              ) : (
                <ArrowUp className="size-5 stroke-[2.5]" />
              )}
            </button>
          </form>
          
          <div className="mt-4 flex items-center justify-center gap-4 text-[10px] text-[#52525b] font-mono">
            <span className="flex items-center gap-1"><Lock className="size-3" /> Anonymous</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Target className="size-3" /> Brutally Honest</span>
          </div>
        </div>

        {/* The Reveal */}
        {result && (
          <div className="w-full animate-fade-in flex flex-col items-center">
            
            {/* Downloadable Card */}
            <div 
              ref={cardRef} 
              className="w-full max-w-sm bg-[#050505] border border-white/10 rounded-3xl p-8 relative overflow-hidden shadow-2xl"
              style={{ backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(30,30,30,1) 0%, rgba(5,5,5,1) 100%)' }}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <div className="size-5 bg-white rounded-full flex items-center justify-center">
                    <div className="size-2.5 bg-black rounded-full" />
                  </div>
                  <span className="font-bold text-xs uppercase tracking-widest text-white">Lumensky</span>
                </div>
                <span className="font-mono text-[9px] text-[#71717a]">ID: #{Math.floor(Math.random() * 90000) + 10000}</span>
              </div>
              
              {/* Human Roast */}
              <div className="font-serif text-[15px] leading-relaxed text-[#e4e4e7] mb-8 relative z-10">
                "{result.roast}"
              </div>
              
              {/* Verdict Footer */}
              <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between relative z-10">
                <div>
                  <div className="text-[10px] font-mono text-[#71717a] uppercase mb-1">System Verdict</div>
                  <div className={`text-lg font-black uppercase tracking-tight ${
                    result.averageScore > 80 ? 'text-red-500' : 'text-cyan-400'
                  }`}>
                    {result.averageScore}% AVERAGE
                  </div>
                </div>
                <div className="text-[8px] font-mono text-[#52525b] text-right uppercase leading-tight">
                  Audited by<br/>lumensky.space
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex gap-4 w-full max-w-sm">
              <button 
                onClick={handleShare}
                className="flex-1 h-12 rounded-xl bg-[#18181b] border border-white/10 hover:border-white/30 text-white font-medium text-sm flex items-center justify-center gap-2 transition-all group"
              >
                <Share2 className="size-4 group-hover:scale-110 transition-transform" />
                Share To Flex
              </button>
            </div>

            {/* Waitlist Trap */}
            <div className="mt-16 w-full max-w-md bg-[#09090b] border border-red-500/20 rounded-2xl p-6 text-center">
              <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-2">
                Dare To EscapE The Average?
              </h3>
              <p className="text-[#a1a1aa] text-[13px] leading-relaxed mb-6">
                Lumensky OS is an invite-only execution environment for the top 1%. You are probably too weak for it. Or you can prove me wrong.
              </p>
              
              {!waitlistSuccess ? (
                <form onSubmit={handleJoinWaitlist} className="flex gap-2">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="flex-1 bg-[#18181b] border border-white/5 rounded-xl px-4 text-sm text-white placeholder:text-[#52525b] outline-none focus:border-red-500/30 transition-colors"
                  />
                  <button 
                    type="submit"
                    className="px-5 h-12 rounded-xl bg-red-500 text-white font-bold text-xs uppercase tracking-wider hover:bg-red-600 transition-colors"
                  >
                    Request
                  </button>
                </form>
              ) : (
                <div className="h-12 rounded-xl border border-green-500/20 bg-green-500/10 flex items-center justify-center text-green-400 font-bold text-[11px] uppercase tracking-widest">
                  Position Secured. Wait For The Invite.
                </div>
              )}
            </div>

          </div>
        )}

      </div>
      
      {/* Global CSS for animations */}
      <style>{`
        .animate-fade-in-up {
          animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
