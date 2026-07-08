import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import {
  ShieldPlus, Stethoscope, CalendarDays, IndianRupee,
  ChevronRight, Globe, Languages, LogIn, UserPlus, Sparkles,
  HeartPulse, AlertTriangle, Info
} from "lucide-react";
import { useAppContext } from "@/context/app-context";
import { BottomNav } from "@/components/bottom-nav";
import type { VoiceLang } from "@/context/app-context";

const TIPS: Record<VoiceLang, string[]> = {
  en: [
    "💧 Drink 8 glasses of water daily to stay hydrated.",
    "🚶 A 30-minute walk daily reduces heart disease risk by 35%.",
    "😴 7–8 hours of sleep boosts your immune system significantly.",
    "🧘 5 minutes of deep breathing reduces blood pressure measurably.",
    "🥦 Add one extra vegetable to each meal for better nutrition.",
  ],
  te: [
    "💧 రోజూ 8 గ్లాసుల నీరు తాగండి — హైడ్రేటెడ్‌గా ఉంటారు.",
    "🚶 రోజు 30 నిమిషాల నడక గుండె జబ్బు ప్రమాదాన్ని 35% తగ్గిస్తుంది.",
    "😴 7–8 గంటల నిద్ర మీ రోగనిరోధక శక్తిని పెంచుతుంది.",
    "🧘 5 నిమిషాల లోతైన శ్వాస రక్తపోటు తగ్గిస్తుంది.",
    "🥦 ప్రతి భోజనంలో ఒక అదనపు కూర తింటే పోషణ మెరుగుపడుతుంది.",
  ],
};

const tip = (lang: VoiceLang) => TIPS[lang][Math.floor(Date.now() / 86400000) % TIPS[lang].length];

function getGreeting(lang: VoiceLang): string {
  const h = new Date().getHours();
  if (lang === "te") {
    if (h < 12) return "శుభోదయం";
    if (h < 17) return "శుభ మధ్యాహ్నం";
    return "శుభ సాయంత్రం";
  }
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
}

