"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { ref, get } from "firebase/database";
import { useToast } from "@/components/Toast";

const KZ_CITIES = [
  "Алматы", "Астана", "Шымкент", "Актобе", "Караганда",
  "Тараз", "Павлодар", "Усть-Каменогорск", "Семей", "Атырау",
  "Костанай", "Кызылорда", "Уральск", "Петропавловск", "Актау", "Туркестан",
];

export default function ProfilePage() {
  const router = useRouter();
  const showToast = useToast();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [city, setCity] = useState("");
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [darkTheme, setDarkTheme] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("theme");
      if (saved === "dark") {
        setDarkTheme(true);
        document.documentElement.classList.add("dark");
      }
      const savedCity = localStorage.getItem("userCity");
      if (savedCity) setCity(savedCity);
    } catch (e) {}

    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        try {
          const snap = await get(ref(db, "Users/" + u.uid));
          if (snap.exists()) setProfile(snap.val());
        } catch (e) {
          console.log("Could not fetch user profile:", e);
        }
      }
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

  const handleSelectCity = (c) => {
    setCity(c);
    try { localStorage.setItem("userCity", c); } catch (e) {}
    setShowCityPicker(false);
    showToast("Город изменен на: " + c);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/");
    } catch (err) {
      showToast("Ошибка выхода: " + err.message);
    }
  };

  const displayName = profile
    ? `${profile.name || ""} ${profile.surname || ""}`.trim() || "Пользователь ToiKz"
    : "Пользователь ToiKz";
  const phoneStr = profile?.phoneNumber
    ? "+" + String(profile.phoneNumber)
    : user?.email || "+7 (7XX) XXX-XX-XX";

  return (
    <div style={{
      minHeight: "100dvh",
      background: darkTheme ? "#0F0F0F" : "#F8F9FA",
      color: darkTheme ? "#FFFBEB" : "#1A1A1A",
      paddingBottom: "calc(100px + env(safe-area-inset-bottom))",
    }}>
      {/* Gradient header — covers the notch */}
      <div className="profile-header" style={{ position: "relative" }}>
        <div style={{
          position: "absolute",
          top: "calc(env(safe-area-inset-top) + 20px)",
          left: 0, right: 0,
          textAlign: "center",
          color: "white", fontSize: 20, fontWeight: 700,
        }}>
          ToiKz Profile
        </div>
      </div>

      <div style={{
        margin: "0 max(20px, env(safe-area-inset-left)) 0 max(20px, env(safe-area-inset-right))",
        marginTop: -80,
        background: darkTheme ? "#1A1A1A" : "white",
        borderRadius: 20,
        boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
        padding: 20,
        position: "relative",
      }}>
        <div style={{ display: "flex", gap: 15 }}>
          <div style={{
            width: 90, height: 90,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #A87935, #800020)",
            border: "2px solid #FFD700",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "white", fontSize: 36, fontWeight: 700, flexShrink: 0,
            overflow: "hidden",
          }}>
            <img src="/icons/logo.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div style={{ flex: 1, paddingTop: 10, minWidth: 0 }}>
            <div style={{ fontSize: 18, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{displayName}</div>
            <div style={{ color: "#4CAF50", fontSize: 13, marginTop: 4 }}>Верифицированный клиент</div>
          </div>
        </div>

        <div style={{ height: 1, background: darkTheme ? "#333" : "#1F000000", margin: "20px 0 15px" }} />

        <div style={{ color: darkTheme ? "#AAA" : "#666", fontSize: 14, display: "flex", alignItems: "center", gap: 10, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          <span style={{ color: "#FFD700" }}>📞</span>
          <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{phoneStr}</span>
        </div>

        <div
          onClick={() => setShowCityPicker(true)}
          style={{ color: darkTheme ? "#AAA" : "#666", fontSize: 14, marginTop: 12, padding: 4, display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
        >
          <span style={{ color: "#FFD700" }}>📍</span>
          <span>{city || "Выберите город"}</span>
        </div>
      </div>

      <div style={{ marginTop: 25, paddingLeft: "max(25px, calc(env(safe-area-inset-left) + 5px))", paddingRight: "max(25px, calc(env(safe-area-inset-right) + 5px))", color: "#888", fontWeight: 700, fontSize: 13 }}>Настройки</div>

      <div style={{
        margin: "10px max(20px, env(safe-area-inset-left)) 0 max(20px, env(safe-area-inset-right))",
        background: darkTheme ? "#1A1A1A" : "white",
        borderRadius: 15,
        padding: 10,
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      }}>
        <div style={{ display: "flex", alignItems: "center", padding: "12px", height: 55 }}>
          <span style={{ color: "#FFD700", fontSize: 20, marginRight: 12 }}>☀️</span>
          <span style={{ flex: 1 }}>Темная тема</span>
          <label className="switch">
            <input type="checkbox" checked={darkTheme} onChange={toggleTheme} />
            <span className="slider" />
          </label>
        </div>
        <div style={{ height: 1, background: darkTheme ? "#333" : "#1F000000" }} />

        <button
          onClick={() => setShowCityPicker(true)}
          style={{
            display: "flex", alignItems: "center", width: "100%",
            background: "transparent", border: "none", padding: "0 12px",
            height: 55, color: "inherit", fontSize: 14, cursor: "pointer", textAlign: "left",
          }}
        >
          <span style={{ color: "#FFD700", fontSize: 20, marginRight: 12 }}>✎</span>
          <span>Редактировать город</span>
        </button>

        <button
          onClick={() => showToast("Тілді таңдау (KZ / RU) — скоро")}
          style={{
            display: "flex", alignItems: "center", width: "100%",
            background: "transparent", border: "none", padding: "0 12px",
            height: 55, color: "inherit", fontSize: 14, cursor: "pointer", textAlign: "left",
          }}
        >
          <span style={{ color: "#FFD700", fontSize: 20, marginRight: 12 }}>🌐</span>
          <span>Тілді таңдау (KZ/RU)</span>
        </button>

        <button
          onClick={handleLogout}
          style={{
            display: "flex", alignItems: "center", width: "100%",
            background: "transparent", border: "none", padding: "0 12px",
            height: 55, color: "#F44336", fontSize: 14, cursor: "pointer", textAlign: "left",
          }}
        >
          <span style={{ fontSize: 20, marginRight: 12 }}>⏻</span>
          <span>Выйти</span>
        </button>
      </div>

      {showCityPicker && (
        <div className="modal-overlay" onClick={() => setShowCityPicker(false)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 18 }}>Выберите ваш город</div>
            {KZ_CITIES.map((c) => (
              <div key={c} className="modal-item" onClick={() => handleSelectCity(c)}>{c}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
