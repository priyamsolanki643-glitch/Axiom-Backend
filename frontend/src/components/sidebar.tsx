"use client";

import { useState } from "react";
import { Plus, Search, MessageSquare, Settings } from "lucide-react";

interface SidebarProps {
  onOpenVault: () => void;
}

const THREADS = [
  "JEE 2025 — week plan",
  "Cold email v3 draft",
  "Body recomp macros",
  "Pricing audit · Tuesday",
];

export function Sidebar({ onOpenVault }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <aside
      className={`hidden lg:flex flex-col shrink-0 transition-[width] duration-300 ease-[var(--transition-smooth)] ${
        isOpen ? "w-[260px]" : "w-[68px]"
      }`}
      style={{
        background: "#000000",
        borderRight: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      {/* ── Brand Header ── */}
      <div className="flex items-center h-16 px-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="size-6 bg-white rounded-full flex items-center justify-center shrink-0">
            <span className="text-black text-[10px] font-bold">FP</span>
          </div>
          {isOpen && (
            <span className="text-[10px] font-mono tracking-widest text-[#a1a1aa] uppercase">
              Operator OS
            </span>
          )}
        </div>
      </div>

      {isOpen ? (
        <div className="flex-1 overflow-y-auto no-scrollbar min-h-0 px-3 mt-2 flex flex-col gap-6">
          
          {/* New Chat Button */}
          <button className="w-full flex items-center gap-2 bg-white text-black px-4 py-2.5 rounded-full font-medium text-[14px] hover:bg-gray-100 transition-colors">
            <Plus className="size-4" />
            <span>New chat</span>
          </button>

          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-[#52525b]" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-[#18181b] text-white text-[13px] rounded-md py-1.5 pl-9 pr-3 outline-none placeholder:text-[#52525b] border border-transparent focus:border-[#27272a] transition-colors"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-[#52525b] font-mono border border-[#27272a] rounded px-1">
              ⌘K
            </div>
          </div>

          {/* Recent Threads */}
          <div>
            <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-[#52525b] px-2">
              Recent
            </div>
            <div className="space-y-0.5">
              {THREADS.map((t, i) => {
                const isActive = i === 0;
                return (
                  <button
                    key={t}
                    className={`w-full text-left px-2 py-2 flex items-center gap-2 rounded-md text-[13px] transition-colors ${
                      isActive ? "text-white" : "text-[#a1a1aa] hover:text-white hover:bg-[#18181b]"
                    }`}
                  >
                    <MessageSquare className={`size-3.5 shrink-0 ${isActive ? "text-white" : "text-[#52525b]"}`} />
                    <span className="truncate">{t}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center gap-4 pt-4 min-h-0">
          <button className="size-9 bg-white text-black rounded-full grid place-items-center">
            <Plus className="size-4" />
          </button>
          <button className="size-9 text-[#52525b] hover:text-white rounded-full grid place-items-center">
            <Search className="size-4" />
          </button>
        </div>
      )}

      {/* ── Footer ── */}
      <div className="shrink-0 p-3 flex flex-col gap-1">
        <button
          className={`w-full flex items-center gap-2 h-10 rounded-md text-[#a1a1aa] hover:text-white hover:bg-[#18181b] transition-colors ${
            isOpen ? "px-2" : "justify-center"
          }`}
          onClick={onOpenVault}
        >
          <div className="size-5 border border-[#27272a] rounded flex items-center justify-center shrink-0">
            <span className="text-[10px]">⌘</span>
          </div>
          {isOpen && <span className="text-[13px]">Vault</span>}
          {isOpen && (
            <div className="ml-auto text-[10px] text-[#52525b] font-mono border border-[#27272a] rounded px-1">
              2x tap
            </div>
          )}
        </button>

        <button
          className={`w-full flex items-center gap-2 h-10 rounded-md text-[#a1a1aa] hover:text-white hover:bg-[#18181b] transition-colors ${
            isOpen ? "px-2" : "justify-center"
          }`}
        >
          <Settings className="size-[18px] shrink-0" />
          {isOpen && <span className="text-[13px]">Settings</span>}
        </button>
      </div>
    </aside>
  );
}
