"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { signOut, onAuthStateChanged, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { ref, get, update } from "firebase/database";
import { useToast } from "@/components/Toast";
import { useLanguage } from "@/components/LanguageContext";

const KZ_CITIES = [
  "Алматы", "Астана", "Шымкент", "Актобе", "Караганда",
  "Тараз", "Павлодар", "Усть-Каменогорск", "Семей", "Атырау",
  "Костанай", "Кызылорда", "Уральск", "Петропавловск", "Актау", "Туркестан",
];

const T = {
  ru: {
    title: "Мой профиль",
    active: "Активный",
    removePhoto: "Удалить фото",
    email: "Email",
    phone: "Телефон",
    city: "Город",
    notSelected: "Не выбран",
    editProfile: "✎ Редактировать профиль",
    settings: "Настройки",
    darkTheme: "Тёмная тема",
    changeCity: "Изменить город",
    changePassword: "Сменить пароль",
    language: "Язык (RU / KZ)",
    support: "Поддержка",
    help: "Помощь",
    about: "О приложении",
    logout: "Выйти",
    logoutConfirm: "Выйти из аккаунта?",
    saved: "Сохранено",
    error: "Ошибка",
  },
  kz: {
    title: "Менің профилім",
    active: "Белсенді",
    removePhoto: "Суретті жою",
    email: "Email",
    phone: "Телефон",
    city: "Қала",
    notSelected: "Таңдалмаған",
    editProfile: "✎ Профильді өңдеу",
    settings: "Параметрлер",
    darkTheme: "Қараңғы тақырып",
    changeCity: "Қаланы өзгерту",
    changePassword: "Құпия сөзді өзгерту",
    language: "Тіл (RU / KZ)",
    support: "Қолдау",
    help: "Көмек",
    about: "Қосымша туралы",
    logout: "Шығу",
    logoutConfirm: "Аккаунттан шығасыз ба?",
    saved: "Сақталды",
    error: "Қате",
  }
};

