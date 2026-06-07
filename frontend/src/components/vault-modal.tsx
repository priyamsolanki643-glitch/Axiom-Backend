"use client";

import { useState, useEffect } from "react";
import {
  Lock, X, TrendingUp, CheckCircle, XCircle, Target, ArrowRight, ArrowUpRight, Trophy, AlertTriangle, Radio, ChevronLeft, FileText, Download, Share2
} from "lucide-react";

type TabId = "missions" | "mirror" | "debt" | "rival" | "market";

interface VaultModalProps {
  onClose: () => void;
}

const TABS: { id: TabId; label: string }[] = [
  { id: "missions", label: "Missions" },
  { id: "mirror",   label: "Reality Mirror" },
  { id: "debt",     label: "Execution Debt" },
  { id: "rival",    label: "Rival Index" },
  { id: "market",   label: "Market Analyser" },
];

export function VaultModal({ onClose }: VaultModalProps) {
  const [activeTab, setActiveTab] = useState<TabId>("missions");
  const [mounted, setMounted] = useState(false);
  const [tabTransition, setTabTransition] = useState(false);
  const [vaultData, setVaultData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 10);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  useEffect(() => {
    const fetchVaultData = async () => {
      setLoading(true);
      try {
        const { supabase } = await import('@/utils/supabase/client');
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token || "test-user";
        
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const headers = { "Authorization": `Bearer ${token}` };

        const [missionRes, mirrorRes, marketRes, rivalRes] = await Promise.all([
          fetch(`${baseUrl}/api/v1/interaction/active-mission`, { headers }),
          fetch(`${baseUrl}/api/v1/interaction/reality-mirror`, { headers }),
          fetch(`${baseUrl}/api/v1/interaction/market-report`, { headers }),
          fetch(`${baseUrl}/api/v1/interaction/rival-index`, { headers })
        ]);

        const [mission, mirror, market, rival] = await Promise.all([
          missionRes.json().catch(()=>({data:null})),
          mirrorRes.json().catch(()=>({data:null})),
          marketRes.json().catch(()=>({data:null})),
          rivalRes.json().catch(()=>({data:null}))
        ]);

        setVaultData({
          mission: mission?.data,
          mirror: mirror?.data,
          market: market?.data,
          rival: rival?.data
        });
      } catch(e) {
        console.error("Vault data fetch error:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchVaultData();
  }, []);

  const switchTab = (id: TabId) => {
    if (id === activeTab) return;
    setTabTransition(true);
    setTimeout(() => {
      setActiveTab(id);
      setTabTransition(false);
    }, 150);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 md:p-6">
      {/* Backdrop */}
      <div
        onClick={onClose}
        onTouchStart={onClose}
        className="absolute inset-0 cursor-pointer"
        style={{
          background: "rgba(0,0,0,0.85)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      />

      {/* Modal Container */}
      <div
        className={`relative w-full max-w-[1100px] h-[90vh] flex flex-col rounded-2xl md:rounded-[24px] overflow-hidden transition-all duration-[400ms] ${
          mounted ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-[0.97]"
        }`}
        style={{
          background: "#030303",
          boxShadow: "0 0 0 1px rgba(255,255,255,0.05), 0 30px 100px -10px rgba(0,0,0,0.9)",
          transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Full Modal Grid Background */}
        <div 
          className="absolute inset-0 pointer-events-none" 
          style={{ 
            backgroundImage: "linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)", 
            backgroundSize: "64px 64px" 
          }} 
        />
        
        {/* Header Section */}
        <div className="relative z-20 px-6 md:px-10 pt-8 pb-6 border-b border-white/5 flex flex-col">
          <button 
            onClick={onClose}
            className="absolute top-8 right-6 md:right-10 size-8 flex items-center justify-center rounded-full border border-white/10 hover:bg-white/10 transition-colors text-white/70 hover:text-white"
          >
            <X className="size-4" />
          </button>

          <div className="flex items-center gap-4 mb-10">
            <div className="size-10 rounded-[10px] border border-white/20 flex items-center justify-center bg-black">
              <Lock className="size-4 text-white/80" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-[#a1a1aa] tracking-[0.2em] uppercase mb-1">FP // SECURE</div>
              <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">THE VAULT</h1>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 -mb-2">
            {TABS.map(tab => (
              <button 
                key={tab.id}
                onClick={() => switchTab(tab.id)}
                className={`px-4 py-2 rounded-full text-[13px] font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id 
                    ? 'bg-[#18181b] text-white' 
                    : 'text-[#a1a1aa] hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto relative z-10 custom-scrollbar">
          <div 
            className="px-6 md:px-10 py-10 w-full transition-opacity duration-150"
            style={{ opacity: tabTransition ? 0 : 1 }}
          >
            {loading ? (
              <div className="h-[400px] flex items-center justify-center">
                <div className="size-6 border-2 border-[#52525b] border-t-white rounded-full animate-spin" />
              </div>
            ) : (
              <>
                {activeTab === "missions" && <TabMissions missionData={vaultData?.mission} />}
                {activeTab === "mirror" && <TabMirror mirrorData={vaultData?.mirror} />}
                {activeTab === "debt" && <TabDebt missionData={vaultData?.mission} />}
                {activeTab === "rival" && <TabRival rivalData={vaultData?.rival} />}
                {activeTab === "market" && <TabMarket marketData={vaultData?.market} />}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function TabMissions({ missionData }: { missionData?: any }) {
  const [activeMission, setActiveMission] = useState<any>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);

  const handleShare = () => {
    if (!activeMission) return;
    const text = `MISSION: ${activeMission.title}\nSTRATEGY: ${activeMission.strategy}\n\nPROTOCOL:\n${activeMission.protocol.join('\n')}`;
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!activeMission) return;
    const text = `CONFIDENTIAL PROTOCOL\nID: MS-${activeMission.id}00X9\nTITLE: ${activeMission.title}\n\nMINDSET BRIEF:\n${activeMission.quote}\n\nCORE STRATEGY:\n${activeMission.strategy}\n\nEXECUTION PROTOCOL:\n${activeMission.protocol.join('\n')}\n\nSTATUS: Day ${activeMission.day} of ${activeMission.total} (${activeMission.consistency}% Consistency)`;
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Protocol_${activeMission.title.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setIsDownloaded(true);
    setTimeout(() => setIsDownloaded(false), 2000);
  };

  const missions = missionData ? [
    {
      id: 1,
      title: missionData.missionName || "Active Mission",
      quote: missionData.mindsetBrief || "Tu average nahi hai. Execute kar.",
      strategy: missionData.strategyContent || "Focus on the locked path. Execute daily targets without fail.",
      protocol: [
        "LOCKED PATH: " + (missionData.lockedPath || "Alpha"),
        "- Follow the daily execution mandate generated for you.",
        "- Missing a daily checkpoint incurs execution debt.",
        "- Do not attempt to optimize the system. Submit to it."
      ],
      day: missionData.dayNumber || 1,
      total: missionData.totalDays || 90,
      consistency: missionData.consistencyScore || 0
    }
  ] : [];

  if (activeMission) {
    return (
      <div className="w-full max-w-5xl mx-auto h-full min-h-[500px] md:h-[600px] bg-[#0A0A0A] md:border border-white/10 rounded-2xl flex flex-col overflow-hidden animate-fade-in relative shadow-[0_0_80px_-15px_rgba(255,255,255,0.05)] group">
        {/* Animated Scanning Line */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none" style={{ animation: 'scan 3s ease-in-out infinite' }} />
        <style>{`@keyframes scan { 0% { transform: translateY(-10px); } 50% { transform: translateY(600px); } 100% { transform: translateY(-10px); } }`}</style>
        
        {/* Subtle grid pattern for the document view */}
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />

        {/* Toolbar */}
        <div className="h-14 bg-[#111] border-b border-white/5 flex items-center justify-between px-6 shrink-0 relative z-30">
          <button 
            onClick={() => setActiveMission(null)}
            className="flex items-center gap-2 text-[#a1a1aa] hover:text-white transition-colors text-[13px] font-medium"
          >
            <ChevronLeft className="size-4" /> Back to Folders
          </button>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleShare}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors text-[11px] font-mono tracking-widest uppercase ${isCopied ? 'bg-[#22c55e]/10 text-[#22c55e]' : 'text-[#a1a1aa] hover:text-white hover:bg-white/5'}`}
            >
              {isCopied ? <CheckCircle className="size-3" /> : <Share2 className="size-3" />}
              {isCopied ? 'Copied' : 'Share'}
            </button>
            <button 
              onClick={handleDownload}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors text-[11px] font-mono tracking-widest uppercase ${isDownloaded ? 'bg-white/20 text-white' : 'text-[#a1a1aa] hover:text-white hover:bg-white/5'}`}
            >
              {isDownloaded ? <CheckCircle className="size-3" /> : <Download className="size-3" />}
              {isDownloaded ? 'Saved' : 'Download'}
            </button>
          </div>
        </div>

        {/* Document Content */}
        <div className="flex-1 overflow-y-auto px-8 md:px-16 py-12 relative z-10 custom-scrollbar">
          <div className="max-w-3xl mx-auto space-y-10 animate-fade-up">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="size-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                    <FileText className="size-5 text-white/80" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-[#52525b] tracking-[0.2em] uppercase">Confidential Protocol</div>
                    <div className="text-[13px] font-mono text-[#a1a1aa]">ID: MS-{activeMission.id}00X9</div>
                  </div>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight mb-4">{activeMission.title}</h1>
              </div>
              <div className="hidden md:flex flex-col items-end">
                <div className="size-16 rounded-full border border-dashed border-white/20 flex items-center justify-center rotate-12 opacity-40">
                  <span className="text-[10px] font-mono font-bold text-white uppercase tracking-widest -rotate-12">SEALED</span>
                </div>
              </div>
            </div>
            
            <div className="h-[1px] w-full bg-gradient-to-r from-white/20 via-white/5 to-transparent my-6" />

            {/* Mindset Quote */}
            <div className="border-l-[3px] border-white/40 pl-6 py-2 relative">
              <div className="absolute -left-[1.5px] top-0 bottom-0 w-[3px] bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-1000" style={{ boxShadow: '0 0 10px white' }} />
              <div className="text-[10px] font-mono text-[#a1a1aa] tracking-[0.2em] uppercase mb-2">Mindset Brief</div>
              <p className="text-xl md:text-2xl font-medium text-white/90 leading-snug italic tracking-tight">
                "{activeMission.quote}"
              </p>
            </div>

            {/* Core Strategy */}
            <div className="bg-[#121212] border border-white/5 rounded-2xl p-8 shadow-inner relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <Target className="size-24" />
              </div>
              <div className="text-[10px] font-mono text-[#a1a1aa] tracking-[0.2em] uppercase mb-4 flex items-center gap-2 relative z-10">
                <Target className="size-3 text-white" /> Core Strategy
              </div>
              <p className="text-[15px] leading-relaxed text-[#d4d4d8] font-medium relative z-10">
                {activeMission.strategy}
              </p>
            </div>

            {/* Detailed Execution Protocol */}
            <div>
              <div className="text-[10px] font-mono text-[#a1a1aa] tracking-[0.2em] uppercase mb-6 flex items-center gap-2">
                <Lock className="size-3 text-white" /> Execution Protocol
              </div>
              <div className="space-y-4 font-mono text-[13px] text-[#a1a1aa] leading-relaxed bg-black/40 p-6 md:p-8 rounded-2xl border border-white/5 relative overflow-hidden">
                {/* Subtle terminal-like static effect background */}
                <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #fff 2px, #fff 4px)' }}></div>
                <div className="relative z-10">
                  {activeMission.protocol.map((line: string, i: number) => {
                    const isHeader = line.includes(':') && !line.startsWith('-');
                    return (
                      <div key={i} className={isHeader ? "text-white font-bold pt-4 first:pt-0 pb-1" : "pl-4 hover:text-white transition-colors cursor-default"}>
                        {line}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer Status */}
            <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="text-[10px] font-mono text-[#52525b] uppercase tracking-widest mb-1">Current Status</div>
                <div className="text-white text-[14px]">Day {activeMission.day} of {activeMission.total}</div>
              </div>
              <div className="px-4 py-2 bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/20 rounded-lg text-[11px] font-mono uppercase tracking-[0.1em] flex items-center gap-2">
                <div className="size-1.5 rounded-full bg-[#22c55e] animate-pulse" />
                {activeMission.consistency}% Consistency maintained
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in w-full max-w-6xl mx-auto">
      <div className="hidden md:block">
        <div className="text-[11px] font-mono tracking-[0.2em] text-[#a1a1aa] mb-2 uppercase">Feature 01</div>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">Mission Folders</h2>
        <p className="text-[#a1a1aa] text-sm md:text-[15px]">Locked paths. Personalised briefs. No fluff — just the next move.</p>
      </div>

      <div className="flex flex-col gap-2">
        {missions.map((m, idx) => (
          <div 
            key={idx} 
            onClick={() => setActiveMission(m)}
            className="group flex items-center justify-between bg-[#0A0A0A] border border-white/5 rounded-2xl p-4 cursor-pointer hover:bg-white/5 hover:border-white/20 transition-all active:scale-[0.98]"
          >
            <div className="flex items-center gap-4">
              <div className="size-10 md:size-12 rounded-full bg-[#18181b] border border-white/10 flex items-center justify-center shrink-0">
                <Target className="size-5 md:size-6 text-white/70 group-hover:text-white transition-colors" />
              </div>
              <div>
                <h3 className="text-base md:text-lg font-bold text-white tracking-tight leading-tight mb-1">{m.title}</h3>
                <div className="flex items-center gap-3 text-[11px] md:text-xs font-mono text-[#a1a1aa] uppercase tracking-wider">
                  <span>Day {m.day}/{m.total}</span>
                  <span className="size-1 rounded-full bg-[#52525b]" />
                  <span className={m.consistency >= 80 ? 'text-[#22c55e]' : m.consistency >= 50 ? 'text-yellow-500' : 'text-red-500'}>
                    {m.consistency}%
                  </span>
                </div>
              </div>
            </div>
            <div className="shrink-0 text-[#52525b] group-hover:text-white transition-colors">
              <ArrowRight className="size-5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TabMirror({ mirrorData }: { mirrorData?: any }) {
  const isTrendUp = mirrorData ? mirrorData.trend !== 'down' : true;
  const score = mirrorData && mirrorData.history && mirrorData.history.length > 0 
    ? mirrorData.history[mirrorData.history.length - 1] 
    : 0;
  
  // Fill history to 7 points for graph if shorter
  const data = mirrorData?.history ? [...mirrorData.history] : [];
  while(data.length < 7) { data.unshift(data.length > 0 ? data[0] : 50); }
  const graphData = data.slice(-7);

  const insight = mirrorData?.insight || "Tu active mode ke paas hai. Bhai rukna mat.";
  const strengths = mirrorData?.strengths || ["Technical velocity is strong", "Goal intent is clear"];
  const bottlenecks = mirrorData?.bottlenecks || ["Consistency decay on weekends", "Outreach loop delay"];
  return (
    <div className="space-y-8 animate-fade-in w-full max-w-6xl mx-auto">
      <div>
        <div className="text-[11px] font-mono tracking-[0.2em] text-[#a1a1aa] mb-2 uppercase">Feature 02</div>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">Reality Mirror</h2>
        <p className="text-[#a1a1aa] text-sm md:text-[15px]">Honest signal. No filters. The graph doesn't negotiate.</p>
      </div>

      <div className="flex gap-2">
        <button 
          className={`px-4 py-2 rounded-lg text-[13px] font-medium flex items-center gap-1.5 transition-colors ${isTrendUp ? 'bg-[#18181b] text-white' : 'text-[#a1a1aa] hover:bg-[#18181b]'}`}
        >
          Trend ↑
        </button>
        <button 
          className={`px-4 py-2 rounded-lg text-[13px] font-medium flex items-center gap-1.5 transition-colors ${!isTrendUp ? 'bg-[#18181b] text-white' : 'text-[#a1a1aa] hover:bg-[#18181b]'}`}
        >
          Trend ↓
        </button>
      </div>

      <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-4 md:p-10">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-10">
          <div>
            <div className="text-[10px] font-mono text-[#52525b] tracking-[0.2em] uppercase mb-2">Consistency Score · 7 Weeks</div>
            <div className="text-4xl md:text-6xl font-bold text-white flex items-baseline gap-2 tracking-tighter">
              {score} <span className="text-lg md:text-2xl text-[#52525b] font-medium tracking-normal">/ 100</span>
            </div>
          </div>
          <div className={`px-3 py-1.5 border rounded-md text-[9px] md:text-[10px] font-mono tracking-[0.1em] uppercase flex items-center gap-2 w-fit ${isTrendUp ? 'border-white/20 text-white' : 'border-red-500/20 text-red-500 bg-red-500/10'}`}>
            {isTrendUp ? (
              <><ArrowUpRight className="size-3 text-[#a1a1aa]" /> OPERATOR MODE ACTIVATED</>
            ) : (
              <>BHAI KYA HO RAHA HAI — YEH WALA TU NAHI HAI</>
            )}
          </div>
        </div>

        {/* Bar Graph */}
        <div className="w-full h-[240px] md:h-[280px] relative mt-10 mb-6 flex items-end justify-between px-6 md:px-6">
          
          {/* Horizontal Grid lines */}
          <div className="absolute inset-0 pointer-events-none">
            {[25, 50, 75, 100].map(percent => (
              <div 
                key={percent} 
                className="absolute w-full border-b border-white/5 border-dashed" 
                style={{ bottom: `${percent}%` }}
              />
            ))}
          </div>

          {/* Y Axis Labels */}
          <div className="absolute left-0 md:-left-4 top-0 bottom-0 flex flex-col justify-between text-[8px] md:text-[10px] text-[#52525b] font-mono pb-8 z-0">
            <span>100</span><span>75</span><span>50</span><span>25</span><span>0</span>
          </div>

          {/* Bars */}
          {(() => {
            const maxVal = 100;
            return graphData.reverse().map((val: number, i: number) => {
              const heightPercent = (val / maxVal) * 100;
              return (
                <div key={i} className="relative flex flex-col items-center group w-6 md:w-12 h-full justify-end z-10">
                  {/* Tooltip on hover */}
                  <div className="absolute -top-8 bg-[#18181b] border border-white/10 text-white text-[10px] font-mono px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                    Score: {val}
                  </div>
                  
                  {/* The Bar */}
                  <div 
                    className="w-full rounded-t-sm md:rounded-t-md relative overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:brightness-125"
                    style={{ 
                      height: `${heightPercent}%`, 
                      background: isTrendUp ? 'linear-gradient(to top, rgba(250, 204, 21, 0.2), rgba(250, 204, 21, 0.8))' : 'linear-gradient(to top, rgba(239, 68, 68, 0.2), rgba(239, 68, 68, 0.8))',
                      boxShadow: `0 0 10px ${isTrendUp ? 'rgba(250, 204, 21, 0.1)' : 'rgba(239, 68, 68, 0.1)'}`
                    }}
                  >
                    {/* Inner glowing top edge */}
                    <div className={`absolute top-0 left-0 right-0 h-[2px] ${isTrendUp ? 'bg-yellow-300' : 'bg-red-300'}`} style={{ boxShadow: `0 0 10px ${isTrendUp ? 'white' : '#ef4444'}` }} />
                  </div>
                  
                  {/* X Axis Label */}
                  <div className="absolute -bottom-6 md:-bottom-8 text-[8px] md:text-[10px] text-[#52525b] font-mono mt-2 group-hover:text-white transition-colors">
                    W{i + 1}
                  </div>
                </div>
              );
            });
          })()}
        </div>
        
        {!isTrendUp && (
          <div className="mt-12 bg-[#120505] border border-red-500/20 rounded-xl p-5">
            <p className="text-[14px] text-red-400 font-medium leading-relaxed">
              Yeh numbers teri puri story nahi hain. Day 0 pe tu yahan tha — aaj yahan hai. Direction fix kar.
            </p>
          </div>
        )}
      </div>

      <div className="mt-8 space-y-6">
        <div className="text-[11px] font-mono text-[#a1a1aa] tracking-[0.2em] uppercase">Behavioral Insight</div>
        <p className="text-white text-[15px] md:text-[18px] leading-relaxed max-w-4xl font-medium tracking-tight">
          {insight}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <div className="border border-white/10 bg-[#0A0A0A] rounded-2xl p-6 md:p-8">
            <div className="text-[10px] font-mono text-[#a1a1aa] tracking-[0.2em] uppercase mb-6 flex gap-2"><span className="text-white">PROS</span> · BRUTAL HONEST</div>
            <ul className="space-y-4 text-[13.5px] text-white leading-relaxed">
              {strengths.map((s: string, idx: number) => (
                <li key={idx} className="flex gap-3"><span className="text-[#a1a1aa] shrink-0 mt-0.5">→</span> {s}</li>
              ))}
            </ul>
          </div>
          <div className="border border-red-500/20 bg-[#120505] rounded-2xl p-6 md:p-8">
            <div className="text-[10px] font-mono text-red-500 tracking-[0.2em] uppercase mb-6 flex gap-2"><span className="text-red-500">CONS</span> · SPECIFIC</div>
            <ul className="space-y-4 text-[13.5px] text-white leading-relaxed">
              {bottlenecks.map((b: string, idx: number) => (
                <li key={idx} className="flex gap-3"><span className="text-red-500 shrink-0 mt-0.5">→</span> {b}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="text-[9px] font-mono text-[#3f3f46] tracking-[0.1em] uppercase pt-4">
          THIS INSIGHT IS BASED ON YOUR SELF-REPORTED DATA AND CHAT HISTORY WITHIN FP ONLY.
        </div>
      </div>
    </div>
  );
}

function TabDebt({ missionData }: { missionData?: any }) {
  const debtDays = missionData?.debtDays || 0;
  const consistencyScore = missionData?.consistencyScore || 0;
  const daysToGoal = missionData?.daysToGoal || 0;
  const streakDays = missionData?.streakDays || 0;
  const hasDebt = debtDays > 0;
  return (
    <div className="space-y-8 animate-fade-in w-full max-w-6xl mx-auto">
      <div>
        <div className="text-[11px] font-mono tracking-[0.2em] text-[#a1a1aa] mb-2 uppercase">Feature 03</div>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">Execution Debt Tracker</h2>
        <p className="text-[#a1a1aa] text-sm md:text-[15px]">The market doesn't pause. Your debt compounds — or your consistency does.</p>
      </div>

      <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl md:rounded-[24px] p-6 md:p-10 mt-8 mb-6 relative overflow-hidden">
        <div className="flex flex-row justify-between items-center gap-2 md:grid md:grid-cols-3 md:gap-12 z-10 relative">
          <Dial title="SCORE" value={consistencyScore.toString()} sub="/ 100" color="#facc15" strokeOffset={`${289 - (289 * consistencyScore) / 100}`} />
          <Dial title="DEBT" value={debtDays.toString()} sub="DAYS" color="#ef4444" strokeOffset={`${289 - (289 * Math.min(debtDays, 14)) / 14}`} />
          <Dial title="TO GOAL" value={daysToGoal.toString()} sub="DAYS" color="#0ea5e9" strokeOffset={`${289 - (289 * Math.max(0, 90 - daysToGoal)) / 90}`} />
        </div>
      </div>

      <div className="border border-red-500/20 bg-[#120505] rounded-2xl p-6 md:p-8">
        <div className="text-[10px] font-mono text-red-500 tracking-[0.2em] uppercase mb-4">DEBT IMPACT</div>
        <p className="text-[14px] md:text-[15px] text-white leading-relaxed">
          {hasDebt ? (
            <>In <span className="text-red-500 font-semibold">{debtDays} dinon</span> mein teri competition ne {debtDays} tasks complete kiye. Tu wahan khada hai jahan tha — duniya aage nikal gayi.</>
          ) : (
            <>Teri current execution pe koi debt nahi hai. Maintain this velocity.</>
          )}
        </p>
      </div>

      <div className="border border-white/10 bg-[#0A0A0A] rounded-2xl p-6 md:p-8">
        <div className="text-[10px] font-mono text-[#a1a1aa] tracking-[0.2em] uppercase mb-4">CONSISTENCY WIN</div>
        <p className="text-[14px] md:text-[15px] text-white leading-relaxed">
          Tu ne <span className="font-semibold text-white">{streakDays} din lagaataar</span> execute kiya. Yeh skill ab tera permanent weapon hai — koi cheen nahi sakta.
        </p>
      </div>

      <div className="mt-12 mb-6">
        {hasDebt ? (
          <p className="text-xl md:text-2xl font-semibold text-white leading-snug pl-6 border-l-[3px] border-white py-1 tracking-tight">
            Duniya nahi ruki bhai — tu ruka tha. Aaj se mat ruk.
          </p>
        ) : (
          <p className="text-xl md:text-2xl font-semibold text-white leading-snug pl-6 border-l-[3px] border-[#22c55e] py-1 tracking-tight">
            Operator. No debt. Teri consistency compounding ho rahi hai.
          </p>
        )}
        <p className="text-[9px] font-mono text-[#3f3f46] tracking-[0.1em] uppercase mt-8">
          METRICS BASED ON YOUR SELF-REPORTED ACTIVITY WITHIN FP ONLY.
        </p>
      </div>
    </div>
  );
}

const Dial = ({ title, value, sub, color, strokeOffset }: { title: string, value: string, sub: string, color: string, strokeOffset: string }) => (
  <div className="flex flex-col items-center justify-center w-full">
    <div className="relative size-20 md:size-48 mb-4 md:mb-8 mx-auto">
      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
        <circle cx="50" cy="50" r="46" fill="none" stroke="#18181b" strokeWidth="3" />
        <circle 
          cx="50" cy="50" r="46" fill="none" stroke={color} strokeWidth="3" 
          strokeDasharray="289" strokeDashoffset={strokeOffset} strokeLinecap="round" 
          style={{ filter: `drop-shadow(0 0 8px ${color}60)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl md:text-5xl font-bold text-white mb-0 md:mb-1 tracking-tighter">{value}</span>
        <span className="text-[8px] md:text-[10px] font-mono text-[#a1a1aa] tracking-widest">{sub}</span>
      </div>
    </div>
    <div className="text-[9px] md:text-[10px] font-mono text-[#52525b] tracking-[0.1em] md:tracking-[0.2em] uppercase text-center">{title}</div>
  </div>
);

function TabRival({ rivalData }: { rivalData?: any }) {
  const totalUsers = rivalData?.totalUsers || 847;
  const milestonePassed = rivalData?.milestonePassedUsers || 23;
  return (
    <div className="space-y-8 animate-fade-in w-full max-w-6xl mx-auto flex flex-col h-full">
      <div>
        <div className="text-[11px] font-mono tracking-[0.2em] text-[#a1a1aa] mb-2 uppercase">Feature 04</div>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">Rival Index</h2>
        <p className="text-[#a1a1aa] text-sm md:text-[15px]">Anonymous. No names. Just the field — and where you stand in it.</p>
      </div>

      <div className="flex-1 mt-6 border border-white/5 bg-[#030303] rounded-3xl relative overflow-hidden flex flex-col justify-center p-8 md:p-16 min-h-[400px]">
        {/* Subtle inner grid lines */}
        <div 
          className="absolute inset-0 pointer-events-none" 
          style={{ 
            backgroundImage: "linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)", 
            backgroundSize: "80px 80px",
          }} 
        />

        <div className="absolute top-8 right-8 flex items-center gap-2 text-[10px] font-mono text-[#a1a1aa] tracking-[0.2em] uppercase z-20">
          <span className="size-1.5 rounded-full bg-white animate-pulse" /> LIVE · ANONYMOUS
        </div>

        <div className="relative z-10 max-w-3xl space-y-12">
          <div className="border-b border-white/5 pb-8">
            <div className="text-[10px] font-mono text-[#52525b] tracking-[0.2em] uppercase mb-4">The Field</div>
            <div className="text-2xl md:text-4xl font-bold text-white tracking-tight">Tere jaisa {totalUsers} log same goal pe hain.</div>
          </div>
          <div className="border-b border-white/5 pb-8">
            <div className="text-[10px] font-mono text-[#52525b] tracking-[0.2em] uppercase mb-4">Ahead</div>
            <div className="text-2xl md:text-4xl font-bold text-white tracking-tight">{milestonePassed} already milestone cross kar gaye.</div>
          </div>
          <div>
            <div className="text-[10px] font-mono text-red-500 tracking-[0.2em] uppercase mb-4">You</div>
            <div className="text-2xl md:text-4xl font-bold text-white flex items-center gap-6 tracking-tight">
              Tu kahan hai? 
              <div className="h-[2px] w-20 md:w-32 bg-white mt-1 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TabMarket({ marketData }: { marketData?: any }) {
  const trends = marketData?.marketTrends || [];
  return (
    <div className="space-y-8 animate-fade-in w-full max-w-6xl mx-auto">
      <div>
        <div className="text-[11px] font-mono tracking-[0.2em] text-[#a1a1aa] mb-2 uppercase">Feature 05</div>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">Market Analyser</h2>
        <p className="text-[#a1a1aa] text-sm md:text-[15px]">Live field intel. Window timing. Category movers. The market doesn't wait.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
        {/* Card 1 */}
        <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col hover:border-white/10 transition-colors">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-2 text-[10px] font-mono text-[#a1a1aa] tracking-[0.2em] uppercase">
              <span className="size-1.5 rounded-full bg-white animate-pulse" /> Your Market · Live
            </div>
            <Radio className="size-4 text-[#52525b]" />
          </div>
          
          <p className="text-[13px] md:text-[14px] text-[#a1a1aa] mb-8 font-medium">Teri city mein aaj:</p>

          <div className="space-y-6 flex-1">
            <div className="flex justify-between items-center pb-4 border-b border-white/5">
              <span className="text-[13px] md:text-[14px] text-white">Businesses <span className="text-[#52525b]">→ automation</span></span>
              <span className="text-[16px] font-bold text-white">4</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-white/5">
              <span className="text-[13px] md:text-[14px] text-white">WhatsApp CRM demand</span>
              <span className="text-[16px] font-bold text-white">+31%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[13px] md:text-[14px] text-white">Active competitors <span className="text-[#52525b]">- niche</span></span>
              <span className="text-[16px] font-bold text-white">12</span>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-[#120505] border border-red-500/20 rounded-3xl p-6 md:p-8 flex flex-col relative overflow-hidden">
          <div className="flex items-center gap-2 text-[10px] font-mono text-red-500 tracking-[0.2em] uppercase mb-8">
            <AlertTriangle className="size-3" /> Window Alert
          </div>

          <div className="mb-8">
            <div className="text-6xl md:text-7xl font-bold text-red-500 tracking-tighter mb-2">3.5</div>
            <div className="text-[10px] font-mono text-[#a1a1aa] tracking-[0.2em] uppercase">Weeks Remaining</div>
          </div>

          <p className="text-[14px] text-white leading-relaxed mt-auto font-medium">
            Teri opportunity window: <span className="text-red-500">3.5 weeks</span> baaki. Iske baad market saturate ho jayega. Jo aaj execute karega — woh market ka pehla mover hoga.
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col hover:border-white/10 transition-colors">
          <div className="flex items-center gap-2 text-[10px] font-mono text-[#a1a1aa] tracking-[0.2em] uppercase mb-8">
            <Trophy className="size-3" /> Category Movers
          </div>
          
          <p className="text-[13px] md:text-[14px] text-[#a1a1aa] mb-8 font-medium">Teri category mein is hafte:</p>

          <div className="space-y-6 flex-1">
            <div className="flex justify-between items-center pb-4 border-b border-white/5">
              <span className="text-[13px] md:text-[14px] text-[#a1a1aa]">Top performer</span>
              <span className="text-[11px] font-mono font-bold text-white tracking-widest uppercase">3 Clients</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-white/5">
              <span className="text-[13px] md:text-[14px] text-[#a1a1aa]">Average executor</span>
              <span className="text-[11px] font-mono font-bold text-white tracking-widest uppercase">0.4 Clients</span>
            </div>
            
            <div className="pt-2">
              <div className="w-full bg-[#1A0B0B] border border-red-500/20 rounded-xl p-5 flex justify-between items-center">
                <span className="text-[15px] font-medium text-white">Tu</span>
                <span className="text-2xl font-bold text-red-500 tracking-tight">??</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <p className="text-xl md:text-2xl font-bold text-white leading-snug pl-6 border-l-[3px] border-red-500 py-1 tracking-tight">
          Market tera wait nahi kar raha. Har din jo tu ghost rehta hai — <span className="text-red-500">koi aur teri jagah le raha hai.</span>
        </p>
      </div>
    </div>
  );
}
