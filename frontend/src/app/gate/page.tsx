"use client";

import { useRouter } from "next/navigation";
import { ShieldAlert, ArrowRight, ShieldCheck, Activity } from "lucide-react";

export default function SurvivabilityGate() {
  const router = useRouter();

  // Mocking the calculated runway for UI demonstration
  const runwayDays = 67;
  const band: string = "YELLOW"; // Could be RED, YELLOW, or GREEN
  
  const proceedToSimulation = () => {
    router.push("/simulation");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 bg-black text-white relative font-sans overflow-hidden">
      {/* Background radial orbs */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-indigo-900/10 blur-[100px] mix-blend-screen" />
      <div className="pointer-events-none absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-purple-950/10 blur-[100px] mix-blend-screen" />

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.012]"
        style={{
          backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="w-full max-w-2xl flex flex-col relative z-10">
        {/* Header telemetry */}
        <div className="flex items-center gap-3 mb-16 shrink-0">
          <div className="size-6 rounded-full bg-white flex items-center justify-center">
            <span className="text-black text-[9px] font-bold">FP</span>
          </div>
          <span className="font-mono text-[10px] tracking-[0.25em] text-[#71717a] uppercase">
            OPERATOR // SURVIVABILITY_AUDIT
          </span>
        </div>

        {/* Content Box */}
        <div className="space-y-8 mb-12">
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#52525b] mb-2">
            [01] Trajectory Diagnostics
          </div>
          
          {/* Giant digital runway counter */}
          <div className="relative border border-white/5 bg-white/[0.01] rounded-3xl p-8 backdrop-blur-xl">
            {/* Ambient inner glow */}
            <div className="absolute inset-0 rounded-3xl bg-radial-gradient from-white/[0.02] to-transparent pointer-events-none" />
            
            <div className="flex justify-between items-start mb-6">
              <span className="font-mono text-[10px] text-[#71717a] uppercase tracking-wider">
                Liquid Capital Runway
              </span>
              <div className="flex items-center gap-1.5 border border-white/5 bg-white/[0.02] px-2 py-0.5 rounded font-mono text-[9px] text-[#71717a]">
                <Activity className="size-2.5 text-cyan-400" /> LIVE COMPILER
              </div>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-7xl md:text-8xl font-medium tracking-tight text-white font-display">
                {runwayDays}
              </span>
              <span className="text-lg md:text-xl font-mono text-[#71717a] uppercase tracking-wider font-semibold">
                DAYS
              </span>
            </div>

            <p className="mt-4 text-[#71717a] text-[13px] leading-relaxed max-w-md">
              The duration your liquid capital covers active expenses before hitting zero-cashflow convergence.
            </p>
          </div>

          {/* Status Alert Banner */}
          <div 
            className={`border rounded-2xl p-5 flex items-start gap-4 backdrop-blur-md transition-all duration-300 ${
              band === 'RED' 
                ? 'border-red-500/20 bg-red-500/[0.03] text-red-400 shadow-[0_0_24px_rgba(239,68,68,0.02)]' : 
              band === 'YELLOW' 
                ? 'border-amber-500/20 bg-amber-500/[0.03] text-amber-400 shadow-[0_0_24px_rgba(245,158,11,0.02)]' : 
              'border-green-500/20 bg-green-500/[0.03] text-green-400 shadow-[0_0_24px_rgba(34,197,94,0.02)]'
            }`}
          >
            {band === 'RED' ? (
              <ShieldAlert className="size-5 shrink-0 mt-0.5" />
            ) : (
              <ShieldCheck className="size-5 shrink-0 mt-0.5" />
            )}
            <div>
              <div className="font-mono text-[11px] uppercase tracking-widest font-semibold mb-1.5">
                BAND: {band} // CRITICAL
              </div>
              <p className="text-[13px] leading-relaxed text-white">
                {band === 'RED' 
                  ? "Highly Constrained Protocol. The strategy engine will enforce short-term capital collection cycles."
                  : band === 'YELLOW' 
                  ? "Constrained Strategy Mode Active. Moderate experimental range permitted with hard stop-loss buffers."
                  : "Optimal Runway Protocol. Structural long-term strategy execution pipeline unlocked."
                }
              </p>
            </div>
          </div>
        </div>

        {/* Narrative Box */}
        <div className="border border-white/5 bg-[#09090b]/40 rounded-2xl p-6 mb-16 backdrop-blur-sm">
          <p className="font-sans text-[15px] md:text-[16px] leading-[1.7] text-[#a1a1aa]">
            {band === 'RED' 
              ? "Your runway does not support a long-term strategy. All system resources are redirecting to a 14-day income generation protocol. Strategy mode will unlock when your runway exceeds 45 days."
              : "Your liquid capital allows for moderate experimentation but requires strict time-boxing. We will filter out capital-intensive strategies and focus on hybrid income-building trajectories that prioritize speed to cashflow."
            }
          </p>
        </div>

        {/* Button Wrapper */}
        <div className="flex justify-start">
          <button 
            onClick={proceedToSimulation}
            className="group relative inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-white text-black font-semibold text-[14px] hover:bg-gray-100 transition-all duration-200 cursor-pointer shadow-[0_8px_32px_rgba(255,255,255,0.08)] active:scale-95"
          >
            Understood. Proceed.
            <div className="size-5 rounded-full bg-black/10 flex items-center justify-center group-hover:translate-x-0.5 transition-transform duration-200 shrink-0">
              <ArrowRight className="size-3 text-black" />
            </div>
          </button>
        </div>
        
      </div>
    </main>
  );
}
