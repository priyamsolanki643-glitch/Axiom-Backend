"use client";

import { useState, useEffect } from "react";
import {
  Lock, X, ArrowUpRight, TrendingUp, CheckCircle, XCircle
} from "lucide-react";

type TabId = "missions" | "mirror" | "debt" | "rival" | "market";

interface VaultModalProps {
  onClose: () => void;
}

const TABS: { id: TabId; label: string; num: string }[] = [
  { id: "missions", label: "Mission Folders", num: "1" },
  { id: "mirror",   label: "Reality Mirror",  num: "2" },
  { id: "debt",     label: "Execution Debt",  num: "3" },
  { id: "rival",    label: "Rival Index",     num: "4" },
  { id: "market",   label: "Market Analyser", num: "5" },
];

export function VaultModal({ onClose }: VaultModalProps) {
  const [activeTab, setActiveTab] = useState<TabId>("rival");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 10);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
      />

      {/* Modal Container */}
      <div
        className={`relative w-full max-w-[1100px] h-[85vh] flex flex-col bg-[#09090b] border border-[#18181b] rounded-3xl overflow-hidden transition-all duration-300 ${
          mounted ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-[0.98]"
        }`}
        style={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.75)" }}
      >
        {/* Header Top Bar */}
        <div className="flex items-center justify-between px-6 h-14 border-b border-[#18181b] shrink-0 bg-[#09090b]">
          <div className="flex items-center gap-3">
            <div className="size-[22px] border border-[#27272a] rounded-md grid place-items-center bg-[#18181b]">
              <span className="text-[10px] text-[#a1a1aa] font-medium">⌘</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[15px] text-white tracking-tight">Vault</span>
              <span className="text-[9px] font-mono border border-[#27272a] text-[#a1a1aa] px-1.5 py-0.5 rounded tracking-widest bg-[#18181b]">OPERATOR</span>
            </div>
            <span className="text-[#3f3f46] text-sm ml-1">—</span>
            <span className="text-sm text-[#a1a1aa] ml-1">
              {activeTab === "missions" && "Locked paths."}
              {activeTab === "mirror" && "Behavioural truth."}
              {activeTab === "debt" && "Cost of inconsistency."}
              {activeTab === "rival" && "Anonymous. Unforgiving."}
              {activeTab === "market" && "Your window. Live."}
            </span>
          </div>
          <button
            onClick={onClose}
            className="size-8 grid place-items-center rounded-full hover:bg-[#18181b] text-[#a1a1aa] transition cursor-pointer border border-transparent hover:border-[#27272a]"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Tabs Bar */}
        <div className="flex items-center gap-6 px-6 h-[46px] border-b border-[#18181b] shrink-0 bg-[#09090b] overflow-x-auto no-scrollbar">
          {TABS.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 h-full border-b-[2px] transition-colors ${
                  active ? "border-white text-white" : "border-transparent text-[#52525b] hover:text-[#a1a1aa]"
                }`}
              >
                <div className={`size-3.5 border rounded-[3px] grid place-items-center ${
                  active ? "border-white/20" : "border-transparent"
                }`}>
                  <div className="size-1.5 rounded-[1px] bg-current" />
                </div>
                <span className="text-[13px] font-medium">{tab.label}</span>
                <span className={`text-[10px] font-mono px-1 rounded ${
                  active ? "bg-white/10 text-white" : "bg-[#18181b] text-[#52525b]"
                }`}>
                  {tab.num}
                </span>
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-[#09090b] relative">
          {/* Faint grid background */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
               style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
          
          <div className="relative z-10 px-8 py-10 max-w-[900px] mx-auto min-h-full">
            {/* Tab Header inside content */}
            <div className="flex justify-between items-end mb-10">
              <div>
                <div className="text-[10px] text-[#52525b] font-mono tracking-widest mb-2">
                  0{TABS.find(t => t.id === activeTab)?.num} / 5
                </div>
                <h2 className="text-3xl font-semibold text-white tracking-tight">
                  {TABS.find(t => t.id === activeTab)?.label}
                </h2>
              </div>
              <div className="text-sm text-[#a1a1aa]">
                {activeTab === "missions" && "Locked paths."}
                {activeTab === "mirror" && "Behavioural truth."}
                {activeTab === "debt" && "Cost of inconsistency."}
                {activeTab === "rival" && "Anonymous. Unforgiving."}
                {activeTab === "market" && "Your window. Live."}
              </div>
            </div>

            {activeTab === "missions" && <TabMissions />}
            {activeTab === "mirror" && <TabMirror />}
            {activeTab === "debt" && <TabDebt />}
            {activeTab === "rival" && <TabRival />}
            {activeTab === "market" && <TabMarket />}
          </div>
        </div>
      </div>
    </div>
  );
}

function TabMissions() {
  const missions = [
    {
      badge: "ACADEMIC", tag: "/jee-2025",
      title: "JEE 2025 · Top 1000",
      quote: `"Tu average nahi hai. Yeh summer vacation teri zindagi badal sakti hai — sirf tu decide kar."`,
      path: "Phase 1: Physics fundamentals + 40 mock sets. Phase 2: Inorganic compression. Phase 3: Maths daily rotation. No skips.",
      day: 23, total: 180, score: 71
    },
    {
      badge: "BUILD", tag: "/saas-launch",
      title: "WhatsApp CRM · ₹1L MRR",
      quote: `"Tere paas ek 6-week window hai. Market ready hai. Tu nahi. Wahi fix karna hai."`,
      path: "Week 1-2: 20 cold demos. Week 3: paid pilot. Week 4-6: retention loops. Sales > polish.",
      day: 9, total: 42, score: 54
    },
    {
      badge: "DISCIPLINE", tag: "/body-recomp",
      title: "Body Recomp · 12% BF",
      quote: `"Discipline jo yahan banegi, woh har domain mein leak hogi. Body is the first ledger."`,
      path: "5 lifts/week · protein floor 1.6g/kg · 2 cardio blocks. Weigh-in Sunday. No negotiation.",
      day: 47, total: 120, score: 88
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {missions.map((m, i) => (
        <div key={i} className="rounded-2xl border border-[#18181b] bg-[#09090b] p-5 flex flex-col h-full hover:border-[#27272a] transition-colors">
          <div className="flex justify-between items-center mb-6">
            <span className="text-[9px] font-mono text-[#a1a1aa] tracking-widest border border-[#27272a] rounded px-2 py-1 bg-[#18181b]">
              {m.badge}
            </span>
            <span className="text-[10px] font-mono text-[#52525b]">{m.tag}</span>
          </div>
          
          <h3 className="text-lg font-semibold text-white mb-3">{m.title}</h3>
          <p className="text-[13px] text-[#a1a1aa] leading-relaxed mb-6 italic">
            {m.quote}
          </p>

          <div className="mb-8">
            <div className="text-[10px] font-mono text-[#52525b] mb-2 flex items-center gap-1.5">
              <Lock className="size-3" /> LOCKED PATH
            </div>
            <p className="text-[13px] text-[#71717a] leading-relaxed">
              {m.path}
            </p>
          </div>

          <div className="mt-auto pt-6 border-t border-[#18181b]">
            <div className="flex justify-between text-[10px] font-mono text-[#a1a1aa] mb-2">
              <span>DAY {m.day} OF {m.total}</span>
              <span className="text-white">{m.score}/100</span>
            </div>
            <div className="h-1 bg-[#18181b] rounded-full mb-6 overflow-hidden">
              <div className="h-full bg-white" style={{ width: `${(m.day/m.total)*100}%` }} />
            </div>
            
            <button className="w-full bg-white text-black font-medium text-[14px] py-3 rounded-xl flex items-center justify-between px-5 hover:bg-gray-100 transition-colors">
              Continue Mission
              <ArrowUpRight className="size-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function TabMirror() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Graph Area */}
      <div className="rounded-2xl border border-[#18181b] bg-[#09090b] p-6 flex flex-col justify-between row-span-2">
        <div>
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="text-[10px] font-mono text-[#52525b] tracking-widest mb-2">CONSISTENCY · 30 DAYS</div>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-medium text-white tracking-tight">49</span>
                <span className="text-sm font-mono text-[#52525b]">-13 pts</span>
              </div>
            </div>
            <div className="border border-red-500/20 bg-red-500/10 text-red-500 px-3 py-1.5 rounded-md font-mono text-[9px] tracking-widest uppercase">
              Bhai kya ho raha hai — yeh wala tu nahi hai
            </div>
          </div>

          <div className="h-[200px] w-full mt-8 relative">
            <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible preserve-aspect-ratio-none">
              <defs>
                <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4ade80" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#4ade80" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0,25 Q20,15 40,20 T80,25 T100,30 L100,40 L0,40 Z" fill="url(#g)" />
              <path d="M0,25 Q20,15 40,20 T80,25 T100,30" fill="none" stroke="#4ade80" strokeWidth="0.5" />
            </svg>
            <div className="absolute bottom-0 left-0 right-0 flex justify-between px-4 pb-2 border-t border-[#18181b] text-[10px] font-mono text-[#52525b]">
              <span>D5</span><span>D9</span><span>D13</span><span>D17</span><span>D21</span><span>D25</span><span>D29</span>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div className="bg-[#18181b] rounded-xl p-4 text-[13px] text-[#a1a1aa] mb-4">
            Yeh numbers teri puri story nahi hain. Day 0 pe tu yahan tha — aaj yahan hai. Direction fix kar.
          </div>
          <div className="text-[10px] font-mono text-[#52525b]">
            This insight is based on your self-reported data and chat history within FP only.
          </div>
        </div>
      </div>

      {/* Insight */}
      <div className="rounded-2xl border border-[#18181b] bg-[#09090b] p-6 h-fit">
        <div className="text-[10px] font-mono text-[#52525b] tracking-widest mb-4">BEHAVIOURAL INSIGHT</div>
        <p className="text-[14px] text-white leading-relaxed">
          Tu highly specialized hai — teri problem-solving speed <span className="font-semibold">top 15%</span> hai. Lekin execution windows mein tu disappear ho jaata hai. Yeh teri sabse badi bottleneck hai.
        </p>
      </div>

      {/* Pros & Cons */}
      <div className="rounded-2xl border border-[#18181b] bg-[#09090b] p-6 grid grid-cols-2 gap-8 h-fit">
        <div>
          <div className="text-[10px] font-mono text-[#52525b] tracking-widest mb-4">EDGES</div>
          <ul className="space-y-4">
            <li className="flex gap-3 text-[13px] text-white"><CheckCircle className="size-4 text-[#4ade80] shrink-0" /> Top 15% raw IQ in domain</li>
            <li className="flex gap-3 text-[13px] text-white"><CheckCircle className="size-4 text-[#4ade80] shrink-0" /> Pattern recognition above peers</li>
            <li className="flex gap-3 text-[13px] text-white"><CheckCircle className="size-4 text-[#4ade80] shrink-0" /> Builds fast under deadline</li>
          </ul>
        </div>
        <div>
          <div className="text-[10px] font-mono text-[#52525b] tracking-widest mb-4">LEAKS</div>
          <ul className="space-y-4">
            <li className="flex gap-3 text-[13px] text-[#a1a1aa]"><XCircle className="size-4 text-red-500 shrink-0" /> Vanishes in 5-7 day execution gaps</li>
            <li className="flex gap-3 text-[13px] text-[#a1a1aa]"><XCircle className="size-4 text-red-500 shrink-0" /> Optimizes inputs, avoids shipping</li>
            <li className="flex gap-3 text-[13px] text-[#a1a1aa]"><XCircle className="size-4 text-red-500 shrink-0" /> No public commitments → low debt cost</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function TabDebt() {
  return (
    <div className="space-y-4">
      {/* 3 Rings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Consistency */}
        <div className="rounded-2xl border border-[#18181b] bg-[#09090b] p-8 flex flex-col items-center justify-center">
          <div className="text-[10px] font-mono text-[#52525b] tracking-widest mb-6 border border-[#27272a] px-3 py-1 rounded bg-[#18181b]">CONSISTENCY SCORE</div>
          <div className="relative size-32">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#18181b" strokeWidth="8" />
              <circle cx="50" cy="50" r="45" fill="none" stroke="#fbbf24" strokeWidth="8" strokeDasharray="283" strokeDashoffset="93" strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-semibold text-white">67</span>
              <span className="text-[10px] font-mono text-[#52525b]">/100</span>
            </div>
          </div>
        </div>

        {/* Debt Days */}
        <div className="rounded-2xl border border-[#18181b] bg-[#09090b] p-8 flex flex-col items-center justify-center">
          <div className="text-[10px] font-mono text-[#ef4444] tracking-widest mb-6 border border-[#ef4444]/20 px-3 py-1 rounded bg-[#ef4444]/5">DEBT DAYS</div>
          <div className="relative size-32">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#18181b" strokeWidth="8" />
              <circle cx="50" cy="50" r="45" fill="none" stroke="#ef4444" strokeWidth="8" strokeDasharray="283" strokeDashoffset="240" strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-semibold text-white">4</span>
              <span className="text-[10px] font-mono text-[#52525b]">DAYS</span>
            </div>
          </div>
        </div>

        {/* Days to Goal */}
        <div className="rounded-2xl border border-[#18181b] bg-[#09090b] p-8 flex flex-col items-center justify-center">
          <div className="text-[10px] font-mono text-[#52525b] tracking-widest mb-6 border border-[#27272a] px-3 py-1 rounded bg-[#18181b]">DAYS TO GOAL</div>
          <div className="relative size-32">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#18181b" strokeWidth="8" />
              <circle cx="50" cy="50" r="45" fill="none" stroke="#06b6d4" strokeWidth="8" strokeDasharray="283" strokeDashoffset="141" strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-semibold text-white">89</span>
              <span className="text-[10px] font-mono text-[#52525b]">DAYS</span>
            </div>
          </div>
        </div>
      </div>

      {/* Debt Impact Block */}
      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
        <div className="text-[10px] font-mono text-red-500 tracking-widest mb-4 border border-red-500/20 px-2 py-1 rounded w-fit">DEBT IMPACT</div>
        <p className="text-[14px] text-white leading-relaxed">
          In <span className="text-red-500 font-medium">4 dinon</span> mein teri competition ne 4 tasks complete kiye. Market window 6 weeks thi — ab 5.3 weeks hai. Tu wahan khada hai jahan tha — duniya aage nikal gayi.
        </p>
      </div>

      <div className="rounded-2xl border border-[#18181b] bg-[#09090b] p-6 text-[10px] font-mono text-[#52525b]">
        CONSISTENCY WIN · 12 DAY STREAK
      </div>
    </div>
  );
}

function TabRival() {
  return (
    <div className="rounded-3xl border border-[#18181b] bg-[#09090b] p-10 flex flex-col md:flex-row gap-12 relative overflow-hidden h-[400px]">
      {/* Background stars/dots */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 size-1 bg-white rounded-full opacity-20 blur-[1px]" />
        <div className="absolute top-1/2 right-1/3 size-1.5 bg-[#facc15] rounded-full opacity-30 blur-[2px]" />
        <div className="absolute bottom-1/3 right-1/5 size-1 bg-white rounded-full opacity-10" />
      </div>

      {/* Left side text */}
      <div className="flex-1 flex flex-col justify-center">
        <div className="text-[10px] font-mono text-[#52525b] tracking-widest mb-8 border border-[#27272a] rounded px-3 py-1 bg-[#18181b] w-fit">
          ANONYMOUS COHORT
        </div>
        
        <h3 className="text-3xl text-white font-medium leading-snug mb-8 max-w-[400px]">
          Tere jaisa <span className="text-[#a1a1aa]">847</span> log same goal pe hain. <br/>
          <span className="text-[#a1a1aa]">23</span> already milestone cross kar gaye. <br/>
          <span className="text-[#52525b]">Tu kahan hai?</span>
        </h3>

        <div className="text-[9px] font-mono text-[#3f3f46] tracking-[0.2em] uppercase mt-auto">
          NO NAMES - NO PERSONAL DATA - AGGREGATED WEEKLY
        </div>
      </div>

      {/* Right side stats */}
      <div className="w-[300px] grid grid-cols-2 gap-4 shrink-0 h-fit self-center z-10">
        <div className="border border-[#18181b] bg-[#000] p-5 rounded-2xl">
          <div className="text-[9px] font-mono text-[#52525b] tracking-widest mb-2 uppercase">Same goal</div>
          <div className="text-3xl text-white font-medium">847</div>
        </div>
        <div className="border border-[#18181b] bg-[#000] p-5 rounded-2xl">
          <div className="text-[9px] font-mono text-[#52525b] tracking-widest mb-2 uppercase">Crossed</div>
          <div className="text-3xl text-white font-medium">23</div>
        </div>
        <div className="border border-[#18181b] bg-[#000] p-5 rounded-2xl">
          <div className="text-[9px] font-mono text-[#52525b] tracking-widest mb-2 uppercase">Active 7d</div>
          <div className="text-3xl text-white font-medium">612</div>
        </div>
        <div className="border border-[#18181b] bg-[#000] p-5 rounded-2xl">
          <div className="text-[9px] font-mono text-[#52525b] tracking-widest mb-2 uppercase">Your rank</div>
          <div className="text-3xl text-white font-medium">#347</div>
        </div>
      </div>
    </div>
  );
}

function TabMarket() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Live Market */}
      <div className="rounded-2xl border border-[#18181b] bg-[#09090b] p-6 h-[340px] flex flex-col relative overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2 border border-[#27272a] bg-[#18181b] rounded px-2 py-1">
            <div className="size-1.5 rounded-full bg-white animate-pulse" />
            <span className="text-[9px] font-mono text-white tracking-widest uppercase">LIVE</span>
          </div>
          <TrendingUp className="size-4 text-[#52525b]" />
        </div>

        <h3 className="text-xl text-white font-medium mb-1">Your Market · Live</h3>
        <p className="text-[13px] text-[#52525b] mb-6">Teri city mein aaj:</p>

        <ul className="space-y-3 flex-1 overflow-y-auto no-scrollbar">
          <li className="flex items-center gap-3 border border-[#18181b] bg-[#000] p-3 rounded-xl">
            <div className="size-5 border border-[#27272a] rounded grid place-items-center text-[10px] text-[#52525b] shrink-0">↗</div>
            <p className="text-[12px] text-[#a1a1aa] leading-tight flex-1">4 businesses ne automation tools adopt kiye</p>
            <span className="text-[9px] font-mono text-[#52525b] uppercase tracking-widest shrink-0">TODAY</span>
          </li>
          <li className="flex items-center gap-3 border border-[#18181b] bg-[#000] p-3 rounded-xl">
            <div className="size-5 border border-[#27272a] rounded grid place-items-center text-[10px] text-[#52525b] shrink-0">~</div>
            <p className="text-[12px] text-[#a1a1aa] leading-tight flex-1">WhatsApp CRM demand</p>
            <span className="text-[10px] font-mono text-green-400 shrink-0">+31% THIS WEEK</span>
          </li>
          <li className="flex items-center gap-3 border border-[#18181b] bg-[#000] p-3 rounded-xl">
            <div className="size-5 border border-[#27272a] rounded grid place-items-center text-[10px] text-[#52525b] shrink-0">↘</div>
            <p className="text-[12px] text-[#a1a1aa] leading-tight flex-1">Active competitors in your niche</p>
            <span className="text-[10px] font-mono text-[#52525b] shrink-0 text-white font-semibold">12 NOW</span>
          </li>
        </ul>
      </div>

      {/* Window Alert */}
      <div className="rounded-2xl border border-[#18181b] bg-[#09090b] p-6 h-[340px] flex flex-col justify-center">
        <div className="text-[9px] font-mono text-[#a1a1aa] tracking-widest mb-6 border border-[#27272a] bg-[#18181b] rounded px-3 py-1 w-fit">
          ⌛ WINDOW ALERT
        </div>
        
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-6xl text-white font-medium tracking-tight">3.5</span>
          <span className="text-[11px] font-mono text-[#52525b] tracking-widest uppercase">WEEKS LEFT</span>
        </div>

        <div className="h-1 bg-[#18181b] w-full rounded-full mb-8">
          <div className="h-full bg-red-500 w-[60%] rounded-full" />
        </div>

        <p className="text-[13px] text-[#a1a1aa] leading-relaxed">
          Teri opportunity window: 3.5 weeks baaki. Iske baad market saturate ho jayega. Jo aaj execute karega — woh market ka pehla mover hoga.
        </p>
      </div>

      {/* Category Movers */}
      <div className="rounded-2xl border border-[#18181b] bg-[#09090b] p-6 h-[340px] flex flex-col">
        <div className="text-[9px] font-mono text-[#52525b] tracking-widest mb-6 uppercase border border-[#18181b] rounded px-2 py-1 w-fit">
          CATEGORY MOVERS
        </div>

        <h3 className="text-lg text-white font-medium mb-8">Teri category mein is hafte</h3>

        <div className="space-y-4">
          <div className="flex justify-between items-center border border-[#18181b] p-4 rounded-xl bg-[#000]">
            <span className="text-[12px] text-[#52525b]">Top performer</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl text-white font-medium">3</span>
              <span className="text-[9px] font-mono text-[#52525b] tracking-widest uppercase">CLIENTS CLOSED</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center border border-[#18181b] p-4 rounded-xl bg-[#000]">
            <span className="text-[12px] text-[#52525b]">Average executor</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl text-white font-medium">0.4</span>
              <span className="text-[9px] font-mono text-[#52525b] tracking-widest uppercase">CLIENTS</span>
            </div>
          </div>

          <div className="flex justify-between items-center border border-[#18181b] p-4 rounded-xl bg-[#000]">
            <span className="text-[12px] text-[#52525b]">Tu</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl text-red-500 font-medium">??</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ego Attack Banner */}
      <div className="md:col-span-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4 flex gap-4 items-center mt-2">
        <div className="text-[10px] font-mono text-red-500 tracking-widest border border-red-500/20 px-2 py-1 rounded bg-[#000] shrink-0">
          EGO ATTACK
        </div>
        <p className="text-[13px] text-white">
          Market tera wait nahi kar raha. Har din jo tu ghost rehta hai — koi aur teri jagah le raha hai.
        </p>
      </div>
    </div>
  );
}
