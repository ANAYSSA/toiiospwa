"use client";
import { useState, useEffect } from "react";
import { useToast } from "@/components/Toast";
import { useLanguage } from "@/components/LanguageContext";
import { isValidEmail, normalizeEmail, sanitizeText } from "@/lib/sanitize";

const T = {
  ru: {
    hero: "О нас",
    subHero: "Мы — команда из Астаны, которая решила сделать организацию тоев проще. Помните, как раньше нужно было обзванивать 20 ресторанов? Мы это исправили.",
    missionLabel: "Зачем мы это делаем?",
    missionText: "Той — это сердце нашей культуры. Но его организация не должна превращаться в головную боль. Мы создали toi.kz, чтобы вы могли забронировать лучший зал и найти тамаду за пару кликов, сидя дома с чаем. Мы проверяем каждый ресторан лично, чтобы ваш праздник прошел без сюрпризов.",
    statsLabel: "Наши достижения",
    teamLabel: "Кто за этим стоит?",
    contactLabel: "Свяжитесь с нами",
    formName: "Как вас зовут?",
    formEmail: "Ваш Email",
    formMsg: "Что вы хотите спросить или предложить?",
    formBtn: "Отправить сообщение",
    thanks: "Спасибо! Мы скоро ответим.",
  },
  kz: {
    hero: "Біз туралы",
    subHero: "Біз — Астанадан келген командамыз, той ұйымдастыруды жеңілдетуді шештік. Бұрын 20 мейрамханаға қоңырау шалу керек болғаны есіңізде ме? Біз оны өзгерттік.",
    missionLabel: "Біз мұны не үшін істейміз?",
    missionText: "Той — біздің мәдениетіміздің жүрегі. Бірақ оны ұйымдастыру қиындық тудырмауы керек. Біз toi.kz-ті сіз үйде шай ішіп отырып, ең жақсы залды брондап, тамада таба алуыңыз үшін жасадық. Әр мейрамхананы жеке тексереміз, сондықтан мерекеңіз мінсіз өтеді.",
    statsLabel: "Біздің жетістіктеріміз",
    teamLabel: "Мұның артында кім тұр?",
    contactLabel: "Бізбен байланысыңыз",
    formName: "Есіміңіз кім?",
    formEmail: "Email-ыңыз",
    formMsg: "Не сұрағыңыз немесе ұсынғыңыз келеді?",
    formBtn: "Хабарлама жіберу",
    thanks: "Рахмет! Жақында жауап береміз.",
  }
};

const TEAM = [
  {
    name: "Ануар Муратбай",
    role: "Founder & AI Guy",
    photo: "/team/Anuar.jpg",
    desc: "Тот самый человек, который кодит это приложение по ночам. Фанатеет от нейросетей и хочет, чтобы в Казахстане был лучший сервис.",
  },
  {
    name: "Фараби Абай",
    role: "Marketing Wizard",
    photo: "/team/Farabi.jpg",
    desc: "Вы наверняка видели его в TikTok. Знает, как сделать так, чтобы о вашем тое узнали все. Главный по креативу.",
  },
  {
    name: "Мухаммад Махан",
    role: "Operations & Sales",
    photo: "/team/Mukhammad.jpg",
    desc: "Человек, который договорится с любым рестораном. Знает всех владельцев тойхан лично и выбивает лучшие условия для вас.",
  },
];

const STATS = [
  { value: "240+", label: "Ресторанов" },
  { value: "12 000+", label: "Тоев проведено" },
  { value: "14", label: "Городов" },
  { value: "4.9", label: "Рейтинг" },
];

