"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { ref, get } from "firebase/database";
import { useLanguage } from "@/components/LanguageContext";

const T = {
  ru: {
    night: "Доброй ночи",
    morning: "Доброе утро",
    day: "Добрый день",
    evening: "Добрый вечер",
    welcome: "Рады вас видеть!",
    heroTitle: "Ваш идеальный той начинается здесь",
    heroSub: "Мы собрали лучшие залы, тамада и шоу-программы в одном приложении. Больше никаких лишних звонков.",
    startSearch: "Найти зал →",
    quickActions: "ЧТО ИЩЕМ?",
    events: "МЕРОПРИЯТИЯ",
    howItWorks: "ВСЁ ПРОСТО",
    features: "ПОЧЕМУ МЫ?",
    reviews: "ЧТО ГОВОРЯТ ЛЮДИ",
  },
  kz: {
    night: "Қайырлы түн",
    morning: "Қайырлы таң",
    day: "Қайырлы күн",
    evening: "Кеш жарық",
    welcome: "Сізді көргенімізге қуаныштымыз!",
    heroTitle: "Кемел той осы жерден басталады",
    heroSub: "Біз ең жақсы залдарды, тамадалар мен шоу-бағдарламаларды бір жерге жинадық. Артық қоңыраулар қажет емес.",
    startSearch: "Зал табу →",
    quickActions: "НЕ ІЗДЕЙМІЗ?",
    events: "ІС-ШАРАЛАР",
    howItWorks: "БӘРІ ОҢАЙ",
    features: "НЕГЕ БІЗ?",
    reviews: "АДАМДАР НЕ ДЕЙДІ",
  }
};

