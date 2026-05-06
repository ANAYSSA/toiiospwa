"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/Toast";

const KZ_CITIES = ["Алматы", "Астана", "Шымкент", "Актобе", "Караганда"];
const EVENTS = ["Той", "Свадьба", "Қыз ұзату", "Мерейтой"];

export default function BookingPage() {
  const router = useRouter();
  const showToast = useToast();
  const [city, setCity] = useState("");
  const [eventType, setEventType] = useState(EVENTS[0]);
  const [date, setDate] = useState("");
  const [services, setServices] = useState({ tamada: false, singer: false, dancers: false });
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [showEventPicker, setShowEventPicker] = useState(false);

  const toggleService = (key) => setServices({ ...services, [key]: !services[key] });

  const handleSearch = () => {
    if (!city || !date) {
      showToast("Заполните город и дату");
      return;
    }
    const params = new URLSearchParams({
      city,
      eventType,
      date,
      tamada: services.tamada ? "1" : "0",
      singer: services.singer ? "1" : "0",
      dancers: services.dancers ? "1" : "0",
    });
    router.push(`/menu/halls/results?${params.toString()}`);
  };

  return (
    <div className="booking-page">
      <div style={{
        paddingTop: "calc(20px + env(safe-area-inset-top))",
        paddingLeft: "max(20px, env(safe-area-inset-left))",
        paddingRight: "max(20px, env(safe-area-inset-right))",
        paddingBottom: 20,
      }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, marginTop: 0, marginBottom: 24 }}>Организация события</h1>

        <div className="section-card">
          <div style={{ fontWeight: 700, color: "#1A73E8", marginBottom: 16 }}>Детали мероприятия</div>

          <div className="field-input" onClick={() => setShowCityPicker(true)}>
            <span style={{ color: "#1A73E8" }}>📍</span>
            <span style={{ flex: 1, color: city ? "inherit" : "#888" }}>
              {city || "Выберите город"}
            </span>
            <span style={{ color: "#888" }}>▾</span>
          </div>

          <div className="field-input" style={{ marginTop: 12 }} onClick={() => setShowEventPicker(true)}>
            <span style={{ color: "#1A73E8" }}>🎉</span>
            <span style={{ flex: 1 }}>{eventType}</span>
            <span style={{ color: "#888" }}>▾</span>
          </div>

          <label className="field-input" style={{ marginTop: 12, position: "relative" }}>
            <span style={{ color: "#1A73E8" }}>📅</span>
            <span style={{ flex: 1, color: date ? "inherit" : "#888" }}>
              {date ? formatDate(date) : "Выберите дату"}
            </span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer", width: "100%", height: "100%" }}
            />
          </label>
        </div>

        <div className="section-card">
          <div style={{ fontWeight: 700, color: "#1A73E8", marginBottom: 12 }}>Кто вам нужен?</div>
          <label className="checkbox-row">
            <input type="checkbox" checked={services.tamada} onChange={() => toggleService("tamada")} />
            <span>Тамада / Ведущий</span>
          </label>
          <label className="checkbox-row">
            <input type="checkbox" checked={services.singer} onChange={() => toggleService("singer")} />
            <span>Певцы и Музыканты</span>
          </label>
          <label className="checkbox-row">
            <input type="checkbox" checked={services.dancers} onChange={() => toggleService("dancers")} />
            <span>Танцевальные шоу</span>
          </label>
        </div>

        <button
          onClick={handleSearch}
          style={{
            width: "100%",
            height: 64,
            marginTop: 8,
            background: "#1A73E8",
            color: "white",
            fontSize: 18,
            fontWeight: 500,
            border: "none",
            borderRadius: 16,
            cursor: "pointer",
          }}
        >
          Найти предложения
        </button>
      </div>

      {showCityPicker && (
        <div className="modal-overlay" onClick={() => setShowCityPicker(false)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 18 }}>Выберите город</div>
            {KZ_CITIES.map((c) => (
              <div key={c} className="modal-item" onClick={() => { setCity(c); setShowCityPicker(false); }}>{c}</div>
            ))}
          </div>
        </div>
      )}

      {showEventPicker && (
        <div className="modal-overlay" onClick={() => setShowEventPicker(false)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 18 }}>Тип события</div>
            {EVENTS.map((ev) => (
              <div key={ev} className="modal-item" onClick={() => { setEventType(ev); setShowEventPicker(false); }}>{ev}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function formatDate(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${parseInt(d, 10)}.${parseInt(m, 10)}.${y}`;
}
