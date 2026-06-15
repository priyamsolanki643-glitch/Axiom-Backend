"use client";

import { motion } from "framer-motion";
import { Vault, Plus, LayoutGrid, Search } from "lucide-react";

interface MobileBottomNavProps {
  onOpenVault: () => void;
  onOpenSidebar: () => void;
  onNewChat: () => void;
}

export function MobileBottomNav({ onOpenVault, onOpenSidebar, onNewChat }: MobileBottomNavProps) {
  return (
    <motion.div 
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 md:hidden flex items-center gap-1 p-2 rounded-[24px] bg-black/60 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.05)_inset]"
    >
      <motion.button
        whileTap={{ scale: 0.85 }}
        onClick={onOpenSidebar}
        className="p-3 rounded-full text-white/60 hover:text-white transition-colors"
      >
        <LayoutGrid className="size-5" />
      </motion.button>

      <motion.button
        whileTap={{ scale: 0.85 }}
        onClick={onNewChat}
        className="p-3 rounded-full text-white/60 hover:text-white transition-colors"
      >
        <Plus className="size-5" />
      </motion.button>

      <motion.button
        whileTap={{ scale: 0.85 }}
        onClick={onOpenVault}
        className="p-3 mx-1 rounded-full bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)] relative overflow-hidden"
      >
        <Vault className="size-5" />
      </motion.button>

      <motion.button
        whileTap={{ scale: 0.85 }}
        onClick={() => {}}
        className="p-3 rounded-full text-white/60 hover:text-white transition-colors"
      >
        <Search className="size-5" />
      </motion.button>
    </motion.div>
  );
}