export default function HomePage() {
  const router = useRouter();
  const { lang } = useLanguage();
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
        try {
          const snap = await get(ref(db, "Users/" + u.uid));
          if (snap.exists()) setProfile(snap.val());
        } catch (e) {}
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const bg = darkTheme ? "#0A0A0A" : "#F8F9FA";
  const cardBg = darkTheme ? "#141414" : "#FFFFFF";
  const textPrimary = darkTheme ? "#FFFBEB" : "#1A1A1A";
  const textSecondary = darkTheme ? "#888" : "#888";
  const border = darkTheme ? "#222" : "#EEE";

  const greeting = getGreeting(texts);

  return (
    <div style={{ 
      background: bg, 
      backgroundImage: darkTheme ? "url('https://www.transparenttextures.com/patterns/dark-matter.png')" : "url('https://www.transparenttextures.com/patterns/linen.png')",
      color: textPrimary, 
      minHeight: "100vh" 
    }}>
      <div style={{ paddingTop: "calc(20px + env(safe-area-inset-top))", paddingLeft: 20, paddingRight: 20, paddingBottom: 40 }}>
        
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
          <div style={{ position: "relative" }}>
             <img src="/icons/logo.png" alt="" style={{ width: 52, height: 52, borderRadius: 14, boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }} />
             <div style={{ position: "absolute", bottom: -2, right: -2, width: 14, height: 14, background: "#4CAF50", borderRadius: 7, border: `2px solid ${bg}` }} />
          </div>
          <div>
            <div style={{ fontSize: 13, color: textSecondary, fontWeight: 500 }}>{greeting},</div>
            <div style={{ fontSize: 20, fontWeight: 800 }}>{profile?.name || texts.welcome}</div>
          </div>
        </div>

        {/* Hero Card */}
        <div style={{ 
          background: "linear-gradient(135deg, #800020 0%, #A87935 100%)", 
          borderRadius: 24, color: "#FFFBEB", padding: 32, 
          boxShadow: "0 15px 35px rgba(128,0,32,0.3)",
          position: "relative", overflow: "hidden"
        }}>
          <div style={{ position: "absolute", top: -20, right: -20, width: 150, height: 150, background: "rgba(255,255,255,0.05)", borderRadius: 75 }} />
          <h2 style={{ fontSize: 26, fontWeight: 900, lineHeight: 1.1, margin: 0 }}>{texts.heroTitle}</h2>
          <p style={{ fontSize: 15, opacity: 0.9, marginTop: 14, lineHeight: 1.5, maxWidth: "80%" }}>{texts.heroSub}</p>
          <button onClick={() => router.push("/menu/booking")} style={{ marginTop: 24, background: "#FFFBEB", color: "#800020", border: "none", borderRadius: 14, padding: "16px 28px", fontWeight: 900, fontSize: 15, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>{texts.startSearch}</button>
        </div>

        <SectionTitle>{texts.quickActions}</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <ActionBox icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4M9 9v.01M9 12v.01M9 15v.01M9 18v.01"/></svg>} label="Залы" onClick={() => router.push("/menu/halls")} dark={darkTheme} cardBg={cardBg} />
          <ActionBox icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>} label="Бронь" onClick={() => router.push("/menu/booking")} dark={darkTheme} cardBg={cardBg} />
          <ActionBox icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.5 1.5M2 2L3.5 9.5"/></svg>} label="Тамада" onClick={() => router.push("/menu/booking")} dark={darkTheme} cardBg={cardBg} />
          <ActionBox icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>} label="Фото" onClick={() => router.push("/menu/booking")} dark={darkTheme} cardBg={cardBg} />
        </div>

        <SectionTitle>{texts.events}</SectionTitle>
        <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 10 }}>
          {["Той", "Свадьба", "Ұзату", "Беташар", "Сүндет той"].map(ev => (
            <button key={ev} onClick={() => router.push("/menu/booking")} style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 14, padding: "12px 20px", fontSize: 14, fontWeight: 700, color: textPrimary, whiteSpace: "nowrap", boxShadow: "0 2px 6px rgba(0,0,0,0.05)" }}>{ev}</button>
          ))}
        </div>

        {/* Feature list */}
        <SectionTitle>{texts.features}</SectionTitle>
        <div style={{ background: cardBg, borderRadius: 24, padding: 8, border: `1px solid ${border}` }}>
          <FeatureItem icon="✅" title="Проверенные залы" desc="Все рестораны проходят нашу личную проверку." dark={darkTheme} />
          <FeatureItem icon="💰" title="Лучшие цены" desc="Прямые цены от заведений без наценок." dark={darkTheme} />
          <FeatureItem icon="📱" title="Всё в одном" desc="Бронируйте зал, тамаду и декор в одном месте." dark={darkTheme} last />
        </div>

        {/* CTA */}
        <div style={{ marginTop: 32, position: "relative", height: 180, borderRadius: 24, overflow: "hidden", boxShadow: "0 15px 35px rgba(0,0,0,0.2)" }}>
           <img src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
           <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 24 }}>
              <div style={{ color: "white", fontWeight: 800, fontSize: 18 }}>Нужна помощь в выборе?</div>
              <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, marginTop: 4 }}>Наши менеджеры подберут зал под ваш бюджет бесплатно.</div>
           </div>
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ children }) {
  return <div style={{ fontWeight: 900, fontSize: 11, color: "#A87935", letterSpacing: "0.12em", textTransform: "uppercase", margin: "36px 0 16px 4px" }}>{children}</div>;
}

function ActionBox({ icon, label, onClick, dark, cardBg }) {
  return (
    <button onClick={onClick} style={{ background: cardBg, border: `1px solid ${dark ? "#222" : "#EEE"}`, borderRadius: 20, padding: 20, textAlign: "left", display: "flex", flexDirection: "column", gap: 10, cursor: "pointer", color: "inherit", transition: "transform 0.2s" }}>
      <div style={{ color: "#A87935" }}>{icon}</div>
      <div style={{ fontWeight: 800, fontSize: 15 }}>{label}</div>
    </button>
  );
}

function FeatureItem({ icon, title, desc, dark, last }) {
  return (
    <div style={{ padding: "16px 20px", borderBottom: last ? "none" : `1px solid ${dark ? "#222" : "#EEE"}`, display: "flex", gap: 16 }}>
       <div style={{ fontSize: 22 }}>{icon}</div>
       <div>
          <div style={{ fontWeight: 700, fontSize: 15 }}>{title}</div>
          <div style={{ fontSize: 13, color: "#888", marginTop: 2 }}>{desc}</div>
       </div>
    </div>
  );
}

function getGreeting(t) {
  const h = new Date().getHours();
  if (h < 6) return t.night;
  if (h < 12) return t.morning;
  if (h < 18) return t.day;
  return t.evening;
}