export default function AboutPage() {
  const showToast = useToast();
  const { lang } = useLanguage();
  const [darkTheme, setDarkTheme] = useState(false);
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);

  const texts = T[lang] || T.ru;

  useEffect(() => {
    try {
      const saved = localStorage.getItem("theme");
      if (saved === "dark") setDarkTheme(true);
    } catch (e) {}
  }, []);

  const handleContactSubmit = () => {
    const safeContact = {
      name: sanitizeText(contactForm.name, 80),
      email: normalizeEmail(contactForm.email),
      message: sanitizeText(contactForm.message, 1000),
    };

    if (!safeContact.name || !safeContact.message) {
      showToast("Заполните имя и сообщение");
      return;
    }
    if (safeContact.email && !isValidEmail(safeContact.email)) {
      showToast("Invalid email");
      return;
    }
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setContactForm({ name: "", email: "", message: "" });
      showToast(texts.thanks);
    }, 1200);
  };

  const bg = darkTheme ? "#0A0A0A" : "#F8F9FA";
  const cardBg = darkTheme ? "#141414" : "#FFFFFF";
  const textPrimary = darkTheme ? "#FFFBEB" : "#1A1A1A";
  const textSecondary = darkTheme ? "#999" : "#666";
  const border = darkTheme ? "#2A2A2A" : "#EEEEEE";

  return (
    <div style={{ 
      background: bg, 
      backgroundImage: darkTheme ? "url('https://www.transparenttextures.com/patterns/dark-matter.png')" : "url('https://www.transparenttextures.com/patterns/linen.png')",
      color: textPrimary, 
      minHeight: "100vh" 
    }}>
      <div style={{
        background: "linear-gradient(135deg, #800020 0%, #A87935 100%)",
        paddingTop: "calc(20px + env(safe-area-inset-top))",
        paddingBottom: 40,
        paddingLeft: 20, paddingRight: 20,
        textAlign: "center", color: "#FFFBEB",
        boxShadow: "0 4px 20px rgba(0,0,0,0.2)"
      }}>
        <div style={{ fontSize: 10, letterSpacing: "0.25em", opacity: 0.7, marginBottom: 8, fontWeight: 700 }}>TOI.KZ PLATFORM</div>
        <h1 style={{ fontSize: 32, fontWeight: 800, margin: 0, letterSpacing: "-0.02em" }}>{texts.hero}</h1>
        <p style={{ fontSize: 15, opacity: 0.9, marginTop: 12, lineHeight: 1.6, maxWidth: 340, marginInline: "auto" }}>
          {texts.subHero}
        </p>
      </div>

      <div style={{ padding: "0 16px 40px", marginTop: -20 }}>
        {/* Миссия */}
        <div style={{ background: cardBg, borderRadius: 20, padding: 24, boxShadow: "0 10px 30px rgba(0,0,0,0.1)", border: `1px solid ${border}` }}>
          <div style={{ color: "#A87935", fontWeight: 800, fontSize: 12, textTransform: "uppercase", marginBottom: 8 }}>{texts.missionLabel}</div>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: textSecondary, margin: 0 }}>{texts.missionText}</p>
        </div>

        {/* Статистика */}
        <SectionLabel>{texts.statsLabel}</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {STATS.map((s) => (
            <div key={s.label} style={{ background: cardBg, borderRadius: 16, padding: "20px 10px", textAlign: "center", border: `1px solid ${border}`, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
              <div style={{ fontSize: 28, fontWeight: 900, background: "linear-gradient(135deg, #A87935, #800020)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{s.value}</div>
              <div style={{ fontSize: 12, color: textSecondary, marginTop: 4, fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Команда */}
        <SectionLabel>{texts.teamLabel}</SectionLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {TEAM.map((m) => (
            <div key={m.name} style={{ background: cardBg, borderRadius: 20, padding: 20, display: "flex", gap: 16, alignItems: "center", border: `1px solid ${border}`, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
              <img src={m.photo} alt="" style={{ width: 80, height: 80, borderRadius: 40, border: "3px solid #A87935", objectFit: "cover" }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: 16 }}>{m.name}</div>
                <div style={{ fontSize: 12, color: "#A87935", fontWeight: 700, marginBottom: 4 }}>{m.role}</div>
                <div style={{ fontSize: 13, color: textSecondary, lineHeight: 1.5 }}>{m.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Контакты */}
        <SectionLabel>{texts.contactLabel}</SectionLabel>
        <div style={{ background: cardBg, borderRadius: 20, padding: 24, border: `1px solid ${border}`, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: "#999", marginBottom: 4 }}>ТЕЛЕФОН</div>
            <a href="tel:+77785600372" style={{ fontSize: 18, fontWeight: 700, color: textPrimary, textDecoration: "none" }}>+7 778 560 03 72</a>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: "#999", marginBottom: 4 }}>EMAIL</div>
            <div style={{ fontSize: 16, fontWeight: 600 }}>info@toi.kz</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: "#999", marginBottom: 4 }}>ОФИС</div>
            <div style={{ fontSize: 15, fontWeight: 500 }}>Астана, пр. Мәңгілік Ел, 55/20</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ children }) {
  return <div style={{ fontWeight: 900, fontSize: 11, color: "#A87935", letterSpacing: "0.1em", textTransform: "uppercase", margin: "32px 0 12px 4px" }}>{children}</div>;
}

function inputStyle(dark) {
  return {
    width: "100%", padding: "14px 16px", borderRadius: 12, border: `1px solid ${dark ? "#333" : "#EEE"}`,
    background: dark ? "#0F0F0F" : "#F9FAFB", color: "inherit", fontSize: 15, outline: "none", boxSizing: "border-box"
  };
}
