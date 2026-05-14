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
    ctaTitle: "Готовы начать?",
    ctaSub: "Оставьте заявку, и мы поможем подобрать лучшее место под ваш бюджет.",
    ctaBtn: "Забронировать",
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
    ctaTitle: "Бастауға дайынсыз ба?",
    ctaSub: "Өтінім қалдырыңыз, біз сіздің бюджетіңізге сәйкес келетін ең жақсы орынды табуға көмектесеміз.",
    ctaBtn: "Брондау",
  }
};

const REVIEWS = [
  {
    name: "Айгерим Сейткали",
    initials: "АС",
    event: "Свадьба, Алматы",
    text: "Нашли идеальный зал через toi.kz за 15 минут! Менеджер ресторана перезвонил сразу. Той прошёл на высшем уровне.",
    color: "#800020",
  },
  {
    name: "Бауыржан Нұрланов",
    initials: "БН",
    event: "Той, Астана",
    text: "Очень удобный сервис. Сравнили несколько ресторанов, выбрали лучший по соотношению цены и качества. Рекомендую!",
    color: "#A87935",
  },
];

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

  const bg = darkTheme ? "#0F0F0F" : "#F8F9FA";
  const cardBg = darkTheme ? "#1A1A1A" : "#FFFFFF";
  const textPrimary = darkTheme ? "#FFFBEB" : "#1A1A1A";
  const textSecondary = darkTheme ? "#888" : "#888";

  const greeting = getGreeting(texts);

  return (
    <div style={{ background: bg, color: textPrimary, minHeight: "100vh" }}>
      <div style={{ paddingTop: "calc(20px + env(safe-area-inset-top))", paddingLeft: 20, paddingRight: 20, paddingBottom: 20 }}>
        
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
          <img src="/icons/logo.png" alt="" style={{ width: 52, height: 52, borderRadius: 14 }} />
          <div>
            <div style={{ fontSize: 13, color: textSecondary }}>{greeting},</div>
            <div style={{ fontSize: 20, fontWeight: 800 }}>{profile?.name || texts.welcome}</div>
          </div>
        </div>

        {/* Hero Card */}
        <div style={{ background: "linear-gradient(135deg, #800020 0%, #A87935 100%)", borderRadius: 24, color: "#FFFBEB", padding: 28, boxShadow: "0 12px 30px rgba(128,0,32,0.3)" }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, lineHeight: 1.2, margin: 0 }}>{texts.heroTitle}</h2>
          <p style={{ fontSize: 14, opacity: 0.9, marginTop: 12, lineHeight: 1.5 }}>{texts.heroSub}</p>
          <button onClick={() => router.push("/menu/booking")} style={{ marginTop: 20, background: "#FFFBEB", color: "#800020", border: "none", borderRadius: 12, padding: "14px 24px", fontWeight: 800, fontSize: 14 }}>{texts.startSearch}</button>
        </div>

        <SectionTitle>{texts.quickActions}</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <ActionBox icon="🏛️" label="Залы" onClick={() => router.push("/menu/halls")} dark={darkTheme} cardBg={cardBg} />
          <ActionBox icon="📝" label="Бронь" onClick={() => router.push("/menu/booking")} dark={darkTheme} cardBg={cardBg} />
          <ActionBox icon="🎤" label="Тамада" onClick={() => router.push("/menu/booking")} dark={darkTheme} cardBg={cardBg} />
          <ActionBox icon="📸" label="Фото" onClick={() => router.push("/menu/booking")} dark={darkTheme} cardBg={cardBg} />
        </div>

        <SectionTitle>{texts.events}</SectionTitle>
        <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 10 }}>
          {["Той", "Свадьба", "Ұзату", "Беташар", "Сүндет той"].map(ev => (
            <button key={ev} onClick={() => router.push("/menu/booking")} style={{ background: cardBg, border: `1px solid ${darkTheme ? "#333" : "#EEE"}`, borderRadius: 12, padding: "10px 18px", fontSize: 14, fontWeight: 600, color: textPrimary, whiteSpace: "nowrap" }}>{ev}</button>
          ))}
        </div>

        <SectionTitle>{texts.howItWorks}</SectionTitle>
        <div style={{ background: cardBg, borderRadius: 24, padding: 24, border: `1px solid ${darkTheme ? "#333" : "#EEE"}` }}>
          <Step n="1" t="Выбираете зал" d="Смотрите фото, цены и отзывы в вашем городе." />
          <Step n="2" t="Добавляете услуги" d="Нужен тамада или торт? Просто отметьте галочкой." />
          <Step n="3" t="Получаете оффер" d="Ресторан свяжется с вами, чтобы подтвердить дату." last />
        </div>

        <SectionTitle>{texts.reviews}</SectionTitle>
        {REVIEWS.map(r => (
          <div key={r.name} style={{ background: cardBg, borderRadius: 20, padding: 20, marginBottom: 12, border: `1px solid ${darkTheme ? "#333" : "#EEE"}` }}>
            <div style={{ color: "#FFD700", marginBottom: 8 }}>★★★★★</div>
            <p style={{ fontSize: 14, color: textSecondary, margin: 0, lineHeight: 1.6 }}>&ldquo;{r.text}&rdquo;</p>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: 16, background: r.color, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800 }}>{r.initials}</div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{r.name} · <span style={{ fontWeight: 400, opacity: 0.7 }}>{r.event}</span></div>
            </div>
          </div>
        ))}

        {/* CTA */}
        <div style={{ marginTop: 24, background: "linear-gradient(135deg, #A87935 0%, #800020 100%)", borderRadius: 24, padding: 32, textAlign: "center", color: "white" }}>
          <h3 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>{texts.ctaTitle}</h3>
          <p style={{ fontSize: 14, opacity: 0.8, marginTop: 10 }}>{texts.ctaSub}</p>
          <button onClick={() => router.push("/menu/booking")} style={{ marginTop: 20, background: "white", color: "#800020", border: "none", borderRadius: 12, padding: "14px 32px", fontWeight: 800, fontSize: 15 }}>{texts.ctaBtn}</button>
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ children }) {
  return <div style={{ fontWeight: 900, fontSize: 11, color: "#A87935", letterSpacing: "0.1em", textTransform: "uppercase", margin: "32px 0 16px 4px" }}>{children}</div>;
}

function ActionBox({ icon, label, onClick, dark, cardBg }) {
  return (
    <button onClick={onClick} style={{ background: cardBg, border: `1px solid ${dark ? "#333" : "#EEE"}`, borderRadius: 18, padding: 18, textAlign: "left", display: "flex", flexDirection: "column", gap: 8, cursor: "pointer" }}>
      <div style={{ fontSize: 24 }}>{icon}</div>
      <div style={{ fontWeight: 800, fontSize: 15, color: "inherit" }}>{label}</div>
    </button>
  );
}

function Step({ n, t, d, last }) {
  return (
    <div style={{ marginBottom: last ? 0 : 20, display: "flex", gap: 16 }}>
      <div style={{ width: 28, height: 28, borderRadius: 14, background: "#A87935", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, flexShrink: 0 }}>{n}</div>
      <div>
        <div style={{ fontWeight: 700, fontSize: 15 }}>{t}</div>
        <div style={{ fontSize: 13, color: "#888", marginTop: 4 }}>{d}</div>
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
