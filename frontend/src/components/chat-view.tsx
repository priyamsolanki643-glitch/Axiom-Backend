"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowUp, Mic, Plus, Menu, Globe, Image, ThumbsUp, ThumbsDown, Share2, Copy, Target, Camera, Paperclip, X } from "lucide-react";

interface ChatViewProps {
  onOpenSidebar: () => void;
  onOpenVault: () => void;
}

interface Message {
  id: string;
  role: "user" | "fp";
  text: string;
  files?: { name: string; url: string; type: string }[];
}



export function ChatView({ onOpenSidebar, onOpenVault }: ChatViewProps) {
  const router = useRouter();
  const [simulationData, setSimulationData] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [greeting, setGreeting] = useState({ text: "Hi bro", accent: "execution kiya ?", animateAccent: true });
  const [isAttachMenuOpen, setIsAttachMenuOpen] = useState(false);
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState("FP Flash");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // File and multimedia upload states
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const photosInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  };

  // Auto-scroll on new messages
  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  useEffect(() => {
    const handleNewThread = () => {
      setMessages([]);
      setInput("");
      setIsThinking(false);
    };
    window.addEventListener("new-thread", handleNewThread);
    return () => window.removeEventListener("new-thread", handleNewThread);
  }, []);

  // Handle textarea height auto adjustment
  useEffect(() => {
    const ta = inputRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 120) + "px";
  }, [input]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const filesArray = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...filesArray]);

    filesArray.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeSelectedFile = (idx: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== idx));
    setFilePreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const startSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Dictation simulated.");
      setIsRecording(true);
      setTimeout(() => {
        setInput(prev => prev + (prev ? " " : "") + "Simulated voice command query.");
        setIsRecording(false);
      }, 1800);
      return;
    }

    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = "en-US";

    rec.onstart = () => {
      setIsRecording(true);
    };

    rec.onerror = (e: any) => {
      console.error(e);
      setIsRecording(false);
    };

    rec.onend = () => {
      setIsRecording(false);
    };

    rec.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      setInput(prev => prev + (prev ? " " : "") + transcript);
    };

    recognitionRef.current = rec;
    rec.start();
  };

  const toggleRecording = () => {
    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
    } else {
      startSpeechRecognition();
    }
  };

  const handleSend = useCallback(async (textOverride?: string) => {
    const text = (textOverride ?? input).trim();
    if (!text && selectedFiles.length === 0) return;
    if (isThinking) return;

    const filesPayload = selectedFiles.map((file, idx) => ({
      name: file.name,
      url: filePreviews[idx],
      type: file.type,
    }));

    setMessages((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        role: "user",
        text,
        files: filesPayload,
      },
    ]);
    
    setInput("");
    setSelectedFiles([]);
    setFilePreviews([]);
    setIsThinking(true);

    try {
      const historyPayload = messages.map((m) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.text }]
      }));
      historyPayload.push({
        role: "user",
        parts: [{ text }]
      });

      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${baseUrl}/api/v1/interaction/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "test-user",
          message: text,
          conversationHistory: historyPayload
        }),
      });
      const data = await res.json();

      let reply = "Parameter logged.";
      if (data?.error) {
        try { reply = "System Error: " + (JSON.parse(data.error)?.error?.message ?? data.error); }
        catch { reply = "System Error: " + data.error; }
      } else if (data?.data?.ai_response?.response_text) {
        reply = data.data.ai_response.response_text;
      }

      if (data?.data?.engine_result?.type === "onboarding_complete") {
        setSimulationData(data.data.engine_result.data);
      }

      setMessages((prev) => [...prev, { id: String(Date.now()), role: "fp", text: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: String(Date.now()), role: "fp", text: "Connection error. Strategy engine offline." },
      ]);
    } finally {
      setIsThinking(false);
      inputRef.current?.focus();
    }
  }, [input, isThinking, messages, selectedFiles, filePreviews]);

  const proceedToSimulation = () => {
    if (!simulationData) return;
    localStorage.setItem("diagnosticResult", JSON.stringify(simulationData.userRuntime));
    localStorage.setItem("architectResult", JSON.stringify(simulationData));
    router.push("/gate");
  };

  const copyToClipboard = (txt: string) => {
    navigator.clipboard.writeText(txt);
  };

  const isInitial = messages.length === 0;

  return (
    <div className="flex-1 flex flex-col min-w-0 relative h-screen bg-[#000000] text-white font-sans overflow-hidden">
      
      {/* CSS Animation definitions for smooth message reveals */}
      <style>{`
        /* Smooth message entrance transition */
        .animate-message-reveal {
          opacity: 0;
          transform: translateY(12px);
          animation: messageEntrance 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes messageEntrance {
          0% {
            opacity: 0;
            transform: translateY(12px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Staggered load transitions for main chat screen (Trajectory Forge style) */
        @keyframes revealChatItem {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .reveal-chat-item {
          opacity: 0;
          animation: revealChatItem 650ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        /* Suggestion card hover lift transition */
        .suggestion-card-transition {
          transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.25s ease, background-color 0.25s ease;
        }
        
        .suggestion-card-transition:hover {
          transform: translateY(-2.5px);
          background-color: #0c0c0e !important;
          border-color: rgba(255, 255, 255, 0.12) !important;
        }

        /* Input area glow transitions */
        .input-console-transition {
          transition: border-color 0.25s ease, box-shadow 0.25s ease;
        }
        
        .input-console-transition:focus-within {
          border-color: rgba(255, 255, 255, 0.15) !important;
          box-shadow: 0 4px 24px rgba(255, 255, 255, 0.03);
        }

        /* Action triggers hover dynamics */
        .action-icon-btn {
          transition: color 0.2s ease, background-color 0.2s ease, transform 0.2s ease;
        }
        
        .action-icon-btn:hover {
          transform: scale(1.05);
        }
      `}</style>

      {/* ── Top Bar Header (Trajectory Forge style) ── */}
      <header 
        className="reveal-chat-item h-14 shrink-0 flex items-center justify-between px-6 bg-[#000000] z-20"
        style={{ animationDelay: "0ms" }}
      >
        <div className="flex items-center gap-3">
          {/* Menu trigger */}
          <button
            onClick={onOpenSidebar}
            className="size-9 grid place-items-center bg-transparent text-white hover:text-gray-300 cursor-pointer transition-colors"
          >
            <Menu className="size-5" />
          </button>
          
          {/* Model selector pill */}
          <div className="relative">
            <button 
              onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-white/5 cursor-pointer transition-colors"
            >
              <span className="text-[14px] font-sans font-medium text-[#e3e3e3]">{selectedModel}</span>
              <svg className={`size-3 text-[#c4c7c5] mt-0.5 transition-transform duration-200 ${isModelDropdownOpen ? 'rotate-180' : ''}`} viewBox="0 0 12 12" fill="none" stroke="currentColor">
                <path d="m3 4.5 3 3 3-3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {/* Model Dropdown */}
            {isModelDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 bg-[#000000] rounded-2xl p-2 flex flex-col gap-1 w-[320px] shadow-2xl z-50 animate-scale-in origin-top-left">
                
                {/* FP Go */}
                <button 
                  onClick={() => { setSelectedModel("FP Go"); setIsModelDropdownOpen(false); }}
                  className="flex flex-col gap-1 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors cursor-pointer text-left group"
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[13px] font-semibold text-[#e3e3e3] group-hover:text-white">FP Go</span>
                  </div>
                  <span className="text-[11px] text-[#888888] leading-snug">Highly recommended for initial constraint scanning and runway calibration.</span>
                </button>

                {/* FP Pro */}
                <button 
                  onClick={() => { setSelectedModel("FP Pro"); setIsModelDropdownOpen(false); }}
                  className="flex flex-col gap-1 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors cursor-pointer text-left group"
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[13px] font-semibold text-[#e3e3e3] group-hover:text-white">FP Pro</span>
                  </div>
                  <span className="text-[11px] text-[#888888] leading-snug">Highly recommended for pathway planning and strategy simulation.</span>
                </button>

                {/* FP Elite */}
                <button 
                  onClick={() => { setSelectedModel("FP Elite"); setIsModelDropdownOpen(false); }}
                  className="flex flex-col gap-1 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors cursor-pointer text-left group"
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[13px] font-semibold text-[#e3e3e3] group-hover:text-white">FP Elite</span>
                  </div>
                  <span className="text-[11px] text-[#888888] leading-snug">Highly recommended for daily execution monitoring and streak retention.</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center">
          <button 
            onClick={() => window.dispatchEvent(new Event('new-thread'))}
            className="size-9 rounded-2xl bg-[#00ff66] text-black hover:bg-[#00cc55] transition-all cursor-pointer grid place-items-center shadow-[0_0_15px_rgba(0,255,102,0.3)]"
          >
            <Plus className="size-5" />
          </button>
        </div>
      </header>

      {/* ── Message stream area ── */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto no-scrollbar relative z-10">
        <div className="max-w-[760px] mx-auto px-4 md:px-8 h-full flex flex-col justify-between">
          
          {isInitial ? (
            /* Minimalist Empty State */
            <div className="flex-1 flex flex-col items-center justify-center py-12">
              <div 
                className="reveal-chat-item flex flex-col items-center gap-2.5"
                style={{ animationDelay: "50ms" }}
              >
                <h2 className="text-[28px] md:text-[36px] font-medium tracking-tight text-white text-center font-sans leading-none">
                  {greeting.text}
                </h2>
                <h2 
                  className={`text-[28px] md:text-[36px] font-medium tracking-tight text-center font-sans leading-none text-[#22c55e] ${greeting.animateAccent ? 'shimmer-text-green' : ''}`} 
                  style={{ textShadow: "0 0 15px rgba(34,197,94,0.3)" }}
                >
                  {greeting.accent}
                </h2>
              </div>
            </div>
          ) : (
            /* Messages list (bubbleless, flat style) */
            <div className="py-6 space-y-8">
              {messages.map((m) => {
                const isUser = m.role === "user";

                return (
                  <div key={m.id} className="animate-message-reveal">
                    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                      
                      {isUser ? (
                        /* User message: Dark bubble with optional files */
                        <div className="max-w-[80%] bg-[#1e1f20] text-[#e3e3e3] text-[14.5px] leading-relaxed px-5 py-3 rounded-[24px] select-text space-y-2.5">
                          {m.text && <div>{m.text}</div>}
                          {m.files && m.files.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-1 border-t border-white/5">
                              {m.files.map((file, fIdx) => (
                                <a
                                  key={fIdx}
                                  href={file.url}
                                  download={file.name}
                                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition text-xs text-[#a1a1aa] hover:text-white max-w-full"
                                >
                                  {file.type.startsWith("image/") ? (
                                    <img src={file.url} alt="attached file" className="max-h-[140px] rounded-lg object-cover" />
                                  ) : (
                                    <>
                                      <Paperclip className="size-3.5" />
                                      <span className="truncate max-w-[140px]">{file.name}</span>
                                    </>
                                  )}
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        /* FP message: Bubbleless raw text */
                        <div className="flex-1 space-y-4 select-text">
                          <div className="font-sans text-[14.5px] leading-relaxed text-[#d4d4d8] whitespace-pre-wrap">
                            {m.text}
                          </div>

                          {/* Actions row */}
                          <div className="flex items-center gap-3 pt-2 text-[#666666]">
                            <button 
                              onClick={() => copyToClipboard(m.text)}
                              className="p-1.5 rounded-full hover:bg-white/5 hover:text-white cursor-pointer transition-colors"
                              title="Copy parameters"
                            >
                              <Copy className="size-3.5" />
                            </button>
                            <button className="p-1.5 rounded-full hover:bg-white/5 hover:text-white cursor-pointer transition-colors">
                              <ThumbsUp className="size-3.5" />
                            </button>
                            <button className="p-1.5 rounded-full hover:bg-white/5 hover:text-white cursor-pointer transition-colors">
                              <ThumbsDown className="size-3.5" />
                            </button>
                          </div>
                        </div>
                      )}

                    </div>
                  </div>
                );
              })}

              {/* Loader */}
              {isThinking && (
                <div className="flex justify-start animate-message-reveal">
                  <div className="flex items-center justify-center p-3 bg-[#000000] w-fit rounded-2xl">
                    <div className="relative w-2.5 h-2.5 animate-[spin_1s_linear_infinite]">
                      <span className="absolute top-0 left-0 size-1 rounded-full bg-[#888888]" />
                      <span className="absolute bottom-0 right-0 size-1 rounded-full bg-[#888888]" />
                    </div>
                  </div>
                </div>
              )}

              {/* Simulation Call-To-Action Banner */}
              {simulationData && (
                <div className="border border-cyan-500/20 bg-cyan-500/5 rounded-2xl p-5 mt-6 flex flex-col md:flex-row md:items-center justify-between gap-4 backdrop-blur-md animate-message-reveal">
                  <div>
                    <h3 className="text-sm font-semibold text-white">Strategy Simulations Compiled</h3>
                    <p className="text-xs text-[#a1a1aa] mt-1">
                      The AI operator has parsed your circumstances and generated optimal trajectories.
                    </p>
                  </div>
                  <button 
                    onClick={proceedToSimulation}
                    className="px-5 py-2 rounded-full bg-white text-black font-semibold text-xs uppercase tracking-wider hover:bg-gray-200 transition-colors cursor-pointer shrink-0"
                  >
                    Proceed to Trajectory Audit
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* ── Input Box (Trajectory Forge copy) ── */}
      <div className="shrink-0 px-4 md:px-8 pb-6 pt-2 bg-[#000000] relative z-10">
        <div 
          className="reveal-chat-item max-w-[760px] w-full mx-auto"
          style={{ animationDelay: "550ms" }}
        >
          
          {/* Sleek Apple-inspired floating capsule */}
          <div className="input-console-transition border border-white/[0.08] bg-[#0a0a0a]/80 backdrop-blur-xl rounded-[32px] p-2.5 flex flex-col gap-2 shadow-[0_8px_32px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.03)]">
            
            {/* Previews of selected files */}
            {selectedFiles.length > 0 && (
              <div className="flex flex-wrap gap-2 px-3 pt-1">
                {selectedFiles.map((file, idx) => (
                  <div key={idx} className="relative flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 text-[12px] text-[#a1a1aa] pr-8 animate-message-reveal">
                    {file.type.startsWith("image/") ? (
                      <img src={filePreviews[idx]} alt="preview" className="size-5 object-cover rounded" />
                    ) : (
                      <Paperclip className="size-3.5" />
                    )}
                    <span className="truncate max-w-[100px]">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeSelectedFile(idx)}
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 size-5 rounded-full hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white cursor-pointer"
                    >
                      <X className="size-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {isRecording && (
              <div className="flex items-center gap-2.5 px-3 py-1 text-xs text-red-400 font-mono animate-pulse">
                <span className="size-2 rounded-full bg-red-500" />
                Listening to voice inputs... Speak now (Click Mic to stop)
              </div>
            )}

            {/* Input area */}
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask FP anything"
              rows={1}
              className="w-full bg-transparent outline-none resize-none text-[14px] text-white placeholder:text-[#666666] py-1.5 px-3 no-scrollbar leading-[1.6]"
              style={{ maxHeight: 120 }}
            />

            {/* Hidden file inputs */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              className="hidden"
            />
            <input
              type="file"
              accept="image/*,video/*"
              ref={photosInputRef}
              onChange={handleFileChange}
              multiple
              className="hidden"
            />
            <input
              type="file"
              accept="image/*"
              ref={cameraInputRef}
              onChange={handleFileChange}
              capture="environment"
              className="hidden"
            />

            {/* Bottom Row inside box */}
            <div className="flex items-center justify-between px-2 pt-1 border-t border-white/[0.02]">
              {/* Left Side feature capsules */}
              <div className="flex items-center gap-2 relative">
                <button
                  type="button"
                  onClick={() => setIsAttachMenuOpen(!isAttachMenuOpen)}
                  className={`size-7 rounded-full grid place-items-center transition-colors cursor-pointer shrink-0 ${isAttachMenuOpen ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-[#666666] hover:text-white'}`}
                  title="Attach"
                >
                  <Plus className={`size-4 transition-transform duration-200 ${isAttachMenuOpen ? 'rotate-45' : ''}`} />
                </button>

                {/* Attachment Menu Popover */}
                {isAttachMenuOpen && (
                  <div className="absolute bottom-full left-0 mb-3 bg-[#1e1f20] border border-white/5 rounded-2xl p-1.5 flex flex-col gap-0.5 shadow-2xl min-w-[140px] animate-scale-in origin-bottom-left">
                    <button 
                      onClick={() => { cameraInputRef.current?.click(); setIsAttachMenuOpen(false); }}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/5 text-[#d4d4d8] hover:text-white transition-colors text-[13px] text-left cursor-pointer"
                    >
                      <Camera className="size-4" />
                      <span>Camera</span>
                    </button>
                    <button 
                      onClick={() => { photosInputRef.current?.click(); setIsAttachMenuOpen(false); }}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/5 text-[#d4d4d8] hover:text-white transition-colors text-[13px] text-left cursor-pointer"
                    >
                      <Image className="size-4" />
                      <span>Photos</span>
                    </button>
                    <button 
                      onClick={() => { fileInputRef.current?.click(); setIsAttachMenuOpen(false); }}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/5 text-[#d4d4d8] hover:text-white transition-colors text-[13px] text-left cursor-pointer"
                    >
                      <Paperclip className="size-4" />
                      <span>Files</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Right Side triggers */}
              <div className="flex items-center gap-2">
                {/* Microphone */}
                <button 
                  type="button"
                  onClick={toggleRecording}
                  className={`size-7 rounded-full grid place-items-center cursor-pointer shrink-0 transition-colors ${
                    isRecording ? "bg-red-500/20 text-red-400" : "hover:bg-white/5 text-[#666666] hover:text-white"
                  }`}
                  title={isRecording ? "Stop voice input" : "Voice input"}
                >
                  <Mic className="size-4" />
                </button>

                {/* Send action arrow */}
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() && selectedFiles.length === 0}
                  className="action-icon-btn size-7 rounded-full grid place-items-center bg-white text-black hover:bg-gray-200 disabled:bg-white/5 disabled:text-[#666666] transition-colors cursor-pointer shrink-0"
                >
                  <ArrowUp className="size-4 stroke-[2.5]" />
                </button>
              </div>
            </div>

          </div>

          {/* Subtext info */}
          <div className="mt-3 text-center">
            <span className="font-sans text-[11px] text-[#52525b]">
              FP is an AI, it can make mistakes.
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
