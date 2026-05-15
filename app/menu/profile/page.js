"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { ref, get, update } from "firebase/database";
import { useToast } from "@/components/Toast";
import { useLanguage } from "@/components/LanguageContext";

export default function ProfilePage() {
  const router = useRouter();
  const showToast = useToast();
  const { lang, changeLang } = useLanguage();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", surname: "", email: "" });
  const [userStats, setUserStats] = useState({ points: 100, events: 0 });
  const fileInputRef = useRef(null);

  const texts = {
    ru: { role: "Активный пользователь", edit: "Редактировать", save: "Сохранить", cancel: "Отмена", fav: "Избранные", payment: "Оплата", invite: "Пригласить друга", promo: "Акции", settings: "Настройки", logout: "Выйти" },
    kz: { role: "Белсенді пайдаланушы", edit: "Өңдеу", save: "Сақтау", cancel: "Болдырмау", fav: "Таңдаулы", payment: "Төлем", invite: "Досты шақыру", promo: "Акциялар", settings: "Баптаулар", logout: "Шығу" }
  }[lang] || texts.ru;

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        const snap = await get(ref(db, "Users/" + u.uid));
        if (snap.exists()) {
          const data = snap.val();
          setProfile(data);
          setEditForm({ name: data.name || "", surname: data.surname || "", email: data.email || "" });
          
          const bookingsSnap = await get(ref(db, "Bookings"));
          let userEvents = 0;
          if (bookingsSnap.exists()) {
            bookingsSnap.forEach(child => { if (child.val().userId === u.uid) userEvents++; });
          }
          setUserStats({ events: userEvents, points: userEvents * 150 + 100 });
        }
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

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
        setProfile({ ...profile, avatar: dataUrl });
        if (user) await update(ref(db, "Users/" + user.uid), { avatar: dataUrl });
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (user) {
      await update(ref(db, "Users/" + user.uid), { name: editForm.name, surname: editForm.surname, email: editForm.email });
      setProfile({ ...profile, name: editForm.name, surname: editForm.surname, email: editForm.email });
      setIsEditing(false);
      showToast("Сохранено");
    }
  };

  if (loading) return <div style={{ height: "100vh", background: "#FFF", display: "flex", alignItems: "center", justifyContent: "center" }}><span className="spinner" /></div>;

  return (
    <div style={{ background: "#FFFFFF", color: "#1A1A1A", minHeight: "100vh", paddingBottom: 100, fontFamily: "sans-serif" }}>
      
      {/* Top Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "calc(16px + env(safe-area-inset-top)) 24px 16px" }}>
        <button onClick={() => router.push("/menu/home")} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2D3748" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <button onClick={() => isEditing ? handleSaveProfile(new Event('submit')) : setIsEditing(true)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          {isEditing ? (
            <span style={{color: "#3182CE", fontWeight: 600}}>Save</span>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2D3748" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
          )}
        </button>
      </div>

      <div style={{ padding: "0 24px" }}>
        {/* Profile Info Row */}
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 24 }}>
          <div onClick={() => fileInputRef.current?.click()} style={{ width: 80, height: 80, borderRadius: 40, background: "#E2E8F0", overflow: "hidden", cursor: "pointer", flexShrink: 0, position: "relative" }}>
            {profile?.avatar ? <img src={profile.avatar} style={{width: "100%", height: "100%", objectFit: "cover"}} /> : <div style={{width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:32, color:"#A0AEC0", fontWeight:"bold"}}>{profile?.name?.[0] || "U"}</div>}
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(0,0,0,0.5)", height: 24, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
            </div>
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: "none" }} />
          
          <div style={{ flex: 1 }}>
            {isEditing ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <input value={editForm.name} onChange={e=>setEditForm({...editForm, name: e.target.value})} style={editInputStyle} placeholder="Имя" />
                <input value={editForm.surname} onChange={e=>setEditForm({...editForm, surname: e.target.value})} style={editInputStyle} placeholder="Фамилия" />
              </div>
            ) : (
              <>
                <div style={{ fontSize: 22, fontWeight: 700, color: "#2D3748" }}>{profile?.name} {profile?.surname}</div>
                <div style={{ fontSize: 13, color: "#718096", marginTop: 4 }}>{texts.role}</div>
              </>
            )}
          </div>
        </div>

        {/* Contact Info */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A0AEC0" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            <span style={{ fontSize: 14, color: "#718096" }}>{user?.phoneNumber || "+7 (---) --- -- --"}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A0AEC0" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            {isEditing ? (
              <input value={editForm.email} onChange={e=>setEditForm({...editForm, email: e.target.value})} style={{...editInputStyle, flex: 1}} placeholder="Email" />
            ) : (
              <span style={{ fontSize: 14, color: "#718096" }}>{profile?.email || "email не указан"}</span>
            )}
          </div>
        </div>

        {/* Stats Card */}
        <div style={{ display: "flex", background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 12, padding: "20px 0", boxShadow: "0 4px 6px rgba(0,0,0,0.02)", marginBottom: 32 }}>
          <div style={{ flex: 1, textAlign: "center", borderRight: "1px solid #E2E8F0" }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#2B6CB0", marginBottom: 4 }}>{userStats.points}</div>
            <div style={{ fontSize: 12, color: "#A0AEC0", fontWeight: 500 }}>Баллы</div>
          </div>
          <div style={{ flex: 1, textAlign: "center" }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#2D3748", marginBottom: 4 }}>{userStats.events}</div>
            <div style={{ fontSize: 12, color: "#A0AEC0", fontWeight: 500 }}>Тои</div>
          </div>
        </div>

        {/* Menu Items */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <MenuItem icon={<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>} text={texts.fav} />
          <MenuItem icon={<rect x="2" y="5" width="20" height="14" rx="2" ry="2"/><line x1="2" y1="10" x2="22" y2="10"/>} text={texts.payment} />
          <div onClick={() => changeLang(lang === "ru" ? "kz" : "ru")} style={{ background: "#F7FAFC", borderRadius: 12, padding: "16px", cursor: "pointer", display: "flex", alignItems: "center", gap: 16 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4299E1" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            <span style={{ fontSize: 15, fontWeight: 600, color: "#2D3748", flex: 1 }}>Язык / Тіл</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#3182CE", background: "#EBF8FF", padding: "4px 8px", borderRadius: 6 }}>{lang.toUpperCase()}</span>
          </div>
          <MenuItem icon={<path d="M21.21 15.89A10 10 0 1 1 8 2.83M22 12A10 10 0 0 0 12 2v10z"/>} text={texts.settings} />
        </div>

        {/* Logout */}
        <div style={{ marginTop: 40, borderTop: "1px solid #E2E8F0", paddingTop: 24 }}>
          <div onClick={() => signOut(auth).then(()=>router.replace("/"))} style={{ display: "flex", alignItems: "center", gap: 16, cursor: "pointer" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E53E3E" strokeWidth="2"><path d="M18.36 6.64a9 9 0 1 1-12.73 0M12 2v10"/></svg>
            <span style={{ fontSize: 15, fontWeight: 600, color: "#E53E3E" }}>{texts.logout}</span>
          </div>
        </div>

      </div>
    </div>
  );
}

function MenuItem({ icon, text }) {
  return (
    <div style={{ padding: "16px 0", display: "flex", alignItems: "center", gap: 16, cursor: "pointer", borderBottom: "1px solid transparent" }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4299E1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {icon}
      </svg>
      <span style={{ fontSize: 15, fontWeight: 600, color: "#2D3748" }}>{text}</span>
    </div>
  );
}

const editInputStyle = {
  border: "1px solid #E2E8F0", borderRadius: 8, padding: "8px 12px", fontSize: 14, outline: "none", color: "#2D3748", width: "100%"
};