export default function ProfilePage() {
  const router = useRouter();
  const showToast = useToast();
  const { lang, changeLang } = useLanguage();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState("");
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showAboutApp, setShowAboutApp] = useState(false);
  const [darkTheme, setDarkTheme] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const fileInputRef = useRef(null);

  const texts = T[lang] || T.ru;

  useEffect(() => {
    try {
      const saved = localStorage.getItem("theme");
      if (saved === "dark") {
        setDarkTheme(true);
        document.documentElement.classList.add("dark");
      }
      const savedCity = localStorage.getItem("userCity");
      if (savedCity) setCity(savedCity);
      const savedAvatar = localStorage.getItem("userAvatar");
      if (savedAvatar) setAvatar(savedAvatar);
    } catch (e) {}

    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        try {
          const snap = await get(ref(db, "Users/" + u.uid));
          if (snap.exists()) {
            const data = snap.val();
            setProfile(data);
            if (data.city && !city) {
              setCity(data.city);
              try { localStorage.setItem("userCity", data.city); } catch (e) {}
            }
          }
        } catch (e) {
          console.log("Could not fetch user profile:", e);
        }
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const toggleTheme = () => {
    const newVal = !darkTheme;
    setDarkTheme(newVal);
    try {
      if (newVal) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
    } catch (e) {}
  };

  const handleSelectCity = async (c) => {
    setCity(c);
    try { localStorage.setItem("userCity", c); } catch (e) {}
    setShowCityPicker(false);
    showToast(texts.saved + ": " + c);
    if (user) {
      try {
        await update(ref(db, "Users/" + user.uid), { city: c });
      } catch (e) {}
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const size = 256;
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        const minSide = Math.min(img.width, img.height);
        const sx = (img.width - minSide) / 2;
        const sy = (img.height - minSide) / 2;
        ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, size, size);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
        setAvatar(dataUrl);
        try {
          localStorage.setItem("userAvatar", dataUrl);
          showToast(texts.saved);
        } catch (err) {}
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setAvatar(null);
    try { localStorage.removeItem("userAvatar"); } catch (e) {}
    showToast(texts.saved);
  };

  const handleLogout = async () => {
    if (!confirm(texts.logoutConfirm)) return;
    try {
      await signOut(auth);
      router.replace("/");
    } catch (err) {
      showToast(texts.error + ": " + err.message);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <span className="spinner" style={{ width: 30, height: 30, borderWidth: 3 }} />
      </div>
    );
  }

  const displayName = profile
    ? `${profile.name || ""} ${profile.surname || ""}`.trim() || "User"
    : "User";
  const phoneStr = profile?.phoneNumber ? "+" + profile.phoneNumber : "—";
  const emailStr = profile?.email || user?.email || "—";
  const initials = ((profile?.name?.[0] || "") + (profile?.surname?.[0] || "")).toUpperCase() || "✦";

  const bg = darkTheme ? "#0A0A0A" : "#F8F9FA";
  const cardBg = darkTheme ? "#141414" : "white";
  const textColor = darkTheme ? "#FFFBEB" : "#1A1A1A";
  const dividerColor = darkTheme ? "#222" : "rgba(0,0,0,0.06)";

  return (
    <div style={{ 
      background: bg, 
      backgroundImage: darkTheme ? "url('https://www.transparenttextures.com/patterns/dark-matter.png')" : "url('https://www.transparenttextures.com/patterns/linen.png')",
      color: textColor, 
      minHeight: "100vh",
      paddingBottom: "calc(120px + env(safe-area-inset-bottom))" 
    }}>
      <div className="profile-header">
        <div style={{ position: "absolute", top: "calc(env(safe-area-inset-top) + 20px)", left: 0, right: 0, textAlign: "center", color: "white", fontSize: 20, fontWeight: 700 }}>
          {texts.title}
        </div>
      </div>

      <div style={{ margin: "0 20px", marginTop: -80, background: cardBg, borderRadius: 20, boxShadow: "0 8px 24px rgba(0,0,0,0.15)", padding: 20, position: "relative", border: `1px solid ${dividerColor}` }}>
        <div style={{ display: "flex", gap: 15, alignItems: "flex-start" }}>
          <div style={{ position: "relative" }}>
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{ width: 90, height: 90, borderRadius: "50%", background: avatar ? "transparent" : "linear-gradient(135deg, #A87935, #800020)", border: "3px solid #FFD700", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 32, fontWeight: 700, overflow: "hidden", cursor: "pointer" }}
            >
              {avatar ? <img src={avatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span>{initials}</span>}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: "none" }} />
          </div>
          <div style={{ flex: 1, paddingTop: 8 }}>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{displayName}</div>
            <div style={{ color: "#4CAF50", fontSize: 12, marginTop: 4 }}>● {texts.active}</div>
            {avatar && <button onClick={handleRemoveAvatar} style={{ marginTop: 6, background: "transparent", border: "none", color: "#F44336", fontSize: 11 }}>{texts.removePhoto}</button>}
          </div>
        </div>
        <div style={{ height: 1, background: dividerColor, margin: "16px 0" }} />
        <InfoRow icon="✉️" label={texts.email} value={emailStr} dark={darkTheme} />
        <InfoRow icon="📞" label={texts.phone} value={phoneStr} dark={darkTheme} />
        <InfoRow icon="📍" label={texts.city} value={city || texts.notSelected} dark={darkTheme} onClick={() => setShowCityPicker(true)} />
        <button onClick={() => setShowEdit(true)} style={{ marginTop: 16, width: "100%", background: "rgba(168, 121, 53, 0.12)", color: "#A87935", border: "1px solid #A87935", borderRadius: 12, padding: "12px", fontWeight: 600, fontSize: 14 }}>{texts.editProfile}</button>
      </div>

      <SectionTitle>{texts.settings}</SectionTitle>
      <SettingsBlock dark={darkTheme} cardBg={cardBg} divider={dividerColor}>
        <div style={{ display: "flex", alignItems: "center", padding: "12px", height: 55 }}>
          <span style={{ color: "#FFD700", fontSize: 20, marginRight: 12 }}>🌙</span>
          <span style={{ flex: 1 }}>{texts.darkTheme}</span>
          <label className="switch">
            <input type="checkbox" checked={darkTheme} onChange={toggleTheme} />
            <span className="slider" />
          </label>
        </div>
        <DividerRow color={dividerColor} />
        <div style={{ display: "flex", alignItems: "center", padding: "12px", height: 55 }}>
          <span style={{ color: "#FFD700", fontSize: 20, marginRight: 12 }}>🌐</span>
          <span style={{ flex: 1 }}>{texts.language}</span>
          <div style={{ display: "flex", gap: 4 }}>
            <button onClick={() => changeLang("ru")} style={{ padding: "4px 8px", borderRadius: 6, background: lang === "ru" ? "#A87935" : "transparent", color: lang === "ru" ? "white" : "#888", border: "none" }}>RU</button>
            <button onClick={() => changeLang("kz")} style={{ padding: "4px 8px", borderRadius: 6, background: lang === "kz" ? "#A87935" : "transparent", color: lang === "kz" ? "white" : "#888", border: "none" }}>KZ</button>
          </div>
        </div>
        <DividerRow color={dividerColor} />
        <SettingsRow icon="🔒" label={texts.changePassword} onClick={() => setShowPassword(true)} />
      </SettingsBlock>

      <SectionTitle>{texts.support}</SectionTitle>
      <SettingsBlock dark={darkTheme} cardBg={cardBg} divider={dividerColor}>
        <SettingsRow icon="❓" label={texts.help} onClick={() => showToast(texts.help + "...")} />
        <DividerRow color={dividerColor} />
        <SettingsRow icon="ℹ️" label={texts.about} onClick={() => setShowAboutApp(true)} />
        <DividerRow color={dividerColor} />
        <SettingsRow icon="⏻" label={texts.logout} onClick={handleLogout} danger />
      </SettingsBlock>
    </div>
  );
}

