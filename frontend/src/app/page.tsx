"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/utils/supabase/client";
import { LandingPage } from "@/components/landing-page";
import { Sidebar } from "@/components/sidebar";
import { ChatView } from "@/components/chat-view";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { VaultModal } from "@/components/vault-modal";
import { SplashScreen } from "@/components/splash-screen";
import { FocusMode } from "@/components/focus-mode";
import { AuthModal } from "@/components/auth-modal";
import { Archive } from "lucide-react";

export default function EntryPoint() {
  const [isLocked, setIsLocked] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [hasSession, setHasSession] = useState(false);
  const [hasActiveMission, setHasActiveMission] = useState(false);
  const [isVaultOpen, setIsVaultOpen] = useState(false);
  const [isFocusModeOpen, setIsFocusModeOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const doubleTapRef = useRef(0);
  const isAnonymousRef = useRef(isAnonymous);

  useEffect(() => {
    isAnonymousRef.current = isAnonymous;
  }, [isAnonymous]);

  useEffect(() => {
    const checkActiveMission = async () => {
      try {
const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;
        const res = await fetch(`${baseUrl}/api/v1/interaction/active-mission`, {
          headers: { "Authorization": `Bearer ${session?.access_token}` }

        });
        const result = await res.json();
        if (result?.data) {
          setHasActiveMission(true);
        }
      } catch (err) {
        console.error("Failed checking active mission status:", err);
      }
    };
    
    const checkSession = async () => {
      // If there's an access token in the URL, wait a moment for Supabase to automatically process it
      if (typeof window !== 'undefined' && window.location.hash.includes('access_token')) {
        setHasSession(true);
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setHasSession(true);
        setIsLocked(true);
      }
      
      const { data: authListener } = supabase.auth.onAuthStateChange(
        (event, session) => {
          console.log("Auth event:", event, session ? "Session exists" : "No session");
          if (session) {
            setHasSession(true);
            setIsLocked(true);
          } else {
            setHasSession(false);
            if (!isAnonymousRef.current) {
              setIsLocked(false);
            }
          }
        }
      );
      
      return () => {
        authListener.subscription.unsubscribe();
      };
    };

    checkActiveMission();
    checkSession();
  }, []);

  const verifyAndLock = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      setIsLocked(true);
      setHasSession(true);
    } else {
      console.warn("Security check failed: No valid session found.");
    }
  };

  useEffect(() => {
    if (!isLocked) return;

    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      if (isVaultOpen || target.closest("input, textarea, button, a")) return;

      const now = Date.now();
      if (now - doubleTapRef.current < 320) {
        setIsVaultOpen(true);
        doubleTapRef.current = 0;
      } else {
        doubleTapRef.current = now;
      }
    };

    window.addEventListener("pointerdown", handlePointerDown);
    return () => window.removeEventListener("pointerdown", handlePointerDown);
  }, [isLocked, isVaultOpen]);

  // Touch gesture control for Sidebar (Swipe Right to open, Swipe Left to close)
  useEffect(() => {
    if (!isLocked) return;

    let touchStartX = 0;
    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      if (
        isVaultOpen || 
        target.closest("input, textarea, button, a, [role='slider'], pre, code, .overflow-x-auto")
      ) {
        return;
      }

      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (touchStartX === 0 || touchStartY === 0) return;

      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;

      const diffX = touchEndX - touchStartX;
      const diffY = touchEndY - touchStartY;

      // Swipe Right (Open Sidebar) - start in left 60% of the screen
      if (diffX > 80 && Math.abs(diffY) < 60 && touchStartX < window.innerWidth * 0.6) {
        setIsSidebarOpen(true);
      }

      // Swipe Left (Close Sidebar)
      if (diffX < -80 && Math.abs(diffY) < 60) {
        setIsSidebarOpen(false);
      }

      touchStartX = 0;
      touchStartY = 0;
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isLocked, isVaultOpen]);

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  if (!showSplash && !isLocked) {
    return <LandingPage onLock={verifyAndLock} onAnonymous={() => { setIsAnonymous(true); setIsLocked(true); }} hasSession={hasSession} />;
  }


  return (
    <div className="h-[100dvh] w-screen flex bg-black overflow-hidden relative animate-app-in">
      <style>{`
        @keyframes app-in {
          0% { transform: scale(1.05) translate3d(0, 30px, 0); opacity: 0; }
          100% { transform: scale(1) translate3d(0, 0, 0); opacity: 1; }
        }
        .animate-app-in {
          animation: app-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          will-change: transform, opacity;
        }
      `}</style>
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
        onOpenVault={() => setIsVaultOpen(true)} 
        onSignOut={async () => {
          await supabase.auth.signOut();
          setIsLocked(false);
          setIsAnonymous(false);
        }}
        isAnonymous={isAnonymous}
      />
      
      <ChatView
        onOpenSidebar={() => setIsSidebarOpen(true)}
        onOpenVault={() => setIsVaultOpen(true)}
        onOpenFocusMode={() => setIsFocusModeOpen(true)}
        isAnonymous={isAnonymous}
        onRequireAuth={() => setIsAuthOpen(true)}
      />
      
      {isVaultOpen && <VaultModal onClose={() => setIsVaultOpen(false)} />}

      {isAuthOpen && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <AuthModal 
            onClose={() => setIsAuthOpen(false)}
            onSuccess={() => {
              setIsAuthOpen(false);
              setIsAnonymous(false);
              // Trigger sync event that chat-view will listen to
              window.dispatchEvent(new Event("sync-anonymous-thread"));
            }}
            initialMode="signup"
            titleOverride="Time to Commit."
            messageOverride="You've sent 3 messages. Log in now to save your progress and unlock unlimited execution."
          />
        </div>
      )}
      
      {/* Integrating the Gamified Focus Mode Vault */}
      <FocusMode 
        isOpen={isFocusModeOpen} 
        onClose={(distracted) => {
          setIsFocusModeOpen(false);
          if (distracted) {
            // Ideally trigger the AI backend to roast them here.
            console.log("Streak broken due to distraction!");
          }
        }} 
        taskTitle="Deep Execution Phase" 
      />

      <MobileBottomNav 
        onOpenVault={() => setIsVaultOpen(true)}
        onOpenSidebar={() => setIsSidebarOpen(true)}
        onNewChat={() => {
          const event = new Event("new-thread");
          window.dispatchEvent(event);
        }}
      />
    </div>
  );
}
