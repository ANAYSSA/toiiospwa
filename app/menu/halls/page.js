"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/Toast";
import { useLanguage } from "@/components/LanguageContext";

const REAL_HALLS = [
  { 
    name: "Palazzo Di Astana", 
    city: "Астана", 
    address: "ул. Сыганак, 38", 
    price: "от 15 000 ₸/чел", 
    capacity: "до 500 гостей", 
    rating: "4.9",
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800" 
  },
  { 
    name: "Бакшасарай", 
    city: "Алматы", 
    address: "ул. Тимирязева, 42", 
    price: "от 18 000 ₸/чел", 
    capacity: "до 700 гостей", 
    rating: "5.0",
    image: "https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&q=80&w=800" 
  },
  { 
    name: "Aura Palace", 
    city: "Шымкент", 
    address: "пр. Тауке хана, 15", 
    price: "от 10 000 ₸/чел", 
    capacity: "до 400 гостей", 
    rating: "4.8",
    image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=800" 
  },
  { 
    name: "Versailles Almaty", 
    city: "Алматы", 
    address: "пр. Достык, 132", 
    price: "от 20 000 ₸/чел", 
    capacity: "до 450 гостей", 
    rating: "4.9",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800" 
  },
  { 
    name: "Wyndham Garden", 
    city: "Астана", 
    address: "ул. Хусейн бен Талал, 25", 
    price: "от 22 000 ₸/чел", 
    capacity: "до 800 гостей", 
    rating: "5.0",
    image: "https://images.unsplash.com/photo-1544145945-f904253db0ad?auto=format&fit=crop&q=80&w=800" 
  },
  { 
    name: "Grand Narlen", 
    city: "Шымкент", 
    address: "ул. Байтурсынова, 20", 
    price: "от 12 000 ₸/чел", 
    capacity: "до 500 гостей", 
    rating: "4.7",
    image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=800" 
  },
];

export default function HallsPage() {
  const router = useRouter();
  const showToast = useToast();
  const { lang } = useLanguage();
  const [darkTheme, setDarkTheme] = useState(false);
  const [filter, setFilter] = useState("Все");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("theme");
      if (saved === "dark") setDarkTheme(true);
    } catch (e) {}
  }, []);

  const bg = darkTheme ? "#0A0A0A" : "#F8F9FA";
  const cardBg = darkTheme ? "#141414" : "#FFFFFF";
  const textPrimary = darkTheme ? "#FFFBEB" : "#1A1A1A";
  const textSecondary = darkTheme ? "#888" : "#666";
  const border = darkTheme ? "#222" : "#EEE";

  const cities = ["Все", ...new Set(REAL_HALLS.map((h) => h.city))];
  const filtered = filter === "Все" ? REAL_HALLS : REAL_HALLS.filter((h) => h.city === filter);

  return (
    <div style={{ 
      background: bg, 
      backgroundImage: darkTheme ? "url('https://www.transparenttextures.com/patterns/dark-matter.png')" : "url('https://www.transparenttextures.com/patterns/linen.png')",
      color: textPrimary, 
      minHeight: "100vh" 
    }}>
      {/* Header */}
      <div style={{
        background: darkTheme ? "rgba(20,20,20,0.8)" : "rgba(255,255,255,0.8)",
        backdropFilter: "blur(10px)",
        paddingTop: "calc(16px + env(safe-area-inset-top))",
        paddingBottom: 12,
        paddingLeft: 20, paddingRight: 20,
        position: "sticky", top: 0, zIndex: 10,
        borderBottom: `1px solid ${border}`,
      }}>
        <div style={{ fontSize: 20, fontWeight: 800, textAlign: "center", marginBottom: 12 }}>Лучшие залы</div>
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
          {cities.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              style={{
                padding: "8px 16px", borderRadius: 12, border: "none",
                fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap",
                background: filter === c ? "#A87935" : (darkTheme ? "#222" : "#F1F3F4"),
                color: filter === c ? "white" : textPrimary,
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: "16px 16px 40px" }}>
        {filtered.map((hall, idx) => (
          <div
            key={idx}
            onClick={() => showToast("Детали зала скоро будут доступны")}
            style={{
              background: cardBg, borderRadius: 24, marginBottom: 20, overflow: "hidden",
              boxShadow: "0 10px 30px rgba(0,0,0,0.1)", cursor: "pointer", border: `1px solid ${border}`
            }}
          >
            <div style={{ height: 200, position: "relative" }}>
              <img src={hall.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", top: 12, right: 12, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", borderRadius: 10, padding: "6px 12px", color: "white", fontSize: 13, fontWeight: 800, display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ color: "#FFD700" }}>★</span> {hall.rating}
              </div>
              <div style={{ position: "absolute", bottom: 12, left: 12, background: "rgba(168,121,53,0.9)", borderRadius: 8, padding: "4px 10px", color: "white", fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>
                {hall.city}
              </div>
            </div>

            <div style={{ padding: 20 }}>
              <div style={{ fontSize: 19, fontWeight: 800, marginBottom: 4 }}>{hall.name}</div>
              <div style={{ fontSize: 13, color: textSecondary, display: "flex", alignItems: "center", gap: 6 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                {hall.address}
              </div>

              <div style={{ height: 1, background: border, margin: "16px 0" }} />

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 11, color: "#A87935", fontWeight: 700, textTransform: "uppercase" }}>Цена за человека</div>
                  <div style={{ fontSize: 16, fontWeight: 800, marginTop: 2 }}>{hall.price}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 11, color: textSecondary, fontWeight: 600 }}>Вместимость</div>
                  <div style={{ fontSize: 14, fontWeight: 700, marginTop: 2 }}>{hall.capacity}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
