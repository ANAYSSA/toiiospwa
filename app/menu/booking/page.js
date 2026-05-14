"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/Toast";

const KZ_CITIES = [
  "Алматы", "Астана", "Шымкент", "Актобе", "Караганда",
  "Тараз", "Павлодар", "Усть-Каменогорск", "Семей", "Атырау",
  "Костанай", "Кызылорда", "Уральск", "Петропавловск", "Актау", "Туркестан",
];

const EVENTS = ["Той", "Свадьба", "Қыз ұзату", "Сүндет той", "Беташар", "Мерейтой"];

const SERVICES = [
  { key: "tamada", label: "Тамада / Ведущий", icon: "🎤" },
  { key: "singer", label: "Певцы и Музыканты", icon: "🎵" },
  { key: "dancers", label: "Танцевальные шоу", icon: "💃" },
  { key: "photo", label: "Фотограф / Видеограф", icon: "📸" },
  { key: "decor", label: "Декор и оформление", icon: "🎨" },
  { key: "cake", label: "Торт и десерты", icon: "🎂" },
];

const GUEST_OPTIONS = ["до 50", "50–100", "100–200", "200–500", "500+"];

export default function BookingPage() {
  const router = useRouter();
  const showToast = useToast();
  const [darkTheme, setDarkTheme] = useState(false);
  const [city, setCity] = useState("");
  const [eventType, setEventType] = useState("");
  const [date, setDate] = useState("");
  const [guests, setGuests] = useState("");
  const [services, setServices] = useState({});
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [showEventPicker, setShowEventPicker] = useState(false);
  const [showGuestPicker, setShowGuestPicker] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("theme");
      if (saved === "dark") setDarkTheme(true);
      const savedCity = localStorage.getItem("userCity");
      if (savedCity) setCity(savedCity);
    } catch (e) {}
  }, []);

  const toggleService = (key) => setServices({ ...services, [key]: !services[key] });

  const bg = darkTheme ? "#0A0A0A" : "#F8F9FA";
  const cardBg = darkTheme ? "#141414" : "#FFFFFF";
  const textPrimary = darkTheme ? "#FFFBEB" : "#1A1A1A";
  const textSecondary = darkTheme ? "#888" : "#666";
  const fieldBg = darkTheme ? "#222" : "#F1F3F4";
  const fieldColor = darkTheme ? "#FFFBEB" : "#1A1A1A";
  const border = darkTheme ? "#333" : "#EEE";

  const handleSearch = () => {
    if (!city) { showToast("Выберите город"); return; }
    if (!eventType) { showToast("Выберите тип мероприятия"); return; }
    if (!date) { showToast("Выберите дату"); return; }
    showToast("Поиск залов... Скоро будет доступно!");
  };

  const selectedCount = Object.values(services).filter(Boolean).length;

  return (
    <div style={{ 
      background: bg, 
      backgroundImage: darkTheme ? "url('https://www.transparenttextures.com/patterns/dark-matter.png')" : "url('https://www.transparenttextures.com/patterns/linen.png')",
      color: textPrimary, 
      minHeight: "100vh" 
    }}>
      <div style={{
        paddingTop: "calc(20px + env(safe-area-inset-top))",
        paddingLeft: "max(20px, env(safe-area-inset-left))",
        paddingRight: "max(20px, env(safe-area-inset-right))",
        paddingBottom: 40,
      }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, marginTop: 0, marginBottom: 4 }}>
          Организация тоя
        </h1>
        <p style={{ fontSize: 14, color: textSecondary, marginTop: 0, marginBottom: 24, fontWeight: 500 }}>
          Оставьте заявку и мы предложим лучшие варианты
        </p>

        {/* Детали */}
        <div style={{
          background: cardBg, borderRadius: 20, padding: 20, marginBottom: 16,
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)", border: `1px solid ${border}`
        }}>
          <div style={{ fontWeight: 800, color: "#A87935", marginBottom: 16, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Детали мероприятия
          </div>

          <FieldButton icon="📍" label={city || "Выберите город"} onClick={() => setShowCityPicker(true)} bg={fieldBg} color={fieldColor} />
          <FieldButton icon="🎉" label={eventType || "Тип мероприятия"} onClick={() => setShowEventPicker(true)} bg={fieldBg} color={fieldColor} style={{ marginTop: 12 }} />

          <label style={{
            display: "flex", alignItems: "center", gap: 12, background: fieldBg, borderRadius: 14, padding: "16px",
            marginTop: 12, position: "relative", cursor: "pointer", border: `1px solid ${border}`
          }}>
            <span style={{ fontSize: 20 }}>📅</span>
            <span style={{ flex: 1, color: date ? fieldColor : "#888", fontSize: 15, fontWeight: 600 }}>
              {date ? formatDate(date) : "Выберите дату"}
            </span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer", width: "100%", height: "100%" }}
            />
          </label>

          <FieldButton icon="👥" label={guests || "Количество гостей"} onClick={() => setShowGuestPicker(true)} bg={fieldBg} color={fieldColor} style={{ marginTop: 12 }} />
        </div>

        {/* Услуги */}
        <div style={{
          background: cardBg, borderRadius: 20, padding: 20, marginBottom: 24,
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)", border: `1px solid ${border}`
        }}>
          <div style={{ fontWeight: 800, color: "#A87935", marginBottom: 16, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Дополнительные услуги
          </div>

          {SERVICES.map((svc, idx) => (
            <div key={svc.key}>
              <label style={{ display: "flex", alignItems: "center", padding: "14px 0", cursor: "pointer" }}>
                <span style={{ fontSize: 22, marginRight: 12, width: 30, textAlign: "center" }}>{svc.icon}</span>
                <span style={{ flex: 1, fontSize: 15, fontWeight: 600 }}>{svc.label}</span>
                <div style={{
                  width: 24, height: 24, borderRadius: 8, border: services[svc.key] ? "none" : `2px solid ${border}`,
                  background: services[svc.key] ? "#A87935" : "transparent", display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  {services[svc.key] && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4"><polyline points="20 6 9 17 4 12"/></svg>}
                </div>
                <input type="checkbox" checked={!!services[svc.key]} onChange={() => toggleService(svc.key)} style={{ display: "none" }} />
              </label>
              {idx < SERVICES.length - 1 && <div style={{ height: 1, background: border }} />}
            </div>
          ))}
        </div>

        <button
          onClick={handleSearch}
          style={{
            width: "100%", height: 62, background: "linear-gradient(135deg, #A87935 0%, #800020 100%)",
            color: "#FFFBEB", fontSize: 17, fontWeight: 800, border: "none", borderRadius: 16,
            boxShadow: "0 10px 25px rgba(128,0,32,0.3)", cursor: "pointer"
          }}
        >
          Найти предложения
        </button>
      </div>

      {/* Пикеры */}
      {showCityPicker && <PickerModal title="Выберите город" items={KZ_CITIES} onSelect={(c) => { setCity(c); setShowCityPicker(false); }} onClose={() => setShowCityPicker(false)} dark={darkTheme} border={border} />}
      {showEventPicker && <PickerModal title="Тип мероприятия" items={EVENTS} onSelect={(ev) => { setEventType(ev); setShowEventPicker(false); }} onClose={() => setShowEventPicker(false)} dark={darkTheme} border={border} />}
      {showGuestPicker && <PickerModal title="Количество гостей" items={GUEST_OPTIONS} onSelect={(g) => { setGuests(g); setShowGuestPicker(false); }} onClose={() => setShowGuestPicker(false)} dark={darkTheme} border={border} />}
    </div>
  );
}

function FieldButton({ icon, label, onClick, bg, color, style }) {
  return (
    <div onClick={onClick} style={{ display: "flex", alignItems: "center", gap: 12, background: bg, borderRadius: 14, padding: "16px", cursor: "pointer", border: "1px solid rgba(0,0,0,0.05)", ...style }}>
      <span style={{ fontSize: 20 }}>{icon}</span>
      <span style={{ flex: 1, color: label.includes("Выберите") ? "#888" : color, fontSize: 15, fontWeight: 600 }}>{label}</span>
      <span style={{ color: "#888", fontSize: 14 }}>▾</span>
    </div>
  );
}

function PickerModal({ title, items, onSelect, onClose, dark, border }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()} style={{ background: dark ? "#141414" : "white", color: dark ? "#FFFBEB" : "#1A1A1A", borderTop: `1px solid ${border}` }}>
        <div style={{ fontWeight: 800, marginBottom: 16, fontSize: 19, textAlign: "center" }}>{title}</div>
        <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
          {items.map((item) => (
            <div key={item} className="modal-item" onClick={() => onSelect(item)} style={{ borderBottomColor: border, padding: "18px 0", fontSize: 16, fontWeight: 500 }}>
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function formatDate(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  const months = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
  return `${parseInt(d, 10)} ${months[parseInt(m, 10) - 1]} ${y}`;
}
