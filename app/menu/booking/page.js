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

  const bg = darkTheme ? "#0F0F0F" : "#F8F9FA";
  const cardBg = darkTheme ? "#1A1A1A" : "#FFFFFF";
  const textPrimary = darkTheme ? "#FFFBEB" : "#1A1A1A";
  const textSecondary = darkTheme ? "#888" : "#666";
  const fieldBg = darkTheme ? "#2A2A2A" : "#F1F3F4";
  const fieldColor = darkTheme ? "#FFFBEB" : "#1A1A1A";

  const handleSearch = () => {
    if (!city) {
      showToast("Выберите город");
      return;
    }
    if (!eventType) {
      showToast("Выберите тип мероприятия");
      return;
    }
    if (!date) {
      showToast("Выберите дату");
      return;
    }
    showToast("Поиск залов... Скоро будет доступно!");
  };

  const selectedCount = Object.values(services).filter(Boolean).length;

  return (
    <div style={{ background: bg, color: textPrimary, minHeight: "100vh" }}>
      <div style={{
        paddingTop: "calc(20px + env(safe-area-inset-top))",
        paddingLeft: "max(20px, env(safe-area-inset-left))",
        paddingRight: "max(20px, env(safe-area-inset-right))",
        paddingBottom: 20,
      }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, marginTop: 0, marginBottom: 4 }}>
          Организация события
        </h1>
        <p style={{ fontSize: 14, color: textSecondary, marginTop: 0, marginBottom: 24 }}>
          Заполните детали и мы найдём лучшие предложения
        </p>

        {/* Детали мероприятия */}
        <div style={{
          background: cardBg,
          borderRadius: 16,
          padding: 16,
          marginBottom: 16,
          boxShadow: darkTheme ? "none" : "0 2px 8px rgba(0,0,0,0.04)",
        }}>
          <div style={{ fontWeight: 700, color: "#A87935", marginBottom: 14, fontSize: 14 }}>
            Детали мероприятия
          </div>

          {/* Город */}
          <FieldButton
            icon="📍"
            label={city || "Выберите город"}
            placeholder={!city}
            onClick={() => setShowCityPicker(true)}
            bg={fieldBg}
            color={fieldColor}
          />

          {/* Тип события */}
          <FieldButton
            icon="🎉"
            label={eventType || "Тип мероприятия"}
            placeholder={!eventType}
            onClick={() => setShowEventPicker(true)}
            bg={fieldBg}
            color={fieldColor}
            style={{ marginTop: 10 }}
          />

          {/* Дата */}
          <label style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            background: fieldBg,
            borderRadius: 12,
            padding: 16,
            marginTop: 10,
            position: "relative",
            cursor: "pointer",
          }}>
            <span style={{ fontSize: 18 }}>📅</span>
            <span style={{ flex: 1, color: date ? fieldColor : "#888", fontSize: 15 }}>
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

          {/* Гости */}
          <FieldButton
            icon="👥"
            label={guests || "Количество гостей"}
            placeholder={!guests}
            onClick={() => setShowGuestPicker(true)}
            bg={fieldBg}
            color={fieldColor}
            style={{ marginTop: 10 }}
          />
        </div>

        {/* Услуги */}
        <div style={{
          background: cardBg,
          borderRadius: 16,
          padding: 16,
          marginBottom: 16,
          boxShadow: darkTheme ? "none" : "0 2px 8px rgba(0,0,0,0.04)",
        }}>
          <div style={{ fontWeight: 700, color: "#A87935", marginBottom: 4, fontSize: 14 }}>
            Дополнительные услуги
          </div>
          <div style={{ fontSize: 12, color: textSecondary, marginBottom: 14 }}>
            {selectedCount > 0 ? `Выбрано: ${selectedCount}` : "Выберите нужные"}
          </div>

          {SERVICES.map((svc, idx) => (
            <div key={svc.key}>
              <label style={{
                display: "flex",
                alignItems: "center",
                padding: "12px 0",
                cursor: "pointer",
                userSelect: "none",
              }}>
                <span style={{ fontSize: 20, marginRight: 12, width: 28, textAlign: "center" }}>
                  {svc.icon}
                </span>
                <span style={{ flex: 1, fontSize: 14 }}>{svc.label}</span>
                <div style={{
                  width: 22,
                  height: 22,
                  borderRadius: 6,
                  border: services[svc.key] ? "none" : `2px solid ${darkTheme ? "#555" : "#CCC"}`,
                  background: services[svc.key] ? "#A87935" : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s",
                }}>
                  {services[svc.key] && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                <input
                  type="checkbox"
                  checked={!!services[svc.key]}
                  onChange={() => toggleService(svc.key)}
                  style={{ display: "none" }}
                />
              </label>
              {idx < SERVICES.length - 1 && (
                <div style={{ height: 1, background: darkTheme ? "#2A2A2A" : "rgba(0,0,0,0.06)" }} />
              )}
            </div>
          ))}
        </div>

        {/* Кнопка поиска */}
        <button
          onClick={handleSearch}
          style={{
            width: "100%",
            height: 58,
            background: "linear-gradient(135deg, #A87935 0%, #800020 100%)",
            color: "#FFFBEB",
            fontSize: 16,
            fontWeight: 600,
            border: "none",
            borderRadius: 14,
            cursor: "pointer",
            boxShadow: "0 4px 16px rgba(128,0,32,0.3)",
            letterSpacing: "0.02em",
          }}
        >
          Найти предложения
        </button>

        <div style={{ textAlign: "center", marginTop: 12, fontSize: 12, color: textSecondary }}>
          Бесплатно и без обязательств
        </div>
      </div>

      {/* Пикер города */}
      {showCityPicker && (
        <PickerModal
          title="Выберите город"
          items={KZ_CITIES}
          onSelect={(c) => { setCity(c); setShowCityPicker(false); }}
          onClose={() => setShowCityPicker(false)}
          dark={darkTheme}
        />
      )}

      {/* Пикер события */}
      {showEventPicker && (
        <PickerModal
          title="Тип мероприятия"
          items={EVENTS}
          onSelect={(ev) => { setEventType(ev); setShowEventPicker(false); }}
          onClose={() => setShowEventPicker(false)}
          dark={darkTheme}
        />
      )}

      {/* Пикер гостей */}
      {showGuestPicker && (
        <PickerModal
          title="Количество гостей"
          items={GUEST_OPTIONS}
          onSelect={(g) => { setGuests(g); setShowGuestPicker(false); }}
          onClose={() => setShowGuestPicker(false)}
          dark={darkTheme}
        />
      )}
    </div>
  );
}

/* ===== Helpers ===== */

function FieldButton({ icon, label, placeholder, onClick, bg, color, style }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        background: bg,
        borderRadius: 12,
        padding: 16,
        cursor: "pointer",
        ...style,
      }}
    >
      <span style={{ fontSize: 18 }}>{icon}</span>
      <span style={{ flex: 1, color: placeholder ? "#888" : color, fontSize: 15 }}>
        {label}
      </span>
      <span style={{ color: "#888", fontSize: 12 }}>▾</span>
    </div>
  );
}

function PickerModal({ title, items, onSelect, onClose, dark }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-sheet"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: dark ? "#1A1A1A" : "white",
          color: dark ? "#FFFBEB" : "#1A1A1A",
        }}
      >
        <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 18 }}>{title}</div>
        {items.map((item) => (
          <div
            key={item}
            className="modal-item"
            onClick={() => onSelect(item)}
            style={{
              borderBottomColor: dark ? "#333" : "#EEE",
            }}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function formatDate(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  const months = ["января", "февраля", "марта", "апреля", "мая", "июня",
    "июля", "августа", "сентября", "октября", "ноября", "декабря"];
  return `${parseInt(d, 10)} ${months[parseInt(m, 10) - 1]} ${y}`;
}
