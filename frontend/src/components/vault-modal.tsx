"use client";

import { useState, useEffect, useRef } from "react";
import {
  Lock, X, Target, Activity, BarChart3, Users, TrendingUp,
  ArrowRight, CheckCircle, AlertTriangle, Clock, Zap, ChevronRight,
  MapPin, BarChart2,
} from "lucide-react";

/* ──────────────────────────────────────────────────────
   TYPES
────────────────────────────────────────────────────── */
type TabId = "missions" | "mirror" | "debt" | "rival" | "market";

interface VaultModalProps {
  onClose: () => void;
}

/* ──────────────────────────────────────────────────────
   DATA
────────────────────────────────────────────────────── */
const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: "missions", label: "Mission Folders", icon: Target },
  { id: "mirror",   label: "Reality Mirror",  icon: Activity  },
  { id: "debt",     label: "Execution Debt",  icon: BarChart3 },
  { id: "rival",    label: "Rival Index",     icon: Users     },
  { id: "market",   label: "Market Analyser", icon: TrendingUp },
];

const MISSIONS = [
  {
    id: 1,
    title: "JEE 2025 — Top 1000",
    mindset:
      "Tu average nahi hai. Yeh summer window teri zindagi badal sakti hai — sirf tu decide kar. Jo teri capacity hai, woh abhi surface pe bhi nahi aayi. Yeh 90 din teri trajectory ka hinge point hain.",
    strategy:
      "Phase 1: Foundation lock (Day 1–30). Phase 2: Mock war — 1 paper/day (Day 31–60). Phase 3: Error elimination + weak chapter blitz (Day 61–90). Zero off-days. Revision window: 10 PM daily.",
    day: 14,
    totalDays: 90,
    consistency: 73,
    streak: 5,
    chatId: "jee-strategy-01",
  },
  {
    id: 2,
    title: "SaaS MVP → First Revenue",
    mindset:
      "Market nahi ruki — tu ruka tha. Tera product 80% ready hai. Jo 20% bacha hai woh sirf teri laziness ka shadow hai. Yeh 45 din market mein exist karne ka tera last window hai.",
    strategy:
      "Ship MVP in 21 days. Beta waitlist: 50 users. First paying customer by Day 35. Revenue target: ₹15,000 by Day 45. No feature creep until v1.0 is live.",
    day: 8,
    totalDays: 45,
    consistency: 61,
    streak: 2,
    chatId: "saas-launch-01",
  },
];

// 30-day consistency scores — realistic arc: low start, steady climb, slight mid-dip, recovery
const CONSISTENCY_HISTORY = [
  38, 42, 45, 41, 50, 53, 57, 54, 60, 63,
  61, 66, 70, 68, 73, 76, 72, 75, 78, 80,
  77, 80, 75, 73, 76, 79, 77, 74, 72, 73,
];

function getTrend(data: number[]) {
  const mid = Math.floor(data.length / 2);
  const a = data.slice(0, mid).reduce((s, v) => s + v, 0) / mid;
  const b = data.slice(mid).reduce((s, v) => s + v, 0) / (data.length - mid);
  return b >= a ? "up" : "down";
}

