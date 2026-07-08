import { useRef, useEffect, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { ArrowLeft, ShieldPlus } from "lucide-react";
import { useHealthAssistant } from "@/hooks/use-health-assistant";
import { useVoice } from "@/hooks/use-voice";
import { useAppContext } from "@/context/app-context";
import { ChatMessageBubble, TypingIndicator } from "@/components/chat-message";
import { ChatInput } from "@/components/chat-input";
import { BodyScanAnimation } from "@/components/body-scan";
import { PredictionResultCard } from "@/components/prediction-result";
import { BottomNav } from "@/components/bottom-nav";
import { useState } from "react";

export default function Home() {
  const { lang, setLang, user } = useAppContext();
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const lastSpokenId = useRef<string>("");
  const [, navigate] = useLocation();

  const {
    messages, nextStep, isTyping, isScanning, prediction,
    latestBotMessage, sendMessage, resetSession,
  } = useHealthAssistant(lang);

  const { speak, stopSpeaking, isSpeaking, startListening, stopListening, isListening } = useVoice(lang);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (!ttsEnabled || !latestBotMessage) return;
    const lastBotMsg = messages.filter(m => m.role === 'bot').at(-1);
    if (!lastBotMsg) return;
    if (lastBotMsg.id === lastSpokenId.current) return;
    lastSpokenId.current = lastBotMsg.id;
    const tid = setTimeout(() => speak(latestBotMessage), 400);
    return () => clearTimeout(tid);
  }, [messages, ttsEnabled, latestBotMessage, speak]);

  const handleLangToggle = useCallback(() => {
    stopSpeaking();
    setLang(lang === "en" ? "te" : "en");
  }, [stopSpeaking, lang, setLang]);

  const handleTtsToggle = useCallback(() => {
    if (isSpeaking) stopSpeaking();
    setTtsEnabled(prev => !prev);
  }, [isSpeaking, stopSpeaking]);

  const handleMicClick = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      if (isSpeaking) stopSpeaking();
      startListening(
        (transcript) => sendMessage(transcript),
        (err) => console.warn("Speech recognition error:", err)
      );
    }
  }, [isListening, isSpeaking, stopListening, stopSpeaking, startListening, sendMessage]);

  const handleReset = useCallback(() => {
    stopSpeaking();
    lastSpokenId.current = "";
    resetSession();
  }, [stopSpeaking, resetSession]);

  const headerTitle = lang === "te" ? "ఆరోగ్య పరీక్ష" : "Health Check";

  return (
    <div className="min-h-screen w-full flex flex-col relative overflow-hidden bg-background pb-20">
      {/* Background */}
      <div
        className="absolute inset-0 z-0 opacity-30 pointer-events-none bg-cover bg-center"
        style={{ backgroundImage: `url(${import.meta.env.BASE_URL}images/medical-bg.png)` }}
      />

      {/* Header */}
      <header className="relative z-10 w-full px-4 py-4 flex items-center justify-between border-b border-border/40 bg-white/60 backdrop-blur-md sticky top-0">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/")}
            className="w-9 h-9 rounded-xl bg-secondary/60 flex items-center justify-center hover:bg-secondary transition-colors">
            <ArrowLeft size={18} className="text-foreground" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-white shadow-sm">
              <ShieldPlus size={18} />
            </div>
            <div>
              <h1 className="text-base font-bold text-foreground leading-none">Arogya AI</h1>
              <p className="text-[10px] font-semibold text-primary uppercase tracking-widest">{headerTitle}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {user && (
            <span className="text-xs font-semibold text-muted-foreground bg-secondary/60 px-2.5 py-1 rounded-full">
              👤 {user.name}
            </span>
          )}
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
            lang === "te"
              ? "bg-amber-50 border-amber-300 text-amber-700"
              : "bg-blue-50 border-blue-300 text-blue-700"
          }`}>
            {lang === "te" ? "🇮🇳 తెలుగు" : "🌐 English"}
          </span>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 relative z-10 flex flex-col w-full max-w-2xl mx-auto px-4 py-4 overflow-hidden">
        <AnimatePresence mode="wait">
          {prediction ? (
            <div key="results" className="w-full flex-1 overflow-y-auto pb-4">
              <PredictionResultCard prediction={prediction} onReset={handleReset} lang={lang} />
            </div>
          ) : (
            <div key="chat" className="flex-1 flex flex-col relative bg-white/50 backdrop-blur-xl rounded-3xl border border-border/60 shadow-xl overflow-hidden" style={{ height: "calc(100vh - 200px)" }}>
              {/* Messages */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 md:px-6 py-6 scroll-smooth">
                {messages.map((msg) => (
                  <ChatMessageBubble key={msg.id} message={msg} />
                ))}
                {isTyping && <TypingIndicator />}
                <div className="h-4" />
              </div>

              {/* Input */}
              <div className="p-4 bg-gradient-to-t from-white/90 to-white/0 border-t border-border/30">
                <ChatInput
                  nextStep={nextStep}
                  isTyping={isTyping || isScanning}
                  onSendMessage={sendMessage}
                  lang={lang}
                  onLangToggle={handleLangToggle}
                  isListening={isListening}
                  isSpeaking={isSpeaking}
                  onMicClick={handleMicClick}
                  onTtsToggle={handleTtsToggle}
                  ttsEnabled={ttsEnabled}
                />
              </div>

              {/* Scanning overlay */}
              <AnimatePresence>
                {isScanning && <BodyScanAnimation />}
              </AnimatePresence>
            </div>
          )}
        </AnimatePresence>
      </main>

      <BottomNav />
    </div>
  );
}
