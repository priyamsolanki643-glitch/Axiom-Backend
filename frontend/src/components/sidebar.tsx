"use client";

import { useState } from "react";
import {
  Compass, Archive, PanelLeftClose, PanelLeft,
  Settings, Plus, Search, TrendingUp, Zap, Clock,
} from "lucide-react";

interface SidebarProps {
  onOpenVault: () => void;
}

/* Thread types with color-coded dots */
const RECENT_THREADS = [
  { label: "Compress 90-day SaaS sprint",    type: "execution" },
  { label: "First-principles: portfolio site", type: "strategy"  },
  { label: "Audit week 21 execution",          type: "audit"     },
  { label: "Locality arbitrage scan · IN",     type: "research"  },
  { label: "Recovery sprint protocol",         type: "execution" },
  { label: "Onboarding recon — locked",        type: "locked"    },
];

const THREAD_DOT: Record<string, string> = {
  execution: "#4ade80",
  strategy:  "#818cf8",
  audit:     "#fb923c",
  research:  "#38bdf8",
  locked:    "#374151",
};

export function Sidebar({ onOpenVault }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <aside
      className={`hidden lg:flex flex-col shrink-0 transition-[width] duration-450 ease-[var(--transition-smooth)] border-r border-[var(--border-soft)] relative overflow-hidden ${
        isOpen ? "w-[260px]" : "w-[60px]"
      }`}
      style={{
        background: "rgba(8,8,8,0.96)",
        /* glass-style — sidebar is over pure black so blur is subtle */
        backdropFilter: "blur(20px)",
      }}
    >
      {/* ── Gradient edge on right ── */}
      <div
        className="pointer-events-none absolute right-0 top-0 bottom-0 w-px"
        style={{
          background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.06) 20%, rgba(255,255,255,0.06) 80%, transparent)",
        }}
      />

      {/* ── Header ── */}
      <div
        className="flex items-center justify-between h-14 px-3 shrink-0"
        style={{ borderBottom: "1px solid var(--border-soft)" }}
      >
        {isOpen && (
          <div className="flex items-center gap-2.5 pl-1 animate-slide-in-left">
            {/* FP logo mark with online dot */}
            <div className="relative">
              <div
                className="size-[22px] rounded-full"
                style={{ background: "#e8e4de" }}
              />
              {/* Green online dot */}
              <span
                className="absolute -bottom-0.5 -right-0.5 size-2 rounded-full"
                style={{ background: "#4ade80", border: "1.5px solid #080808" }}
              />
            </div>
            <span className="font-display text-[13px] font-medium tracking-tight text-[var(--text-primary)]">
              FP
            </span>
            <span
              className="font-mono text-[8px] tracking-[0.22em] uppercase ml-0.5"
              style={{ color: "var(--text-tertiary)" }}
            >
              OS
            </span>
          </div>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="size-9 grid place-items-center rounded-lg cursor-pointer transition-all duration-200"
          style={{ color: "var(--text-tertiary)" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)";
            (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "transparent";
            (e.currentTarget as HTMLElement).style.color = "var(--text-tertiary)";
          }}
          aria-label="Toggle sidebar"
        >
          {isOpen ? <PanelLeftClose className="size-4" /> : <PanelLeft className="size-4" />}
        </button>
      </div>

      {/* ── New Thread ── */}
      <div className="px-3 py-3 shrink-0">
        <button
          className={`group w-full flex items-center gap-2.5 h-9 rounded-xl transition-all duration-200 cursor-pointer text-sm ${
            isOpen ? "px-3" : "justify-center"
          }`}
          style={{
            border: "1px solid var(--border-soft)",
            background: "transparent",
            color: "var(--text-secondary)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
            (e.currentTarget as HTMLElement).style.borderColor = "var(--border-mid)";
            (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "transparent";
            (e.currentTarget as HTMLElement).style.borderColor = "var(--border-soft)";
            (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
          }}
        >
          <Plus className="size-3.5 shrink-0 transition-transform duration-300 group-hover:rotate-90" />
          {isOpen && <span className="font-medium text-[13px]">New thread</span>}
        </button>
      </div>

      {/* ── Nav + Threads ── */}
      {isOpen ? (
        <div className="flex-1 overflow-y-auto no-scrollbar px-3 pb-3 space-y-5 min-h-0">
          {/* Primary Nav */}
          <nav className="space-y-0.5">
            <NavButton icon={Search}    label="Search"     hint="⌘K" />
            <NavButton icon={Compass}   label="Trajectory" active />
            <NavButton icon={Archive}   label="Vault"      hint="2×" onClick={onOpenVault} />
            <NavButton icon={TrendingUp} label="Progress" />
            <NavButton icon={Zap}       label="Simulate"  />
          </nav>

          {/* Recent Threads */}
          <div>
            <div
              className="px-3 mb-1.5 flex items-center gap-2"
              style={{ color: "var(--text-tertiary)" }}
            >
              <Clock className="size-3" />
              <span className="font-mono text-[9px] tracking-[0.22em] uppercase">Recent</span>
            </div>
            <div className="space-y-0.5">
              {RECENT_THREADS.map((thread, i) => (
                <button
                  key={thread.label}
                  className="w-full text-left flex items-center gap-2.5 px-3 py-[7px] rounded-lg text-[13px] truncate cursor-pointer transition-all duration-150"
                  style={{
                    color: "var(--text-secondary)",
                    opacity: Math.max(0.28, 1 - i * 0.11),
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
                    (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
                    (e.currentTarget as HTMLElement).style.opacity = "1";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                    (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
                    (e.currentTarget as HTMLElement).style.opacity = String(Math.max(0.28, 1 - i * 0.11));
                  }}
                >
                  {/* Color-coded type dot */}
                  <span
                    className="size-1.5 rounded-full shrink-0"
                    style={{ background: THREAD_DOT[thread.type] ?? "#374151" }}
                  />
                  <span className="truncate flex-1">{thread.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Collapsed — icon-only column */
        <div className="flex-1 flex flex-col items-center gap-1 pt-1 min-h-0">
          <IconButton icon={Search}    />
          <IconButton icon={Compass}   active />
          <IconButton icon={Archive}   onClick={onOpenVault} />
          <IconButton icon={TrendingUp} />
          <IconButton icon={Zap}       />
        </div>
      )}

      {/* ── User / Footer ── */}
      <div
        className="shrink-0 p-3"
        style={{ borderTop: "1px solid var(--border-soft)" }}
      >
        <button
          className={`w-full flex items-center gap-2.5 h-9 rounded-xl cursor-pointer transition-all duration-200 ${
            isOpen ? "px-2.5" : "justify-center"
          }`}
          style={{ color: "var(--text-secondary)" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
            (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "transparent";
            (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
          }}
        >
          {/* Avatar — gradient ring */}
          <div
            className="size-[26px] rounded-full grid place-items-center text-[11px] font-semibold shrink-0"
            style={{
              background: "linear-gradient(135deg, rgba(129,140,248,0.4), rgba(99,102,241,0.3))",
              border: "1px solid rgba(129,140,248,0.25)",
              color: "#c7d2fe",
            }}
          >
            U
          </div>
          {isOpen && (
            <>
              <div className="flex-1 text-left min-w-0">
                <div className="text-[12px] font-medium" style={{ color: "var(--text-primary)" }}>Operator</div>
                <div className="font-mono text-[9px] tracking-widest" style={{ color: "var(--text-tertiary)" }}>
                  Free plan
                </div>
              </div>
              <Settings className="size-3.5 shrink-0 transition-transform duration-500 hover:rotate-45" />
            </>
          )}
        </button>
      </div>
    </aside>
  );
}

/* ── Expanded nav item ── */
function NavButton({
  icon: Icon, label, active, hint, onClick,
}: {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  hint?: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2.5 h-9 px-3 rounded-lg text-[13px] transition-all duration-150 cursor-pointer relative ${
        active ? "nav-item-active" : ""
      }`}
      style={
        active
          ? {
              background: "rgba(255,255,255,0.06)",
              color: "var(--text-primary)",
              fontWeight: 500,
            }
          : { color: "var(--text-secondary)" }
      }
      onMouseEnter={(e) => {
        if (!active) {
          (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
          (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          (e.currentTarget as HTMLElement).style.background = "transparent";
          (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
        }
      }}
    >
      <Icon className="size-[15px] shrink-0" />
      <span className="flex-1 text-left">{label}</span>
      {hint && (
        <span className="kbd">{hint}</span>
      )}
    </button>
  );
}

/* ── Collapsed icon button ── */
function IconButton({
  icon: Icon, active, onClick,
}: {
  icon: React.ElementType;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="size-10 grid place-items-center rounded-xl transition-all duration-150 cursor-pointer"
      style={
        active
          ? { background: "rgba(255,255,255,0.07)", color: "var(--text-primary)" }
          : { color: "var(--text-tertiary)" }
      }
      onMouseEnter={(e) => {
        if (!active) {
          (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)";
          (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          (e.currentTarget as HTMLElement).style.background = "transparent";
          (e.currentTarget as HTMLElement).style.color = "var(--text-tertiary)";
        }
      }}
    >
      <Icon className="size-[15px]" />
    </button>
  );
}
