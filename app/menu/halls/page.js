"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/Toast";

const SAMPLE_HALLS = [
  { name: "Bishkek Park", city: "Алматы", address: "ул. Розыбакиева, 247", price: "от 12 000 ₸/чел", capacity: "до 400 гостей", rating: "4.8" },
  { name: "Royal Ballroom", city: "Астана", address: "пр. Кабанбай батыра, 11", price: "от 18 000 ₸/чел", capacity: "до 600 гостей", rating: "4.9" },
  { name: "Khan Shatyr Hall", city: "Астана", address: "ул. Туран, 37", price: "от 22 000 ₸/чел", capacity: "до 800 гостей", rating: "5.0" },
  { name: "Almaty Towers", city: "Алматы", address: "пр. Достык, 280", price: "от 14 000 ₸/чел", capacity: "до 350 гостей", rating: "4.7" },
  { name: "Shymkent Plaza", city: "Шымкент", address: "пр. Тауке хана, 4", price: "от 9 000 ₸/чел", capacity: "до 500 гостей", rating: "4.6" },
  { name: "Samal Deluxe", city: "Караганда", address: "ул. Бухар-Жырау, 56", price: "от 8 000 ₸/чел", capacity: "до 300 гостей", rating: "4.5" },
];

export default function HallsPage() {
  const router = useRouter();
  const showToast = useToast();
  const [darkTheme, setDarkTheme] = useState(false);
  const [filter, setFilter] = useState("Все");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("theme");
      if (saved === "dark") setDarkTheme(true);
    } catch (e) {}
  }, []);

  const bg = darkTheme ? "#0F0F0F" : "#F8F9FA";
  const cardBg = darkTheme ? "#1A1A1A" : "#FFFFFF";
  const textPrimary = darkTheme ? "#FFFBEB" : "#1A1A1A";
  const textSecondary = darkTheme ? "#888" : "#666";
  const divider = darkTheme ? "#2A2A2A" : "rgba(0,0,0,0.08)";

  const cities = ["Все", ...new Set(SAMPLE_HALLS.map((h) => h.city))];
  const filtered = filter === "Все" ? SAMPLE_HALLS : SAMPLE_HALLS.filter((h) => h.city === filter);

  return (
    <div style={{ background: bg, color: textPrimary, minHeight: "100vh" }}>
      {/* Toolbar */}
      <div style={{
        background: darkTheme ? "#1A1A1A" : "#FFFFFF",
        paddingTop: "calc(16px + env(safe-area-inset-top))",
        paddingBottom: 12,
        paddingLeft: "max(20px, env(safe-area-inset-left))",
        paddingRight: "max(20px, env(safe-area-inset-right))",
        position: "sticky",
        top: 0,
        zIndex: 10,
        borderBottom: `1px solid ${divider}`,
      }}>
        <div style={{ fontSize: 20, fontWeight: 700, textAlign: "center", marginBottom: 12 }}>
          Все залы
        </div>
        {/* City filter pills */}
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
          {cities.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              style={{
                padding: "6px 14px",
                borderRadius: 20,
                border: "none",
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
                whiteSpace: "nowrap",
                flexShrink: 0,
                background: filter === c
                  ? "linear-gradient(135deg, #A87935, #800020)"
                  : (darkTheme ? "#2A2A2A" : "#F1F3F4"),
                color: filter === c ? "#FFFBEB" : textPrimary,
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div style={{
        paddingTop: 16,
        paddingLeft: "max(16px, env(safe-area-inset-left))",
        paddingRight: "max(16px, env(safe-area-inset-right))",
        paddingBottom: 16,
      }}>
        <p style={{ marginTop: 0, marginBottom: 14, color: textSecondary, fontSize: 13 }}>
          {filtered.length} {filtered.length === 1 ? "зал" : "залов"} {filter !== "Все" ? `в городе ${filter}` : "по всему Казахстану"}
        </p>

        {filtered.map((hall, idx) => (
          <div
            key={idx}
            onClick={() => showToast("Детали зала скоро будут доступны")}
            style={{
              background: cardBg,
              borderRadius: 16,
              marginBottom: 14,
              overflow: "hidden",
              boxShadow: darkTheme ? "none" : "0 2px 8px rgba(0,0,0,0.05)",
              cursor: "pointer",
            }}
          >
            {/* Image placeholder */}
            <div style={{
              height: 160,
              background: "linear-gradient(135deg, #A87935 0%, #800020 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}>
              <span style={{ fontSize: 52, opacity: 0.3 }}>🏛️</span>
              {/* Rating badge */}
              <div style={{
                position: "absolute",
                top: 12,
                right: 12,
                background: "rgba(0,0,0,0.5)",
                backdropFilter: "blur(8px)",
                borderRadius: 8,
                padding: "4px 10px",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}>
                <span style={{ color: "#FFD700", fontSize: 13 }}>★</span>
                <span style={{ color: "#FFFBEB", fontSize: 13, fontWeight: 600 }}>{hall.rating}</span>
              </div>
              {/* City badge */}
              <div style={{
                position: "absolute",
                top: 12,
                left: 12,
                background: "rgba(0,0,0,0.5)",
                backdropFilter: "blur(8px)",
                borderRadius: 8,
                padding: "4px 10px",
                color: "#FFFBEB",
                fontSize: 12,
                fontWeight: 500,
              }}>
                📍 {hall.city}
              </div>
            </div>

            {/* Info */}
            <div style={{ padding: 16 }}>
              <div style={{ fontSize: 17, fontWeight: 700 }}>{hall.name}</div>
              <div style={{ fontSize: 13, color: textSecondary, marginTop: 3 }}>{hall.address}</div>

              <div style={{ height: 1, background: divider, margin: "12px 0" }} />

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 11, color: textSecondary }}>Стоимость</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#A87935", marginTop: 2 }}>{hall.price}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 11, color: textSecondary }}>Вместимость</div>
                  <div style={{ fontSize: 13, fontWeight: 500, marginTop: 2 }}>{hall.capacity}</div>
                </div>
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={() => router.push("/menu/booking")}
          style={{
            width: "100%",
            height: 54,
            marginTop: 8,
            background: "linear-gradient(135deg, #A87935 0%, #800020 100%)",
            color: "#FFFBEB",
            fontSize: 15,
            fontWeight: 600,
            border: "none",
            borderRadius: 14,
            cursor: "pointer",
            boxShadow: "0 4px 16px rgba(128,0,32,0.3)",
          }}
        >
          Перейти к бронированию
        </button>
      </div>
    </div>
  );
}
