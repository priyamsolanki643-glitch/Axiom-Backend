"use client";

import { useState } from "react";
import { Plus, Search, Compass, Archive, Settings, HelpCircle, ChevronDown } from "lucide-react";

interface SidebarProps {
  onOpenVault: () => void;
}

export function Sidebar({ onOpenVault }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [activeItem, setActiveItem] = useState("trajectory");

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-3 left-3 z-50 size-9 grid place-items-center bg-black border border-white/10 rounded-xl text-white cursor-pointer"
      >
        <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 12h18M3 6h18M3 18h18" />
        </svg>
      </button>

      <aside
        className={`fixed inset-y-0 left-0 z-40 lg:relative flex flex-col shrink-0 h-screen transition-all duration-300 bg-black border-r border-[#151515] ${
          isOpen ? "w-[260px]" : "w-[0px] lg:w-[68px] overflow-hidden"
        }`}
      >
        <style>{`
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { scrollbar-width: none; }
        `}</style>

        {/* ── Top Brand Header ── */}
        <div className="p-4 shrink-0 flex flex-col gap-4">
          <div className="flex items-center justify-between h-8">
            <div className="flex items-center gap-3">
              {/* FP Logo: Black circle, white dot */}
              <div className="size-5 rounded-full bg-white flex items-center justify-center shrink-0">
                <div className="size-2 rounded-full bg-black" />
              </div>
              {isOpen && (
                <span className="font-sans font-bold text-[15px] text-white tracking-tight">
                  FP
                </span>
              )}
            </div>
            {isOpen && (
              <button 
                onClick={() => setIsOpen(false)}
                className="text-[#666666] hover:text-white transition-colors cursor-pointer"
              >
                <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect width="18" height="18" x="3" y="3" rx="2" />
                  <path d="M9 3v18" />
                </svg>
              </button>
            )}
          </div>

          {/* New Thread Button */}
          <button 
            className="flex items-center justify-center gap-2 w-full bg-white text-black font-medium py-2 px-4 rounded-full hover:bg-gray-100 transition-colors cursor-pointer text-[13px] shrink-0"
          >
            <Plus className="size-4" />
            {isOpen && <span>New thread</span>}
          </button>
        </div>

        {/* ── Navigation Links ── */}
        <div className="px-3 shrink-0 flex flex-col gap-0.5">
          {/* Search */}
          {isOpen ? (
            <div className="flex items-center justify-between px-3 py-2 text-[#a1a1aa] hover:text-white cursor-pointer transition-colors text-[13px]">
              <div className="flex items-center gap-2.5">
                <Search className="size-4 text-[#666666]" />
                <span>Search</span>
              </div>
              <span className="text-[10px] font-mono text-[#52525b] border border-[#222] rounded px-1.5 py-0.5">⌘K</span>
            </div>
          ) : (
            <button className="size-10 mx-auto grid place-items-center rounded-xl text-[#a1a1aa] hover:text-white hover:bg-white/5 cursor-pointer">
              <Search className="size-4" />
            </button>
          )}

          {/* Trajectory */}
          <button
            onClick={() => setActiveItem("trajectory")}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-[13px] transition-colors ${
              activeItem === "trajectory"
                ? "bg-white/5 text-white"
                : "text-[#a1a1aa] hover:bg-white/5 hover:text-white"
            } ${!isOpen ? "justify-center" : ""}`}
          >
            <Compass className="size-4 shrink-0" />
            {isOpen && <span className="font-medium">Trajectory</span>}
          </button>

          {/* Vault */}
          <button
            onClick={() => {
              setActiveItem("vault");
              onOpenVault();
            }}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer text-[13px] transition-colors ${
              activeItem === "vault"
                ? "bg-white/5 text-white"
                : "text-[#a1a1aa] hover:bg-white/5 hover:text-white"
            } ${!isOpen ? "justify-center" : ""}`}
          >
            <div className="flex items-center gap-3">
              <Archive className="size-4 shrink-0" />
              {isOpen && <span className="font-medium">Vault</span>}
            </div>
            {isOpen && <span className="text-[10px] font-mono text-[#52525b]">2x tap</span>}
          </button>
        </div>

        {/* ── Scrollable History List ── */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-3 py-4 flex flex-col gap-4 min-h-0">
          {isOpen && (
            <>
              {/* Today */}
              <div className="space-y-1">
                <div className="text-[10px] font-semibold text-[#666666] tracking-wider uppercase px-3 mb-1">
                  Today
                </div>
                <button className="w-full text-left py-1.5 px-3 rounded-lg text-[#a1a1aa] hover:text-white transition-colors text-[13px] truncate cursor-pointer block">
                  Compress 90-day SaaS sprint
                </button>
                <button className="w-full text-left py-1.5 px-3 rounded-lg text-[#a1a1aa] hover:text-white transition-colors text-[13px] truncate cursor-pointer block">
                  First-principles: portfolio site
                </button>
              </div>

              {/* Yesterday */}
              <div className="space-y-1">
                <div className="text-[10px] font-semibold text-[#666666] tracking-wider uppercase px-3 mb-1">
                  Yesterday
                </div>
                <button className="w-full text-left py-1.5 px-3 rounded-lg text-[#a1a1aa] hover:text-white transition-colors text-[13px] truncate cursor-pointer block">
                  Audit week 21 execution
                </button>
                <button className="w-full text-left py-1.5 px-3 rounded-lg text-[#a1a1aa] hover:text-white transition-colors text-[13px] truncate cursor-pointer block">
                  Locality arbitrage scan
                </button>
              </div>

              {/* Previous 7 Days */}
              <div className="space-y-1">
                <div className="text-[10px] font-semibold text-[#666666] tracking-wider uppercase px-3 mb-1">
                  Previous 7 Days
                </div>
                <button className="w-full text-left py-1.5 px-3 rounded-lg text-[#a1a1aa] hover:text-white transition-colors text-[13px] truncate cursor-pointer block">
                  Recovery sprint protocol
                </button>
              </div>
            </>
          )}
        </div>

        {/* ── Footer / Upgrade / Profile ── */}
        <div className="p-3 bg-black shrink-0 flex flex-col gap-3">
          
          {/* Upgrade to Pro Card */}
          {isOpen && (
            <div className="p-4 rounded-xl border border-[#1a1a1a] bg-[#050505] flex flex-col gap-3.5">
              <div>
                <h4 className="text-[12px] font-bold text-white font-sans">Upgrade to Pro</h4>
                <p className="text-[11px] text-[#666666] leading-snug mt-1 font-sans">
                  Deep think, longer memory, priority execution.
                </p>
              </div>
              <button className="w-full bg-white text-black font-semibold text-[11px] py-1.5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer text-center">
                Get Pro
              </button>
            </div>
          )}

          {/* User profile row */}
          <div className="flex items-center justify-between w-full p-1 border-t border-white/5 pt-3">
            <div className="flex items-center gap-2.5 min-w-0">
              {/* Profile letter avatar */}
              <div className="size-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                <span className="text-[11px] font-bold text-white">U</span>
              </div>
              {isOpen && (
                <div className="flex flex-col min-w-0">
                  <span className="font-sans text-[12px] text-white font-semibold truncate leading-tight">
                    Operator
                  </span>
                  <span className="font-sans text-[10px] text-[#666666] mt-0.5 leading-none">
                    Free plan
                  </span>
                </div>
              )}
            </div>
            {isOpen && (
              <button className="p-1 rounded text-[#666666] hover:text-white transition-colors cursor-pointer">
                <Settings className="size-4" />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