// ── Login / Sign-up modal ──────────────────────────────────────────────────
function LoginModal({ onClose }: { onClose: () => void }) {
  const { setUser, lang } = useAppContext();
  const [tab, setTab] = useState<"login" | "signup">("signup");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [error, setError] = useState("");

  const L = {
    en: {
      login: "Sign In", signup: "Create Profile", guestHint: "Continue as Guest (name only)",
      nameLabel: "Full Name", namePh: "Your name", phonePh: "Mobile (optional)",
      agePh: "Age", submit: "Continue", guestBtn: "Skip & Continue as Guest",
      genderLabel: "Gender", genderOpts: ["Male", "Female", "Other"],
      err: "Please enter your name.",
    },
    te: {
      login: "లాగిన్", signup: "ప్రొఫైల్ సృష్టించండి", guestHint: "అతిథిగా కొనసాగండి",
      nameLabel: "పూర్తి పేరు", namePh: "మీ పేరు", phonePh: "మొబైల్ (ఐచ్ఛికం)",
      agePh: "వయస్సు", submit: "కొనసాగించండి", guestBtn: "అతిథిగా కొనసాగించండి",
      genderLabel: "లింగం", genderOpts: ["పురుషుడు", "స్త్రీ", "ఇతరం"],
      err: "దయచేసి మీ పేరు నమోదు చేయండి.",
    },
  }[lang];

  const handleSubmit = () => {
    if (!name.trim()) { setError(L.err); return; }
    setUser({ name: name.trim(), phone, age, gender });
    onClose();
  };

  const handleGuest = () => {
    setUser({ name: lang === "te" ? "అతిథి" : "Guest", phone: "", age: "", gender: "" });
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Tabs */}
        <div className="flex border-b border-border">
          {(["signup", "login"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-4 text-sm font-bold transition-all ${tab === t ? "text-primary border-b-2 border-primary" : "text-muted-foreground"}`}>
              {t === "signup" ? <><UserPlus size={14} className="inline mr-1.5" />{L.signup}</> : <><LogIn size={14} className="inline mr-1.5" />{L.login}</>}
            </button>
          ))}
        </div>

        <div className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-bold text-foreground/70 mb-1.5">{L.nameLabel} *</label>
            <input type="text" placeholder={L.namePh} value={name} onChange={e => setName(e.target.value)}
              className="w-full rounded-xl border border-border bg-secondary/30 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              autoFocus />
          </div>

          {tab === "signup" && (
            <>
              {/* Phone */}
              <div>
                <label className="block text-xs font-bold text-foreground/70 mb-1.5">📞 {L.phonePh}</label>
                <input type="tel" placeholder={L.phonePh} value={phone} onChange={e => setPhone(e.target.value)} maxLength={10}
                  className="w-full rounded-xl border border-border bg-secondary/30 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
              </div>

              {/* Age + Gender */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-foreground/70 mb-1.5">🎂 {L.agePh}</label>
                  <input type="number" placeholder={L.agePh} value={age} onChange={e => setAge(e.target.value)} min={1} max={120}
                    className="w-full rounded-xl border border-border bg-secondary/30 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground/70 mb-1.5">👤 {L.genderLabel}</label>
                  <select value={gender} onChange={e => setGender(e.target.value)}
                    className="w-full rounded-xl border border-border bg-secondary/30 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40">
                    <option value="">--</option>
                    {L.genderOpts.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              </div>
            </>
          )}

          {error && <p className="text-xs text-red-600 font-medium">{error}</p>}

          <button onClick={handleSubmit}
            className="w-full py-3.5 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-all shadow-md">
            {L.submit} →
          </button>

          <button onClick={handleGuest}
            className="w-full py-2.5 rounded-xl border border-border text-muted-foreground text-xs font-medium hover:bg-secondary/50 transition-all">
            {L.guestBtn}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Main Landing page ──────────────────────────────────────────────────────
export default function Landing() {
  const { lang, setLang, user } = useAppContext();
  const [, navigate] = useLocation();
  const [showLogin, setShowLogin] = useState(false);

  const greeting = getGreeting(lang);
  const dailyTip = tip(lang);

  const cards = [
    {
      icon: Stethoscope, label: { en: "Health Check", te: "ఆరోగ్య పరీక్ష" },
      desc: { en: "AI vitals analysis", te: "AI వైటల్స్ విశ్లేషణ" },
      color: "bg-teal-500", light: "bg-teal-50 border-teal-200",
      action: () => navigate("/chat"),
    },
    {
      icon: CalendarDays, label: { en: "Book Appointment", te: "అపాయింట్‌మెంట్" },
      desc: { en: "See specialists", te: "నిపుణులను చూడండి" },
      color: "bg-blue-500", light: "bg-blue-50 border-blue-200",
      action: () => navigate("/chat"),
    },
    {
      icon: IndianRupee, label: { en: "Subsidies", te: "సహాయ పథకాలు" },
      desc: { en: "Gov schemes", te: "ప్రభుత్వ పథకాలు" },
      color: "bg-violet-500", light: "bg-violet-50 border-violet-200",
      action: () => navigate("/chat"),
    },
    {
      icon: HeartPulse, label: { en: "My Reports", te: "నా రిపోర్టులు" },
      desc: { en: "Past results", te: "గత ఫలితాలు" },
      color: "bg-rose-500", light: "bg-rose-50 border-rose-200",
      action: () => navigate("/chat"),
    },
  ];

  const L = {
    en: {
      appSub: "Virtual Health Assistant",
      startCta: "Start Health Check",
      ctaSub: "Powered by AI Decision Tree Model",
      langTitle: "Language / భాష",
      quickTitle: "Quick Actions",
      tipTitle: "Daily Health Tip",
      howTitle: "How it works",
      steps: [
        { n: "1", t: "Enter vitals", d: "Heart rate, BP, SpO₂, Temperature" },
        { n: "2", t: "AI Analysis", d: "Decision Tree model processes 10 inputs" },
        { n: "3", t: "Get Results", d: "Disease prediction + home remedies" },
      ],
      signInBtn: "Sign In / Register",
      welcome: "Welcome back",
      guest: "Guest User",
    },
    te: {
      appSub: "వర్చువల్ హెల్త్ అసిస్టెంట్",
      startCta: "ఆరోగ్య పరీక్ష మొదలు పెట్టండి",
      ctaSub: "AI నిర్ణయ వృక్ష నమూనా ద్వారా",
      langTitle: "Language / భాష",
      quickTitle: "త్వరిత చర్యలు",
      tipTitle: "రోజువారీ ఆరోగ్య చిట్కా",
      howTitle: "ఇది ఎలా పని చేస్తుంది",
      steps: [
        { n: "1", t: "వైటల్స్ నమోదు", d: "హృదయ స్పందన, BP, SpO₂, ఉష్ణోగ్రత" },
        { n: "2", t: "AI విశ్లేషణ", d: "నిర్ణయ వృక్ష నమూనా 10 inputs ప్రాసెస్ చేస్తుంది" },
        { n: "3", t: "ఫలితాలు పొందండి", d: "జబ్బు అంచనా + ఇంటి చికిత్సలు" },
      ],
      signInBtn: "లాగిన్ / నమోదు",
      welcome: "స్వాగతం",
      guest: "అతిథి వినియోగదారు",
    },
  }[lang];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/30 to-blue-50/20 pb-24">
      {/* ── Header ───────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-border/30 px-5 py-4">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center shadow-md">
              <ShieldPlus size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground leading-none">Arogya AI</h1>
              <p className="text-[10px] text-primary font-semibold uppercase tracking-wider">{L.appSub}</p>
            </div>
          </div>
          {user ? (
            <button onClick={() => navigate("/profile")}
              className="flex items-center gap-2 bg-teal-50 border border-teal-200 px-3 py-1.5 rounded-full">
              <div className="w-6 h-6 rounded-full bg-teal-600 flex items-center justify-center text-white text-xs font-bold">
                {user.name[0].toUpperCase()}
              </div>
              <span className="text-xs font-semibold text-teal-700 max-w-[80px] truncate">{user.name}</span>
            </button>
          ) : (
            <button onClick={() => setShowLogin(true)}
              className="flex items-center gap-1.5 bg-primary text-white text-xs font-bold px-3.5 py-2 rounded-full shadow-sm hover:bg-primary/90 transition-all">
              <LogIn size={13} /> {L.signInBtn}
            </button>
          )}
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 pt-5 space-y-5">

        {/* ── Greeting Banner ───────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-teal-500 via-teal-600 to-blue-600 rounded-3xl p-6 text-white shadow-lg shadow-teal-200/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-8 -mt-8" />
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full -ml-4 -mb-4" />
          <p className="text-sm font-medium opacity-80 mb-1">{greeting},</p>
          <h2 className="text-2xl font-bold mb-0.5">
            {user ? user.name : (lang === "te" ? "స్వాగతం!" : "Welcome!")}
          </h2>
          {user?.age && <p className="text-xs opacity-70">{user.age} yrs {user.gender && `· ${user.gender}`}</p>}
          <div className="mt-4 flex items-center gap-2 bg-white/20 rounded-xl px-3 py-2 w-fit">
            <Sparkles size={14} />
            <span className="text-xs font-medium">{lang === "te" ? "AI ఆధారిత ఆరోగ్య విశ్లేషణ" : "AI-powered health analysis"}</span>
          </div>
        </motion.div>

        {/* ── Language Selection ────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="bg-white rounded-2xl border border-border/60 shadow-sm p-4">
          <div className="flex items-center gap-2 mb-3">
            <Languages size={16} className="text-primary" />
            <h3 className="text-sm font-bold text-foreground">{L.langTitle}</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => setLang("en")}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-sm font-bold transition-all ${
                lang === "en"
                  ? "bg-blue-600 border-blue-600 text-white shadow-md"
                  : "border-border text-muted-foreground hover:border-blue-300 hover:bg-blue-50"
              }`}>
              <Globe size={16} /> English
            </button>
            <button onClick={() => setLang("te")}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-sm font-bold transition-all ${
                lang === "te"
                  ? "bg-amber-500 border-amber-500 text-white shadow-md"
                  : "border-border text-muted-foreground hover:border-amber-300 hover:bg-amber-50"
              }`}>
              🇮🇳 తెలుగు
            </button>
          </div>
        </motion.div>

        {/* ── Main CTA ──────────────────────────────────────────── */}
        <motion.button initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
          onClick={() => navigate("/chat")}
          whileHover={{ y: -2 }} whileTap={{ y: 0 }}
          className="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-2xl p-5 flex items-center justify-between shadow-lg shadow-teal-200/60 hover:shadow-teal-300/60 transition-all">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <Stethoscope size={24} />
            </div>
            <div className="text-left">
              <p className="font-bold text-base">{L.startCta}</p>
              <p className="text-xs opacity-70 mt-0.5">{L.ctaSub}</p>
            </div>
          </div>
          <ChevronRight size={22} />
        </motion.button>

        {/* ── Quick Actions Grid ────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 px-1">{L.quickTitle}</h3>
          <div className="grid grid-cols-2 gap-3">
            {cards.map(({ icon: Icon, label, desc, color, light, action }) => (
              <button key={label.en} onClick={action}
                className={`${light} border rounded-2xl p-4 flex flex-col gap-2.5 text-left hover:brightness-95 transition-all active:scale-[0.97]`}>
                <div className={`${color} w-10 h-10 rounded-xl flex items-center justify-center shadow-sm`}>
                  <Icon size={18} className="text-white" />
                </div>
                <div>
                  <p className="font-bold text-sm text-foreground">{label[lang]}</p>
                  <p className="text-xs text-muted-foreground">{desc[lang]}</p>
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* ── Daily Tip ─────────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
          className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-400 flex items-center justify-center flex-shrink-0">
            <Info size={16} className="text-white" />
          </div>
          <div>
            <p className="text-xs font-bold text-amber-800 mb-1">{L.tipTitle}</p>
            <p className="text-sm text-amber-900 leading-relaxed">{dailyTip}</p>
          </div>
        </motion.div>

        {/* ── How It Works ──────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }}
          className="bg-white border border-border/60 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={15} className="text-primary" />
            <h3 className="text-sm font-bold text-foreground">{L.howTitle}</h3>
          </div>
          <div className="space-y-3">
            {L.steps.map(s => (
              <div key={s.n} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0">{s.n}</div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{s.t}</p>
                  <p className="text-xs text-muted-foreground">{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Sign-in prompt (if no user) */}
        {!user && (
          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.16 }}
            onClick={() => setShowLogin(true)}
            className="w-full py-3.5 rounded-2xl border-2 border-dashed border-teal-300 text-teal-700 text-sm font-semibold hover:bg-teal-50 transition-all flex items-center justify-center gap-2">
            <UserPlus size={16} /> {L.signInBtn}
          </motion.button>
        )}
      </div>

      {/* ── Login Modal ───────────────────────────────────────── */}
      <AnimatePresence>
        {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
}
