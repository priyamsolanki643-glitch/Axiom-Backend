"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert, Check, X, AlertTriangle, Play, Sparkles } from "lucide-react";

type PathType = "Alpha" | "Beta" | null;

export default function PathSelection() {
  const router = useRouter();
  const [selectedPath, setSelectedPath] = useState<PathType>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isLocking, setIsLocking] = useState(false);

  const lockTrajectory = async () => {
    if (!isConfirmed || isLocking) return;
    setIsLocking(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const payload = {
        userId: "test-user",
        missionName: selectedPath === "Alpha" ? "Localized No-Code SME Integration" : "Predictable SaaS Freelance Writing",
        lockedPath: selectedPath?.toLowerCase() || "beta",
        probabilityLow: selectedPath === "Alpha" ? 18.4 : 74.2,
        probabilityHigh: selectedPath === "Alpha" ? 24.0 : 82.5,
        totalDays: selectedPath === "Alpha" ? 90 : 45,
        mindsetBrief: selectedPath === "Alpha" 
          ? "Build localized no-code integration systems for regional SMEs. Zero off-days."
          : "Targeted freelance technical writing for Series A SaaS startups. No feature creep.",
        strategyContent: selectedPath === "Alpha"
          ? "Phase 1: Foundation lock (Day 1–30). Phase 2: Mock war (Day 31–60). Phase 3: Error elimination (Day 61–90)."
          : "Ship MVP in 21 days. Beta waitlist: 50 users. First paying customer by Day 35. Revenue target: ₹15,000 by Day 45.",
        chatThreadId: `thread-locked-${selectedPath?.toLowerCase()}-${Date.now()}`
      };
      
      await fetch(`${baseUrl}/api/v1/interaction/lock-trajectory`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      router.push("/");
    } catch (e) {
      console.error("Locking trajectory error:", e);
      router.push("/");
    } finally {
      setIsLocking(false);
    }
  };

  return (
    <main className="flex flex-col lg:flex-row h-screen w-full relative bg-black overflow-hidden font-sans text-white">
      
      {/* Background Orbs */}
      <div className="pointer-events-none absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-amber-500/5 blur-[120px] mix-blend-screen" />
      <div className="pointer-events-none absolute top-1/2 right-1/4 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-cyan-500/5 blur-[120px] mix-blend-screen" />

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.01]"
        style={{
          backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* PATH ALPHA (Left) */}
      <div className="w-full lg:w-1/2 h-1/2 lg:h-full border-b lg:border-b-0 lg:border-r border-white/5 p-6 md:p-12 lg:p-16 flex flex-col justify-between relative z-10 overflow-y-auto no-scrollbar">
        <div className="space-y-8">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] tracking-[0.2em] text-amber-500 border border-amber-500/20 bg-amber-500/5 px-2 py-0.5 rounded">
              PATH 01
            </span>
            <span className="font-mono text-[10px] tracking-[0.2em] text-[#71717a]">
              HIGH-YIELD TRAJECTORY
            </span>
          </div>

          <div>
            <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight text-white mb-4">
              Path Alpha: The High-Yield Engine
            </h2>
            <p className="text-[15px] text-[#a1a1aa] leading-relaxed max-w-lg">
              Build localized no-code integration systems for regional SMEs. Outsource complex modules, focus entirely on high-frequency B2B sales loops.
            </p>
          </div>
          
          {/* Probability dial widget */}
          <div className="flex items-center gap-6 border border-white/5 bg-white/[0.01] rounded-2xl p-5 max-w-md">
            {/* Styled dial mimic */}
            <div className="relative size-16 shrink-0 flex items-center justify-center">
              <svg viewBox="0 0 36 36" className="size-full -rotate-90">
                <path className="text-white/5" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="text-amber-500" strokeWidth="3" strokeDasharray="18, 100" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
              <span className="absolute text-[11px] font-mono font-bold text-amber-500">18.4%</span>
            </div>
            <div>
              <div className="text-[10px] font-mono text-[#71717a] uppercase tracking-wider mb-0.5">Convergence Probability</div>
              <div className="text-[13px] text-[#e4e4e7] leading-snug">
                18.4% convergence towards $10k/mo MRR inside 90 days. High variance.
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="border border-white/5 bg-white/[0.01] p-4 rounded-xl">
              <h3 className="font-mono font-semibold text-[10px] text-[#71717a] uppercase tracking-wider mb-2">Requires</h3>
              <ul className="space-y-1.5 text-[12px] text-[#a1a1aa] leading-snug list-none">
                <li className="flex items-start gap-1.5"><span className="text-amber-500 select-none">•</span> 4h+ daily cognitive lock</li>
                <li className="flex items-start gap-1.5"><span className="text-amber-500 select-none">•</span> Pure B2B outbound cold sales</li>
                <li className="flex items-start gap-1.5"><span className="text-amber-500 select-none">•</span> Extreme rejection capacity</li>
              </ul>
            </div>
            
            <div className="border border-white/5 bg-white/[0.01] p-4 rounded-xl">
              <h3 className="font-mono font-semibold text-[10px] text-[#71717a] uppercase tracking-wider mb-2">Returns</h3>
              <ul className="space-y-1.5 text-[12px] text-[#a1a1aa] leading-snug list-none">
                <li className="flex items-start gap-1.5"><span className="text-amber-500 select-none">•</span> High asymmetrical upside</li>
                <li className="flex items-start gap-1.5"><span className="text-amber-500 select-none">•</span> Scalable agency structure</li>
              </ul>
            </div>

            <div className="border border-white/5 bg-white/[0.01] p-4 rounded-xl">
              <h3 className="font-mono font-semibold text-[10px] text-red-500/70 uppercase tracking-wider mb-2">Failure Mode</h3>
              <p className="text-[12px] text-[#a1a1aa] leading-normal">
                Burnout from compounded rejection before reaching cashflow convergence.
              </p>
            </div>
          </div>
        </div>

        <button 
          onClick={() => setSelectedPath("Alpha")}
          className="mt-12 w-full max-w-md py-4 rounded-full border border-amber-500/20 bg-amber-500/5 text-amber-400 font-semibold text-[14px] hover:bg-amber-500/10 hover:border-amber-500/40 transition-all duration-200 cursor-pointer text-center"
        >
          Lock Alpha Trajectory
        </button>
      </div>

      {/* PATH BETA (Right) */}
      <div className="w-full lg:w-1/2 h-1/2 lg:h-full p-6 md:p-12 lg:p-16 flex flex-col justify-between relative z-10 overflow-y-auto no-scrollbar">
        <div className="space-y-8">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] tracking-[0.2em] text-cyan-400 border border-cyan-400/20 bg-cyan-400/5 px-2 py-0.5 rounded">
              PATH 02
            </span>
            <span className="font-mono text-[10px] tracking-[0.2em] text-[#71717a]">
              PREDICTABLE COMPOUNDER
            </span>
          </div>

          <div>
            <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight text-white mb-4">
              Path Beta: The Predictable Compounder
            </h2>
            <p className="text-[15px] text-[#a1a1aa] leading-relaxed max-w-lg">
              Targeted freelance technical writing for Series A SaaS startups. Secure 3 recurring retainer clients, then scale via templates and distribution networks.
            </p>
          </div>
          
          {/* Probability dial widget */}
          <div className="flex items-center gap-6 border border-white/5 bg-white/[0.01] rounded-2xl p-5 max-w-md">
            {/* Styled dial mimic */}
            <div className="relative size-16 shrink-0 flex items-center justify-center">
              <svg viewBox="0 0 36 36" className="size-full -rotate-90">
                <path className="text-white/5" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="text-cyan-400" strokeWidth="3" strokeDasharray="74, 100" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
              <span className="absolute text-[11px] font-mono font-bold text-cyan-400">74.2%</span>
            </div>
            <div>
              <div className="text-[10px] font-mono text-[#71717a] uppercase tracking-wider mb-0.5">Convergence Probability</div>
              <div className="text-[13px] text-[#e4e4e7] leading-snug">
                74.2% convergence towards $2k/mo MRR inside 45 days. High predictability.
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="border border-white/5 bg-white/[0.01] p-4 rounded-xl">
              <h3 className="font-mono font-semibold text-[10px] text-[#71717a] uppercase tracking-wider mb-2">Requires</h3>
              <ul className="space-y-1.5 text-[12px] text-[#a1a1aa] leading-snug list-none">
                <li className="flex items-start gap-1.5"><span className="text-cyan-400 select-none">•</span> 2h+ daily execution lock</li>
                <li className="flex items-start gap-1.5"><span className="text-cyan-400 select-none">•</span> Technical communication alpha</li>
                <li className="flex items-start gap-1.5"><span className="text-cyan-400 select-none">•</span> Strict template adherence</li>
              </ul>
            </div>
            
            <div className="border border-white/5 bg-white/[0.01] p-4 rounded-xl">
              <h3 className="font-mono font-semibold text-[10px] text-[#71717a] uppercase tracking-wider mb-2">Returns</h3>
              <ul className="space-y-1.5 text-[12px] text-[#a1a1aa] leading-snug list-none">
                <li className="flex items-start gap-1.5"><span className="text-cyan-400 select-none">•</span> Predictable cashflow floor</li>
                <li className="flex items-start gap-1.5"><span className="text-cyan-400 select-none">•</span> Compounding domain authority</li>
              </ul>
            </div>

            <div className="border border-white/5 bg-white/[0.01] p-4 rounded-xl">
              <h3 className="font-mono font-semibold text-[10px] text-red-500/70 uppercase tracking-wider mb-2">Failure Mode</h3>
              <p className="text-[12px] text-[#a1a1aa] leading-normal">
                Boredom leading to execution failure before core structural compounding occurs.
              </p>
            </div>
          </div>
        </div>

        <button 
          onClick={() => setSelectedPath("Beta")}
          className="mt-12 w-full max-w-md py-4 rounded-full border border-cyan-400/20 bg-cyan-400/5 text-cyan-400 font-semibold text-[14px] hover:bg-cyan-400/10 hover:border-cyan-400/40 transition-all duration-200 cursor-pointer text-center"
        >
          Lock Beta Trajectory
        </button>
      </div>

      {/* CONFIRMATION MODAL TAKEOVER */}
      {selectedPath && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-2xl flex items-center justify-center p-4">
          <div className="relative max-w-xl w-full border border-white/10 bg-[#09090b] rounded-3xl p-8 md:p-10 shadow-[0_25px_80px_-10px_rgba(0,0,0,0.85)]">
            
            {/* Lock Shield Icon */}
            <div className="size-12 rounded-2xl border border-white/10 bg-white/[0.02] flex items-center justify-center mb-6">
              <ShieldAlert className="size-6 text-amber-500 animate-pulse" />
            </div>
            
            <h2 className="text-2xl font-semibold tracking-tight text-white mb-4">
              Commit Path {selectedPath === "Alpha" ? "Alpha" : "Beta"} Trajectory?
            </h2>
            
            <p className="text-[14px] text-[#a1a1aa] leading-relaxed mb-8">
              You are locking this trajectory. The strategy engine will compile daily objectives committed strictly to this vector. Subsequent requests to modify direction without verified structural life shifts will be rejected. You accept that motivation fluctuations are not grounds for recalibration.
            </p>

            {/* Premium Checkbox Toggle */}
            <div 
              onClick={() => setIsConfirmed(!isConfirmed)}
              className="flex items-start gap-4 mb-8 bg-white/[0.02] border border-white/5 rounded-2xl p-4 cursor-pointer select-none hover:border-white/10 transition-colors"
            >
              <div 
                className={`size-5 rounded border flex items-center justify-center mt-0.5 shrink-0 transition-colors ${
                  isConfirmed 
                    ? "bg-white border-white text-black" 
                    : "border-[#3f3f46] bg-transparent"
                }`}
              >
                {isConfirmed && <Check className="size-3.5 stroke-[3]" />}
              </div>
              <div>
                <span className="text-[13px] font-medium text-white block">
                  I accept and understand what I am locking
                </span>
                <span className="text-[11px] text-[#52525b] mt-0.5 block">
                  This action is logged as immutable in the ledger.
                </span>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={lockTrajectory}
                disabled={!isConfirmed || isLocking}
                className="flex-1 py-3.5 rounded-full font-semibold text-[14px] bg-white text-black hover:bg-gray-200 transition-colors disabled:bg-white/5 disabled:text-white/20 cursor-pointer disabled:cursor-not-allowed text-center"
              >
                {isLocking ? "Locking Trajectory..." : "Lock Trajectory"}
              </button>
              
              <button 
                onClick={() => {
                  setSelectedPath(null);
                  setIsConfirmed(false);
                }}
                disabled={isLocking}
                className="px-6 py-3.5 rounded-full font-semibold text-[14px] border border-white/10 bg-transparent text-[#a1a1aa] hover:text-white hover:bg-white/[0.02] transition-colors cursor-pointer text-center"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}
    </main>
  );
}
