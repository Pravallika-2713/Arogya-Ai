import { useState } from "react";
import { motion } from "framer-motion";
import { User, Phone, Calendar, LogOut, Edit3, Save, Globe, Languages, ShieldPlus } from "lucide-react";
import { useAppContext } from "@/context/app-context";
import { BottomNav } from "@/components/bottom-nav";
import { useLocation } from "wouter";
import type { VoiceLang } from "@/context/app-context";

export default function Profile() {
  const { user, setUser, clearUser, lang, setLang } = useAppContext();
  const [, navigate] = useLocation();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [age, setAge] = useState(user?.age ?? "");
  const [gender, setGender] = useState(user?.gender ?? "");

  const L: Record<VoiceLang, Record<string, string>> = {
    en: {
      title: "My Profile", edit: "Edit", save: "Save Changes",
      nameLabel: "Full Name", phoneLabel: "Mobile", ageLabel: "Age", genderLabel: "Gender",
      langTitle: "App Language", logout: "Sign Out", noUser: "Not signed in",
      signIn: "Sign In / Create Profile", settings: "Settings",
      appInfo: "Arogya AI v1.0 — AI-powered health screening tool.",
      disclaimer: "⚠️ Not a substitute for professional medical advice.",
    },
    te: {
      title: "నా ప్రొఫైల్", edit: "సవరించండి", save: "మార్పులు సేవ్ చేయండి",
      nameLabel: "పూర్తి పేరు", phoneLabel: "మొబైల్", ageLabel: "వయస్సు", genderLabel: "లింగం",
      langTitle: "అనువర్తన భాష", logout: "లాగ్ అవుట్", noUser: "లాగిన్ అవ్వలేదు",
      signIn: "లాగిన్ / ప్రొఫైల్ సృష్టించండి", settings: "సెట్టింగ్లు",
      appInfo: "Arogya AI v1.0 — AI ఆరోగ్య స్క్రీనింగ్ సాధనం.",
      disclaimer: "⚠️ ఇది వృత్తిపరమైన వైద్య సలహాకు ప్రత్యామ్నాయం కాదు.",
    },
  };
  const t = L[lang];

  const handleSave = () => {
    if (!name.trim()) return;
    setUser({ name: name.trim(), phone, age, gender });
    setEditing(false);
  };

  const handleLogout = () => {
    clearUser();
    navigate("/");
  };

  const avatar = user?.name?.[0]?.toUpperCase() ?? "?";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50/20 pb-28">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-border/30 sticky top-0 z-40">
        <div className="max-w-lg mx-auto px-5 py-4 flex items-center gap-3">
          <ShieldPlus size={20} className="text-primary" />
          <h1 className="text-lg font-bold text-foreground">{t.title}</h1>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 pt-6 space-y-5">
        {/* Avatar + Name */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl border border-border/60 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-br from-teal-500 to-teal-700 p-6 flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-white text-2xl font-bold shadow-inner">
              {avatar}
            </div>
            <div>
              <p className="text-white/70 text-xs font-medium">{user ? t.nameLabel : t.noUser}</p>
              <p className="text-white font-bold text-lg">{user?.name ?? "—"}</p>
              {user?.phone && <p className="text-white/70 text-xs">{user.phone}</p>}
            </div>
          </div>

          {user ? (
            <div className="p-5 space-y-4">
              {editing ? (
                <>
                  <Field label={t.nameLabel} icon={<User size={14}/>}>
                    <input value={name} onChange={e => setName(e.target.value)}
                      className="w-full bg-secondary/30 border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </Field>
                  <Field label={t.phoneLabel} icon={<Phone size={14}/>}>
                    <input value={phone} onChange={e => setPhone(e.target.value)} type="tel" maxLength={10}
                      className="w-full bg-secondary/30 border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </Field>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label={t.ageLabel} icon={<Calendar size={14}/>}>
                      <input value={age} onChange={e => setAge(e.target.value)} type="number" min={1} max={120}
                        className="w-full bg-secondary/30 border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                    </Field>
                    <Field label={t.genderLabel} icon={<User size={14}/>}>
                      <select value={gender} onChange={e => setGender(e.target.value)}
                        className="w-full bg-secondary/30 border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                        <option value="">—</option>
                        {["Male","Female","Other"].map(o => <option key={o}>{o}</option>)}
                      </select>
                    </Field>
                  </div>
                  <button onClick={handleSave}
                    className="w-full py-3 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-all flex items-center justify-center gap-2">
                    <Save size={15} /> {t.save}
                  </button>
                </>
              ) : (
                <>
                  <InfoRow icon={<User size={14}/>} label={t.nameLabel} value={user.name} />
                  {user.phone && <InfoRow icon={<Phone size={14}/>} label={t.phoneLabel} value={user.phone} />}
                  {user.age && <InfoRow icon={<Calendar size={14}/>} label={t.ageLabel} value={`${user.age} years`} />}
                  {user.gender && <InfoRow icon={<User size={14}/>} label={t.genderLabel} value={user.gender} />}
                  <button onClick={() => setEditing(true)}
                    className="w-full py-3 rounded-xl border border-primary text-primary font-bold text-sm hover:bg-primary/5 transition-all flex items-center justify-center gap-2">
                    <Edit3 size={15} /> {t.edit}
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="p-5">
              <button onClick={() => navigate("/")}
                className="w-full py-3.5 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-all">
                {t.signIn}
              </button>
            </div>
          )}
        </motion.div>

        {/* Language section */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="bg-white rounded-2xl border border-border/60 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <Languages size={16} className="text-primary" />
            <h3 className="text-sm font-bold text-foreground">{t.langTitle}</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {(["en","te"] as VoiceLang[]).map(l => (
              <button key={l} onClick={() => setLang(l)}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-sm font-bold transition-all ${
                  lang === l
                    ? l === "en" ? "bg-blue-600 border-blue-600 text-white" : "bg-amber-500 border-amber-500 text-white"
                    : "border-border text-muted-foreground hover:bg-secondary/50"
                }`}>
                {l === "en" ? <><Globe size={15}/> English</> : <>🇮🇳 తెలుగు</>}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Sign out */}
        {user && (
          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.08 }}
            onClick={handleLogout}
            className="w-full py-3.5 rounded-2xl border-2 border-red-200 text-red-600 text-sm font-bold hover:bg-red-50 transition-all flex items-center justify-center gap-2">
            <LogOut size={15} /> {t.logout}
          </motion.button>
        )}

        {/* App info */}
        <div className="text-center space-y-1 pb-2">
          <p className="text-xs text-muted-foreground">{t.appInfo}</p>
          <p className="text-xs text-amber-600 font-medium">{t.disclaimer}</p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

function Field({ label, icon, children }: { label: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground mb-1.5">
        {icon} {label}
      </label>
      {children}
    </div>
  );
}

function InfoRow({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border/40 last:border-0">
      <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">{icon} {label}</span>
      <span className="text-sm font-semibold text-foreground">{value}</span>
    </div>
  );
}