/* ──────────────────────────────────────────────────────
   MAIN COMPONENT
────────────────────────────────────────────────────── */
export function VaultModal({ onClose }: VaultModalProps) {
  const [activeTab, setActiveTab] = useState<TabId>("missions");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 30);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  const trend = getTrend(CONSISTENCY_HISTORY);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 md:p-6">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/85 backdrop-blur-2xl cursor-pointer"
      />

      {/* Modal card */}
      <div
        className={`relative w-full max-w-5xl max-h-[92vh] overflow-hidden rounded-[24px] glass-strong flex flex-col text-text-primary transition-all duration-500 ${
          mounted ? "animate-vault-in" : "opacity-0"
        }`}
        style={{ boxShadow: "var(--shadow-vault)" }}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 md:px-7 h-14 border-b border-border shrink-0">
          <div className="flex items-center gap-2.5">
            <Lock className="size-3.5 text-text-secondary" />
            <span className="font-display text-sm font-medium">Vault</span>
            <span className="font-mono text-[9px] tracking-[0.28em] text-text-tertiary ml-1.5 hidden sm:inline">
              PRIVATE · ENCRYPTED
            </span>
          </div>
          <button
            onClick={onClose}
            className="size-9 grid place-items-center rounded-full hover:bg-white/5 text-text-secondary hover:text-text-primary transition cursor-pointer"
            aria-label="Close vault"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* ── Tab Bar ── */}
        <div className="flex items-center gap-1 px-4 md:px-6 py-2.5 border-b border-border overflow-x-auto no-scrollbar shrink-0">
          {TABS.map(({ id, label, icon: Icon }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-3.5 h-8 rounded-full text-sm whitespace-nowrap transition cursor-pointer font-medium ${
                  active
                    ? "bg-text-primary text-black"
                    : "text-text-secondary hover:text-text-primary hover:bg-white/[0.05]"
                }`}
              >
                <Icon className="size-3.5" />
                <span className="hidden sm:inline">{label}</span>
                <span className="sm:hidden">{label.split(" ")[0]}</span>
              </button>
            );
          })}
        </div>

        {/* ── Content ── */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-4 md:px-7 py-6 space-y-0">
          {activeTab === "missions"  && <TabMissions  onClose={onClose} />}
          {activeTab === "mirror"   && <TabMirror   trend={trend} />}
          {activeTab === "debt"     && <TabDebt     />}
          {activeTab === "rival"    && <TabRival    />}
          {activeTab === "market"   && <TabMarket   />}
        </div>

        {/* ── Footer ── */}
        <div className="px-5 md:px-7 h-10 border-t border-border flex items-center justify-between font-mono text-[9px] tracking-[0.28em] text-text-tertiary shrink-0">
          <span>INTEGRITY · 100%</span>
          <span className="hidden sm:inline">ESC TO CLOSE · AES-256</span>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────
   TAB 1 — MISSION FOLDERS
────────────────────────────────────────────────────── */
function TabMissions({ onClose }: { onClose: () => void }) {
  return (
    <div className="animate-fade-up space-y-4">
      <SectionHeader
        title="Mission Folders"
        desc="Your active missions. Every one locked by FP — no edits, only execution."
      />
      {MISSIONS.map((m) => (
        <MissionCard key={m.id} mission={m} onClose={onClose} />
      ))}
    </div>
  );
}

function MissionCard({
  mission: m,
  onClose,
}: {
  mission: (typeof MISSIONS)[0];
  onClose: () => void;
}) {
  const pct = Math.round((m.day / m.totalDays) * 100);
  const consistencyColor =
    m.consistency >= 75 ? "#4ade80" : m.consistency >= 55 ? "#facc15" : "#f87171";

  return (
    <div className="rounded-2xl border border-border bg-white/[0.02] overflow-hidden">
      {/* Progress bar top */}
      <div className="h-[2px] bg-white/[0.06]">
        <div
          className="h-full bg-white/70 transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="p-5 md:p-6 space-y-5">
        {/* Title row */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <span className="size-2 rounded-full bg-text-primary shrink-0" />
              <h3 className="font-display text-base font-medium">{m.title}</h3>
            </div>
            <div className="font-mono text-[10px] tracking-[0.2em] text-text-tertiary pl-4.5 flex items-center gap-3">
              <span>DAY {m.day} OF {m.totalDays}</span>
              <span>·</span>
              <span style={{ color: consistencyColor }}>{m.consistency}% CONSISTENT</span>
              {m.streak > 0 && (
                <>
                  <span>·</span>
                  <span className="text-text-tertiary">{m.streak}D STREAK</span>
                </>
              )}
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="font-mono text-2xl font-medium text-text-primary">{pct}%</div>
            <div className="font-mono text-[9px] text-text-tertiary tracking-widest">COMPLETE</div>
          </div>
        </div>

        {/* Mindset brief */}
        <div className="rounded-xl border border-border bg-black/40 p-4">
          <div className="font-mono text-[9px] tracking-[0.25em] text-text-tertiary mb-2">
            MINDSET BRIEF · FP
          </div>
          <p className="text-sm text-text-secondary leading-relaxed italic">
            &ldquo;{m.mindset}&rdquo;
          </p>
        </div>

        {/* Strategy summary */}
        <div>
          <div className="font-mono text-[9px] tracking-[0.25em] text-text-tertiary mb-2">
            STRATEGY · LOCKED PATH
          </div>
          <p className="text-sm text-text-secondary leading-relaxed">
            {m.strategy}
          </p>
        </div>

        {/* Continue button */}
        <button
          onClick={onClose}
          className="group flex items-center gap-2 px-5 py-2.5 rounded-full bg-text-primary text-black font-medium text-sm cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all w-full sm:w-auto"
        >
          Continue Mission
          <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────
   TAB 2 — REALITY MIRROR
────────────────────────────────────────────────────── */
function TabMirror({ trend }: { trend: "up" | "down" }) {
  const current = CONSISTENCY_HISTORY[CONSISTENCY_HISTORY.length - 1];
  const start   = CONSISTENCY_HISTORY[0];

  return (
    <div className="animate-fade-up space-y-5">
      <SectionHeader
        title="Reality Mirror"
        desc="Teri consistency ka 30-day X-ray. No filter."
      />

      {/* Line graph card */}
      <div className="rounded-2xl border border-border bg-white/[0.02] p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="font-mono text-[9px] tracking-[0.25em] text-text-tertiary">
            CONSISTENCY SCORE · 30 DAYS
          </div>
          <div
            className={`flex items-center gap-1.5 font-mono text-[10px] tracking-widest px-2.5 py-1 rounded-full border ${
              trend === "up"
                ? "border-green-500/25 text-green-400 bg-green-500/5"
                : "border-amber-500/25 text-amber-400 bg-amber-500/5"
            }`}
          >
            <div className={`size-1.5 rounded-full ${trend === "up" ? "bg-green-400" : "bg-amber-400"} animate-pulse`} />
            {trend === "up" ? "Operator mode activated" : "Bhai kya ho raha hai — yeh wala tu nahi hai"}
          </div>
        </div>

        <ConsistencyChart data={CONSISTENCY_HISTORY} trend={trend} />

        {/* Key markers */}
        <div className="flex items-center justify-between mt-3 font-mono text-[9px] text-text-tertiary tracking-widest">
          <span>DAY 1 · {start}%</span>
          <span>TODAY · {current}%</span>
        </div>
      </div>

      {/* Behavioral Insight */}
      <div className="rounded-2xl border border-border bg-white/[0.02] p-5 space-y-4">
        <div className="font-mono text-[9px] tracking-[0.25em] text-text-tertiary">
          BEHAVIORAL INSIGHT · FP ANALYSIS
        </div>
        <p className="text-sm text-text-secondary leading-[1.8]">
          Tu highly specialized hai — teri problem solving speed top 15% hai. Lekin{" "}
          <span className="text-text-primary font-medium">execution windows mein tu disappear ho jaata hai.</span>{" "}
          Yeh teri sabse badi bottleneck hai — capability nahi, consistency ka gap hai.
          Tera pattern show karta hai ki tu day 1–3 strong hota hai, phir drift aata hai.
          Teri biology nahi — yeh tera environment hai. Fix the environment, fix the output.
        </p>

        {trend === "down" && (
          <div className="rounded-xl border border-amber-500/15 bg-amber-500/5 p-4">
            <p className="text-sm text-amber-200/80 leading-relaxed">
              &ldquo;Yeh numbers teri puri story nahi hain. Day 0 pe tu yahan tha — aaj yahan hai. 
              Direction fix kar. Score follow karega.&rdquo;
            </p>
          </div>
        )}

        {/* Pros / Cons */}
        <div className="grid sm:grid-cols-2 gap-3 pt-1">
          <ProsConsBlock
            type="pros"
            items={[
              "Problem-solving speed: top 15% percentile",
              "High output on Day 1–3 of any sprint",
              "Teri self-awareness score: above average",
              "Goal clarity — tu jaanta hai kya chahiye",
            ]}
          />
          <ProsConsBlock
            type="cons"
            items={[
              "Execution windows mein disappear ho jaata hai",
              "Environment optimization: zero",
              "Recovery speed post-dip: slow (3.2 avg days)",
              "Procrastination trigger: complexity, not laziness",
            ]}
          />
        </div>
      </div>

      <LegalText text="This insight is based on your self-reported data and chat history within FP only. Not clinical advice." />
    </div>
  );
}

function ConsistencyChart({ data, trend }: { data: number[]; trend: "up" | "down" }) {
  const W = 500, H = 100;
  const pad = { t: 8, r: 8, b: 8, l: 8 };
  const innerW = W - pad.l - pad.r;
  const innerH = H - pad.t - pad.b;

  const min = Math.min(...data) - 5;
  const max = Math.max(...data) + 5;

  const pts = data.map((v, i) => ({
    x: pad.l + (i / (data.length - 1)) * innerW,
    y: pad.t + (1 - (v - min) / (max - min)) * innerH,
  }));

  // Build smooth bezier path
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const cp1x = pts[i - 1].x + (pts[i].x - pts[i - 1].x) / 3;
    const cp2x = pts[i].x - (pts[i].x - pts[i - 1].x) / 3;
    d += ` C ${cp1x} ${pts[i - 1].y}, ${cp2x} ${pts[i].y}, ${pts[i].x} ${pts[i].y}`;
  }

  const fillD = `${d} L ${pts[pts.length - 1].x} ${H} L ${pts[0].x} ${H} Z`;
  const lineColor = trend === "up" ? "#4ade80" : "#facc15";
  const gradId = `cg-${trend}`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 100 }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={lineColor} stopOpacity={0.18} />
          <stop offset="100%" stopColor={lineColor} stopOpacity={0}    />
        </linearGradient>
      </defs>
      {/* Fill */}
      <path d={fillD} fill={`url(#${gradId})`} />
      {/* Line */}
      <path d={d} fill="none" stroke={lineColor} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
      {/* Last point dot */}
      <circle
        cx={pts[pts.length - 1].x}
        cy={pts[pts.length - 1].y}
        r={3}
        fill={lineColor}
      />
    </svg>
  );
}

function ProsConsBlock({ type, items }: { type: "pros" | "cons"; items: string[] }) {
  const isPros = type === "pros";
  const Icon = isPros ? CheckCircle : AlertTriangle;
  const color = isPros ? "text-green-400" : "text-amber-400";
  const bg    = isPros ? "bg-green-500/5 border-green-500/15" : "bg-amber-500/5 border-amber-500/15";

  return (
    <div className={`rounded-xl border p-4 space-y-2.5 ${bg}`}>
      <div className={`flex items-center gap-2 font-mono text-[9px] tracking-[0.2em] ${color}`}>
        <Icon className="size-3" />
        {isPros ? "STRENGTHS" : "BOTTLENECKS"}
      </div>
      <ul className="space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="text-[12px] text-text-secondary leading-relaxed flex gap-2">
            <span className={`mt-[3px] size-1.5 rounded-full shrink-0 ${isPros ? "bg-green-400" : "bg-amber-400"}`} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ──────────────────────────────────────────────────────
   TAB 3 — EXECUTION DEBT TRACKER
────────────────────────────────────────────────────── */
const DEBT_DATA = {
  consistency: 73,
  debtDays: 4,
  daysToGoal: 89,
  streak: 12,
  hasDebt: true,
};

function TabDebt() {
  const [animated, setAnimated] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 150);
    return () => clearTimeout(t);
  }, []);

  const { consistency, debtDays, daysToGoal, streak, hasDebt } = DEBT_DATA;

  return (
    <div className="animate-fade-up space-y-5">
      <SectionHeader
        title="Execution Debt Tracker"
        desc="Jo kaam nahi kiya — woh yahaan dikh raha hai. Honesty pehle."
      />

      {/* ── 3 Circles ── */}
      <div className="grid grid-cols-3 gap-3 md:gap-5">
        <CircleRing
          label="Consistency"
          value={consistency}
          max={100}
          unit="/100"
          color="#fcfbf8"
          animated={animated}
        />
        <CircleRing
          label="Debt Days"
          value={debtDays}
          max={30}
          unit=" Days"
          color="#f87171"
          animated={animated}
          invert
        />
        <CircleRing
          label="Days to Goal"
          value={daysToGoal}
          max={90}
          unit=" Days"
          color="#facc15"
          animated={animated}
        />
      </div>

      {/* ── Debt Impact Block ── */}
      {hasDebt && (
        <div className="rounded-2xl border border-red-500/15 bg-red-500/[0.04] p-5 space-y-2">
          <div className="flex items-center gap-2 font-mono text-[9px] tracking-[0.25em] text-red-400/70">
            <AlertTriangle className="size-3" />
            DEBT IMPACT
          </div>
          <p className="text-sm text-text-secondary leading-[1.8]">
            In {debtDays} dinon mein teri competition ne{" "}
            <span className="text-text-primary font-medium">{debtDays * 1} tasks complete kiye.</span>{" "}
            Market window 6 weeks thi — ab 5.3 weeks hai. Tu wahan khada hai jahan tha —{" "}
            <span className="text-red-300/80">duniya aage nikal gayi.</span>
          </p>
        </div>
      )}

      {/* ── Consistency Win Block ── */}
      {streak >= 5 && (
        <div className="rounded-2xl border border-green-500/15 bg-green-500/[0.04] p-5 space-y-2">
          <div className="flex items-center gap-2 font-mono text-[9px] tracking-[0.25em] text-green-400/70">
            <CheckCircle className="size-3" />
            CONSISTENCY WIN · {streak} DAY STREAK
          </div>
          <p className="text-sm text-text-secondary leading-[1.8]">
            Tu ne{" "}
            <span className="text-text-primary font-medium">{streak} din lagaataar execute kiya.</span>{" "}
            Iss topic mein tera mastery level top 8% hai. Yeh skill ab tera permanent weapon hai —{" "}
            <span className="text-green-300/80">koi cheen nahi sakta.</span>
          </p>
        </div>
      )}

      {/* ── Dynamic bottom line ── */}
      <div className="rounded-xl border border-border bg-white/[0.02] px-5 py-3.5 flex items-center justify-between">
        <p className="text-sm text-text-secondary">
          {hasDebt
            ? "Duniya nahi ruki bhai — tu ruka tha. Aaj se mat ruk."
            : "Operator. No debt. Teri consistency compounding ho rahi hai."}
        </p>
        <div
          className={`size-2 rounded-full shrink-0 ml-3 ${
            hasDebt ? "bg-red-400 animate-pulse" : "bg-green-400 animate-pulse"
          }`}
        />
      </div>

      <LegalText text="Metrics based on your self-reported activity within FP only. Not third-party verified data." />
    </div>
  );
}

function CircleRing({
  label, value, max, unit, color, animated, invert,
}: {
  label: string;
  value: number;
  max: number;
  unit: string;
  color: string;
  animated: boolean;
  invert?: boolean;
}) {
  const R = 38;
  const C = 2 * Math.PI * R;
  const fraction = value / max;
  const offset = animated ? C * (1 - fraction) : C;

  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-white/[0.02] p-4 md:p-5">
      <div className="font-mono text-[9px] tracking-[0.2em] text-text-tertiary text-center">
        {label.toUpperCase()}
      </div>
      <svg width="92" height="92" viewBox="0 0 92 92">
        {/* Track */}
        <circle
          cx="46" cy="46" r={R}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="5"
        />
        {/* Progress */}
        <circle
          cx="46" cy="46" r={R}
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={offset}
          transform="rotate(-90 46 46)"
          style={{ transition: "stroke-dashoffset 1.1s cubic-bezier(0.34,1.56,0.64,1)" }}
        />
        {/* Value */}
        <text
          x="46" y="42"
          textAnchor="middle"
          dominantBaseline="middle"
          fill={color}
          fontSize="16"
          fontWeight="600"
          fontFamily="monospace"
        >
          {value}
        </text>
        <text
          x="46" y="58"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="rgba(255,255,255,0.35)"
          fontSize="9"
          fontFamily="monospace"
        >
          {unit.trim()}
        </text>
      </svg>
      <div className="font-mono text-[9px] text-text-tertiary tracking-widest text-center">
        {invert
          ? `${Math.round(fraction * 100)}% of max`
          : `${Math.round(fraction * 100)}% of target`}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────
   TAB 4 — RIVAL INDEX
────────────────────────────────────────────────────── */
function TabRival() {
  return (
    <div className="animate-fade-up space-y-5">
      <SectionHeader
        title="Rival Index"
        desc="Anonymous. Aggregated. Real market signal — no names, no personal data."
      />

      {/* Main rival block */}
      <div className="rounded-2xl border border-border bg-white/[0.02] p-6 md:p-8 space-y-6">
        {/* Big number */}
        <div className="space-y-1">
          <div className="font-mono text-[9px] tracking-[0.25em] text-text-tertiary">
            SAME GOAL · ANONYMOUS POOL
          </div>
          <div className="font-display text-5xl md:text-6xl font-medium text-text-primary leading-none">
            847
          </div>
          <div className="text-sm text-text-secondary">
            users on the exact same goal as you.
          </div>
        </div>

        {/* Status blocks */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { n: "23",  label: "Milestone crossed", color: "#4ade80" },
            { n: "187", label: "Active this week",  color: "#facc15" },
            { n: "637", label: "Ghost mode",        color: "#f87171" },
          ].map(({ n, label, color }) => (
            <div key={label} className="rounded-xl border border-border bg-black/40 p-4 text-center space-y-1.5">
              <div className="font-mono text-2xl font-semibold" style={{ color }}>{n}</div>
              <div className="font-mono text-[9px] text-text-tertiary tracking-[0.15em] leading-tight">
                {label.toUpperCase()}
              </div>
            </div>
          ))}
        </div>

        {/* Where are you */}
        <div className="rounded-xl border border-white/10 bg-white/[0.025] p-4 flex items-center justify-between gap-4">
          <p className="text-sm text-text-secondary leading-relaxed">
            Tere jaisa 847 log same goal pe hain.{" "}
            <span className="text-text-primary font-medium">23 already milestone cross kar gaye.</span>{" "}
            Tu kahan hai?
          </p>
          <div className="shrink-0 font-mono text-3xl text-text-tertiary">??</div>
        </div>

        {/* Velocity comparison */}
        <div className="space-y-2">
          <div className="font-mono text-[9px] tracking-[0.2em] text-text-tertiary">WEEKLY VELOCITY COMPARISON</div>
          {[
            { label: "Top 5% operators", tasks: 18, color: "#4ade80", width: "100%" },
            { label: "Average executor",  tasks: 5,  color: "#c5c1b9", width: "28%"  },
            { label: "Tu (this week)",    tasks: 9,  color: "#fcfbf8", width: "50%"  },
          ].map(({ label, tasks, color, width }) => (
            <div key={label} className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-text-secondary">{label}</span>
                <span className="font-mono text-text-tertiary">{tasks} tasks</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/[0.06]">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width, backgroundColor: color, opacity: 0.7 }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <LegalText text="Rival data is anonymised and aggregated. No individual user is identified or tracked. FP does not share personal data." />
    </div>
  );
}

/* ──────────────────────────────────────────────────────
   TAB 5 — MARKET ANALYSER
────────────────────────────────────────────────────── */
function TabMarket() {
  return (
    <div className="animate-fade-up space-y-5">
      <SectionHeader
        title="Market Analyser"
        desc="Tera market — live signal. Based on publicly available trends matched to your goal category."
      />

      {/* Section 1 — YOUR MARKET LIVE */}
      <MarketSection icon={MapPin} title="YOUR MARKET LIVE" accent="white">
        <div className="font-mono text-[10px] text-text-tertiary tracking-widest mb-3">
          Teri city mein aaj:
        </div>
        <ul className="space-y-2.5">
          {[
            { label: "Businesses adopting automation tools", val: "4 today",    trend: "+12% vs last week" },
            { label: "WhatsApp CRM demand",                  val: "+31%",       trend: "this week"         },
            { label: "Active competitors in your niche",     val: "12 active",  trend: "↑ 3 this month"   },
            { label: "Avg. time-to-close in your segment",   val: "8 days",     trend: "↓ from 11 days"   },
          ].map(({ label, val, trend }) => (
            <li key={label} className="flex items-start justify-between gap-4 py-2 border-b border-border last:border-0">
              <span className="text-sm text-text-secondary leading-tight">{label}</span>
              <div className="text-right shrink-0">
                <div className="font-mono text-xs text-text-primary">{val}</div>
                <div className="font-mono text-[9px] text-text-tertiary">{trend}</div>
              </div>
            </li>
          ))}
        </ul>
      </MarketSection>

      {/* Section 2 — WINDOW ALERT */}
      <MarketSection icon={Clock} title="WINDOW ALERT" accent="amber">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="font-mono text-3xl font-semibold text-amber-300">3.5</div>
            <div>
              <div className="text-sm text-text-primary font-medium">weeks remaining</div>
              <div className="font-mono text-[9px] text-text-tertiary tracking-widest">OPPORTUNITY WINDOW</div>
            </div>
          </div>
          <p className="text-sm text-text-secondary leading-[1.8]">
            Teri opportunity window:{" "}
            <span className="text-amber-300 font-medium">3.5 weeks baaki.</span>{" "}
            Iske baad market saturate ho jayega. Jo aaj execute karega — woh market ka{" "}
            <span className="text-text-primary font-medium">pehla mover hoga.</span>
          </p>
          {/* Countdown bar */}
          <div className="space-y-1">
            <div className="flex justify-between font-mono text-[9px] text-text-tertiary tracking-widest">
              <span>WINDOW START</span><span>SATURATION</span>
            </div>
            <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
              <div className="h-full rounded-full bg-amber-400/60" style={{ width: "41%" }} />
            </div>
            <div className="font-mono text-[9px] text-amber-400/60 tracking-widest">41% OF WINDOW ELAPSED</div>
          </div>
        </div>
      </MarketSection>

      {/* Section 3 — CATEGORY MOVERS */}
      <MarketSection icon={BarChart2} title="CATEGORY MOVERS · THIS WEEK" accent="white">
        <div className="space-y-3">
          {[
            { label: "Top performer",     val: "3 clients closed", color: "#4ade80" },
            { label: "Average executor",  val: "0.4 clients",      color: "#c5c1b9" },
            { label: "Tu",               val: "??",                color: "#fcfbf8"  },
          ].map(({ label, val, color }) => (
            <div key={label} className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
              <span className="text-sm text-text-secondary">{label}</span>
              <span className="font-mono text-sm font-semibold" style={{ color }}>{val}</span>
            </div>
          ))}
        </div>
      </MarketSection>

      {/* Ego attack line */}
      <div className="rounded-xl border border-red-500/15 bg-red-500/[0.04] px-5 py-4 flex items-center gap-3">
        <Zap className="size-4 text-red-400 shrink-0" />
        <p className="text-sm text-text-secondary leading-relaxed">
          Market tera wait nahi kar raha.{" "}
          <span className="text-red-300/80 font-medium">
            Har din jo tu ghost rehta hai — koi aur teri jagah le raha hai.
          </span>
        </p>
      </div>

      <LegalText text="Market data is based on publicly available trends and estimated signals for illustrative purposes only. Not financial or business advice. FP does not guarantee market accuracy." />
    </div>
  );
}

function MarketSection({
  icon: Icon, title, accent, children,
}: {
  icon: React.ElementType;
  title: string;
  accent: "white" | "amber" | "green";
  children: React.ReactNode;
}) {
  const iconColor =
    accent === "amber" ? "text-amber-400" :
    accent === "green" ? "text-green-400" :
    "text-text-secondary";

  return (
    <div className="rounded-2xl border border-border bg-white/[0.02] p-5 space-y-4">
      <div className={`flex items-center gap-2 font-mono text-[9px] tracking-[0.25em] ${iconColor}`}>
        <Icon className="size-3.5" />
        {title}
      </div>
      {children}
    </div>
  );
}

/* ──────────────────────────────────────────────────────
   SHARED COMPONENTS
────────────────────────────────────────────────────── */
function SectionHeader({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="space-y-1 pb-1">
      <h2 className="font-display text-base font-medium text-text-primary">{title}</h2>
      <p className="text-sm text-text-tertiary leading-relaxed">{desc}</p>
    </div>
  );
}

function LegalText({ text }: { text: string }) {
  return (
    <p className="font-mono text-[9px] text-text-tertiary/50 leading-relaxed tracking-wide">
      {text}
    </p>
  );
}