function InfoRow({ icon, label, value, dark, onClick }) {
  return (
    <div onClick={onClick} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", cursor: onClick ? "pointer" : "default" }}>
      <span style={{ fontSize: 18, width: 28 }}>{icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 11, color: dark ? "#888" : "#999" }}>{label}</div>
        <div style={{ fontSize: 14, fontWeight: 500 }}>{value}</div>
      </div>
      {onClick && <span style={{ color: "#888" }}>›</span>}
    </div>
  );
}

function SectionTitle({ children }) {
  return <div style={{ marginTop: 25, paddingLeft: 25, color: "#888", fontWeight: 700, fontSize: 12, textTransform: "uppercase" }}>{children}</div>;
}

function SettingsBlock({ children, dark, cardBg, divider }) {
  return <div style={{ margin: "10px 20px 0", background: cardBg, borderRadius: 15, padding: 10, border: `1px solid ${divider}` }}>{children}</div>;
}

function SettingsRow({ icon, label, onClick, danger }) {
  return (
    <button onClick={onClick} style={{ display: "flex", alignItems: "center", width: "100%", background: "transparent", border: "none", padding: "0 12px", height: 55, color: danger ? "#F44336" : "inherit" }}>
      <span style={{ color: danger ? "#F44336" : "#FFD700", fontSize: 20, marginRight: 12 }}>{icon}</span>
      <span style={{ flex: 1, textAlign: "left" }}>{label}</span>
      <span style={{ color: "#888" }}>›</span>
    </button>
  );
}

function DividerRow({ color }) {
  return <div style={{ height: 1, background: color }} />;
}
