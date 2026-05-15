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
    save: "Сохранить",
    cancel: "Отмена",
    settings: "НАСТРОЙКИ",
    darkTheme: "Тёмная тема",
    language: "Язык (RU / KZ)",
    support: "ПОДДЕРЖКА",
    help: "Помощь и FAQ",
    about: "О приложении",
    logout: "Выйти из аккаунта",
    myEvents: "МОИ МЕРОПРИЯТИЯ",
    noEvents: "У вас пока нет активных бронирований",
    stats: "СТАТИСТИКА",
    saved: "Сохранено"
  },
  kz: {
    title: "Менің профилім",
    active: "Белсенді пайдаланушы",
    editProfile: "Өңдеу",
    save: "Сақтау",
    cancel: "Болдырмау",
    settings: "ПАРАМЕТРЛЕР",
    darkTheme: "Қараңғы тақырып",
    language: "Тіл (RU / KZ)",
    support: "ҚОЛДАУ",
    help: "Көмек және FAQ",
    about: "Қосымша туралы",
    logout: "Аккаунттан шығу",
    myEvents: "МЕНІҢ ІС-ШАРАЛАРЫМ",
    noEvents: "Сізде әзірге белсенді брондаулар жоқ",
    stats: "СТАТИСТИКА",
    saved: "Сақталды"
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
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", surname: "" });
  const [userStats, setUserStats] = useState({ points: 0, events: 0 });
  const fileInputRef = useRef(null);

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
        if (snap.exists()) {
          const data = snap.val();
          setProfile(data);
          setEditForm({ name: data.name || "", surname: data.surname || "" });
          // Fetch real stats (mocking points logic based on events)
          const bookingsSnap = await get(ref(db, "Bookings"));
          let userEvents = 0;
          if (bookingsSnap.exists()) {
            bookingsSnap.forEach(child => {
              if (child.val().userId === u.uid) userEvents++;
            });
          }
          setUserStats({ events: userEvents, points: userEvents * 150 + 100 }); // Base 100 points
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
      localStorage.setItem("theme", newVal ? "dark" : "light");
      if (newVal) document.documentElement.classList.add("dark");
      else document.documentElement.classList.remove("dark");
    } catch (e) {}
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const img = new Image();
      img.onload = async () => {
        const size = 256;
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        const minSide = Math.min(img.width, img.height);
        const sx = (img.width - minSide) / 2;
        const sy = (img.height - minSide) / 2;
        ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, size, size);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
        
        // Save to state and DB
        setProfile({ ...profile, avatar: dataUrl });
        if (user) {
          try {
            await update(ref(db, "Users/" + user.uid), { avatar: dataUrl });
            showToast(texts.saved);
          } catch(err) { console.error(err); }
        }
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async () => {
    if (user) {
      try {
        await update(ref(db, "Users/" + user.uid), { name: editForm.name, surname: editForm.surname });
        setProfile({ ...profile, name: editForm.name, surname: editForm.surname });
        setIsEditing(false);
        showToast(texts.saved);
      } catch(err) { console.error(err); }
    }
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
           <div 
             onClick={() => fileInputRef.current?.click()}
             style={{ width: 100, height: 100, borderRadius: 50, border: "4px solid " + bg, background: "#A87935", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, fontWeight: 900, color: "white", boxShadow: "0 10px 20px rgba(0,0,0,0.2)", overflow: "hidden", cursor: "pointer" }}
           >
             {profile?.avatar ? <img src={profile.avatar} alt="avatar" style={{width: "100%", height: "100%", objectFit: "cover"}} /> : (profile?.name?.[0] || "U")}
           </div>
           <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: "none" }} />
           
           <div style={{ paddingBottom: 10 }}>
              {isEditing ? (
                <div style={{ display: "flex", gap: 8, flexDirection: "column" }}>
                  <input value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} style={{ padding: "4px 8px", borderRadius: 8, border: "1px solid #A87935", background: darkTheme?"#222":"#FFF", color: textColor, width: 140 }} placeholder="Имя" />
                  <input value={editForm.surname} onChange={e => setEditForm({...editForm, surname: e.target.value})} style={{ padding: "4px 8px", borderRadius: 8, border: "1px solid #A87935", background: darkTheme?"#222":"#FFF", color: textColor, width: 140 }} placeholder="Фамилия" />
                </div>
              ) : (
                <>
                  <div style={{ fontSize: 22, fontWeight: 900, color: textColor }}>{profile?.name || "Пользователь"} {profile?.surname}</div>
                  <div style={{ fontSize: 13, color: darkTheme ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)", fontWeight: 500 }}>{texts.active}</div>
                </>
              )}
           </div>
        </div>
        
        <div style={{ position: "absolute", bottom: -40, right: 20 }}>
          {isEditing ? (
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setIsEditing(false)} style={{ background: "transparent", color: textSecondary(darkTheme), border: "none", fontWeight: 600 }}>{texts.cancel}</button>
              <button onClick={handleSaveProfile} style={{ background: "#A87935", color: "white", border: "none", padding: "6px 12px", borderRadius: 8, fontWeight: 700 }}>{texts.save}</button>
            </div>
          ) : (
            <button onClick={() => setIsEditing(true)} style={{ background: "transparent", color: "#A87935", border: "1px solid #A87935", padding: "6px 12px", borderRadius: 8, fontWeight: 700 }}>{texts.editProfile}</button>
          )}
        </div>
      </div>

      <div style={{ marginTop: 70, padding: "0 20px" }}>
        
        <SectionTitle>{texts.stats}</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
           <StatCard label="Баллы" value={userStats.points} dark={darkTheme} cardBg={cardBg} border={border} />
           <StatCard label="Тои" value={userStats.events} dark={darkTheme} cardBg={cardBg} border={border} />
        </div>

        <SectionTitle>{texts.myEvents}</SectionTitle>
        <div style={{ background: cardBg, borderRadius: 20, padding: 30, textAlign: "center", border: `1px solid ${border}`, color: textSecondary(darkTheme), fontSize: 14 }}>
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
                <button onClick={() => changeLang("ru")} style={{ padding: "6px 12px", borderRadius: 8, background: lang === "ru" ? "#A87935" : "transparent", color: lang === "ru" ? "white" : textSecondary(darkTheme), border: "none", fontWeight: 700 }}>RU</button>
                <button onClick={() => changeLang("kz")} style={{ padding: "6px 12px", borderRadius: 8, background: lang === "kz" ? "#A87935" : "transparent", color: lang === "kz" ? "white" : textSecondary(darkTheme), border: "none", fontWeight: 700 }}>KZ</button>
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
       <div style={{ fontSize: 11, color: textSecondary(dark), textTransform: "uppercase", marginTop: 4 }}>{label}</div>
    </div>
  );
}

function textSecondary(dark) {
  return dark ? "#888" : "#666";
}
