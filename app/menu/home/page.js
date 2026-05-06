"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { ref, get } from "firebase/database";

export default function HomePage() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        try {
          const snap = await get(ref(db, "Users/" + u.uid));
          if (snap.exists()) setProfile(snap.val());
        } catch (e) {
          console.log("Could not fetch user profile:", e);
        }
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const greeting = getGreeting();
  const userName = profile?.name || "";

  return (
    <div className="booking-page">
      <div style={{
        paddingTop: "calc(20px + env(safe-area-inset-top))",
        paddingLeft: "max(20px, env(safe-area-inset-left))",
        paddingRight: "max(20px, env(safe-area-inset-right))",
        paddingBottom: 20,
      }}>
        {/* Header with logo + greeting */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <img src="/icons/logo.png" alt="" style={{ width: 48, height: 48, borderRadius: 11 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, color: "#888" }}>{greeting},</div>
            <div style={{ fontSize: 22, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {loading ? "..." : userName ? userName + "!" : "Добро пожаловать!"}
            </div>
          </div>
        </div>

        {/* Hero card */}
        <div className="section-card" style={{
          background: "linear-gradient(135deg, #800020 0%, #A87935 100%)",
          color: "#FFFBEB",
          padding: 24,
        }}>
          <div style={{ fontSize: 12, letterSpacing: "0.2em", opacity: 0.8, marginBottom: 8 }}>
            ✦ ТОЙХАНА
          </div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 500, lineHeight: 1.2, marginBottom: 8 }}>
            Сделаем ваш той незабываемым
          </div>
          <div style={{ fontSize: 14, opacity: 0.9, marginBottom: 16 }}>
            Залы, тамада, музыканты и шоу — всё в одном месте
          </div>
          <button
            onClick={() => router.push("/menu/booking")}
            style={{
              background: "#FFFBEB",
              color: "#800020",
              border: "none",
              borderRadius: 10,
              padding: "12px 22px",
              fontWeight: 700,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            Начать поиск →
          </button>
        </div>

        {/* Quick actions */}
        <div style={{ fontWeight: 700, fontSize: 13, color: "#888", letterSpacing: "0.05em", margin: "20px 4px 12px" }}>
          БЫСТРЫЕ ДЕЙСТВИЯ
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 8 }}>
          <QuickAction icon="📝" label="Бронирование" sub="Найти зал и услуги" onClick={() => router.push("/menu/booking")} />
          <QuickAction icon="🏛️" label="Залы" sub="Все площадки" onClick={() => router.push("/menu/halls")} />
          <QuickAction icon="🎤" label="Тамада" sub="Ведущие" onClick={() => goWith(router, "tamada")} />
          <QuickAction icon="🎵" label="Артисты" sub="Музыканты, танцы" onClick={() => goWith(router, "singer")} />
        </div>

        {/* Features */}
        <div style={{ fontWeight: 700, fontSize: 13, color: "#888", letterSpacing: "0.05em", margin: "20px 4px 12px" }}>
          ВОЗМОЖНОСТИ
        </div>

        <div className="section-card">
          <Feature emoji="📍" title="Поиск по городам" text="Алматы, Астана, Шымкент, Караганда и другие" />
          <Divider />
          <Feature emoji="🎉" title="Любой формат" text="Той, свадьба, қыз ұзату, мерейтой" />
          <Divider />
          <Feature emoji="📅" title="На любую дату" text="Удобный календарь и моментальная проверка" />
          <Divider />
          <Feature emoji="✨" title="Полный пакет" text="Зал, тамада, певцы и танцевальные шоу" last />
        </div>
      </div>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 6) return "Доброй ночи";
  if (h < 12) return "Доброе утро";
  if (h < 18) return "Добрый день";
  return "Добрый вечер";
}

function goWith(router, key) {
  const params = new URLSearchParams({ city: "Алматы", eventType: "Той", date: "", [key]: "1" });
  router.push("/menu/booking");
}

function QuickAction({ icon, label, sub, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "white",
        border: "none",
        borderRadius: 14,
        padding: 14,
        textAlign: "left",
        cursor: "pointer",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}
      className="quick-action"
    >
      <div style={{ fontSize: 26 }}>{icon}</div>
      <div style={{ fontWeight: 700, fontSize: 14, color: "#1A1A1A" }}>{label}</div>
      <div style={{ fontSize: 11, color: "#888" }}>{sub}</div>
    </button>
  );
}

function Feature({ emoji, title, text, last }) {
  return (
    <div style={{ display: "flex", gap: 12, padding: "10px 0", alignItems: "flex-start" }}>
      <div style={{ fontSize: 22, lineHeight: 1, marginTop: 2 }}>{emoji}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, fontSize: 14 }}>{title}</div>
        <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{text}</div>
      </div>
    </div>
  );
}

function Divider() {
  return <div style={{ height: 1, background: "rgba(0,0,0,0.06)" }} />;
}
