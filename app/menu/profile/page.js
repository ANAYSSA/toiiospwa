"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { ref, get, update } from "firebase/database";
import { useToast } from "@/components/Toast";
import { useLanguage } from "@/components/LanguageContext";

const T = {
  ru: {
    title: "Мой профиль",
    active: "Активный пользователь",
    editProfile: "Редактировать",
    settings: "НАСТРОЙКИ",
    darkTheme: "Тёмная тема",
    language: "Язык (RU / KZ)",
    support: "ПОДДЕРЖКА",
    help: "Помощь и FAQ",
    about: "О приложении",
    logout: "Выйти из аккаунта",
    myEvents: "МОИ МЕРОПРИЯТИЯ",
    noEvents: "У вас пока нет активных бронирований",
    stats: "СТАТИСТИКА"
  },
  kz: {
    title: "Менің профилім",
    active: "Белсенді пайдаланушы",
    editProfile: "Өңдеу",
    settings: "ПАРАМЕТРЛЕР",
    darkTheme: "Қараңғы тақырып",
    language: "Тіл (RU / KZ)",
    support: "ҚОЛДАУ",
    help: "Көмек және FAQ",
    about: "Қосымша туралы",
    logout: "Аккаунттан шығу",
    myEvents: "МЕНІҢ ІС-ШАРАЛАРЫМ",
    noEvents: "Сізде әзірге белсенді брондаулар жоқ",
    stats: "СТАТИСТИКА"
  }
};

export default function ProfilePage() {
  const router = useRouter();
  const showToast = useToast();
  const { lang, changeLang } = useLanguage();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkTheme, setDarkTheme] = useState(false);

  const texts = T[lang] || T.ru;

  useEffect(() => {
    try {
      const saved = localStorage.getItem("theme");
      if (saved === "dark") setDarkTheme(true);
    } catch (e) {}

    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        const snap = await get(ref(db, "Users/" + u.uid));
        if (snap.exists()) setProfile(snap.val());
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const toggleTheme = () => {
    const newVal = !darkTheme;
    setDarkTheme(newVal);
    try {
      localStorage.setItem("theme", newVal ? "dark" : "light");
      if (newVal) document.documentElement.classList.add("dark");
      else document.documentElement.classList.remove("dark");
    } catch (e) {}
  };

  const bg = darkTheme ? "#0A0A0A" : "#F8F9FA";
  const cardBg = darkTheme ? "#141414" : "white";
  const textColor = darkTheme ? "#FFFBEB" : "#1A1A1A";
  const border = darkTheme ? "#222" : "#EEE";

  if (loading) return <div style={{ height: "100vh", background: bg, display: "flex", alignItems: "center", justifyContent: "center" }}><span className="spinner" /></div>;

  return (
    <div style={{ 
      background: bg, 
      backgroundImage: darkTheme ? "url('https://www.transparenttextures.com/patterns/dark-matter.png')" : "url('https://www.transparenttextures.com/patterns/linen.png')",
      color: textColor, 
      minHeight: "100vh",
      paddingBottom: 100,
      overflowY: "auto"
    }}>
      <div style={{ background: "linear-gradient(135deg, #800020 0%, #A87935 100%)", height: 200, position: "relative", paddingTop: "env(safe-area-inset-top)" }}>
        <div style={{ position: "absolute", bottom: -50, left: 20, display: "flex", alignItems: "flex-end", gap: 16 }}>
           <div style={{ width: 100, height: 100, borderRadius: 50, border: "4px solid " + bg, background: "#A87935", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, fontWeight: 900, color: "white", boxShadow: "0 10px 20px rgba(0,0,0,0.2)" }}>
             {profile?.name?.[0] || "U"}
           </div>
           <div style={{ paddingBottom: 10 }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: darkTheme ? "white" : "white" }}>{profile?.name} {profile?.surname}</div>
              <div style={{ fontSize: 13, opacity: 0.8, color: "white" }}>{texts.active}</div>
           </div>
        </div>
      </div>

      <div style={{ marginTop: 70, padding: "0 20px" }}>
        
        <SectionTitle>{texts.stats}</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
           <StatCard label="Баллы" value="450" dark={darkTheme} cardBg={cardBg} border={border} />
           <StatCard label="Тои" value="2" dark={darkTheme} cardBg={cardBg} border={border} />
        </div>

        <SectionTitle>{texts.myEvents}</SectionTitle>
        <div style={{ background: cardBg, borderRadius: 20, padding: 30, textAlign: "center", border: `1px solid ${border}`, color: "#888", fontSize: 14 }}>
           <div style={{ fontSize: 40, marginBottom: 12 }}>📅</div>
           {texts.noEvents}
        </div>

        <SectionTitle>{texts.settings}</SectionTitle>
        <div style={{ background: cardBg, borderRadius: 20, border: `1px solid ${border}`, overflow: "hidden" }}>
           <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: `1px solid ${border}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}><span>🌙</span> {texts.darkTheme}</div>
              <label className="switch">
                <input type="checkbox" checked={darkTheme} onChange={toggleTheme} />
                <span className="slider" />
              </label>
           </div>
           <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}><span>🌐</span> {texts.language}</div>
              <div style={{ display: "flex", gap: 4 }}>
                <button onClick={() => changeLang("ru")} style={{ padding: "6px 12px", borderRadius: 8, background: lang === "ru" ? "#A87935" : "transparent", color: lang === "ru" ? "white" : "#888", border: "none", fontWeight: 700 }}>RU</button>
                <button onClick={() => changeLang("kz")} style={{ padding: "6px 12px", borderRadius: 8, background: lang === "kz" ? "#A87935" : "transparent", color: lang === "kz" ? "white" : "#888", border: "none", fontWeight: 700 }}>KZ</button>
              </div>
           </div>
        </div>

        <SectionTitle>{texts.support}</SectionTitle>
        <div style={{ background: cardBg, borderRadius: 20, border: `1px solid ${border}`, overflow: "hidden" }}>
           <div onClick={() => showToast("Раздел помощи")} style={{ padding: "16px 20px", borderBottom: `1px solid ${border}`, display: "flex", justifyContent: "space-between", cursor: "pointer" }}>
              <span>❓ {texts.help}</span><span>›</span>
           </div>
           <div onClick={() => router.push("/menu/about")} style={{ padding: "16px 20px", borderBottom: `1px solid ${border}`, display: "flex", justifyContent: "space-between", cursor: "pointer" }}>
              <span>ℹ️ {texts.about}</span><span>›</span>
           </div>
           <div onClick={() => { if(confirm("Выйти?")) signOut(auth).then(()=>router.replace("/")) }} style={{ padding: "16px 20px", color: "#F44336", display: "flex", justifyContent: "space-between", cursor: "pointer" }}>
              <span>⏻ {texts.logout}</span>
           </div>
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ children }) {
  return <div style={{ fontWeight: 900, fontSize: 11, color: "#A87935", letterSpacing: "0.1em", textTransform: "uppercase", margin: "32px 0 12px 4px" }}>{children}</div>;
}

function StatCard({ label, value, dark, cardBg, border }) {
  return (
    <div style={{ background: cardBg, borderRadius: 16, padding: 16, border: `1px solid ${border}`, textAlign: "center" }}>
       <div style={{ fontSize: 24, fontWeight: 900, color: "#A87935" }}>{value}</div>
       <div style={{ fontSize: 11, color: "#888", textTransform: "uppercase", marginTop: 4 }}>{label}</div>
    </div>
  );
}
