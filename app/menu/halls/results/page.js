"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

const HALLS_BY_CITY = {
  "Алматы": [
    { name: "Bishkek Park (Almaty Hall)", address: "ул. Розыбакиева, 247", price: "от 12 000 ₸ / чел" },
    { name: "Almaty Towers Hall", address: "пр. Достык, 280", price: "от 14 000 ₸ / чел" },
  ],
  "Астана": [
    { name: "Royal Ballroom Astana", address: "пр. Кабанбай батыра, 11", price: "от 18 000 ₸ / чел" },
    { name: "Khan Shatyr Hall", address: "ул. Туран, 37", price: "от 22 000 ₸ / чел" },
  ],
  "Шымкент": [
    { name: "Shymkent Plaza", address: "пр. Тауке хана, 4", price: "от 9 000 ₸ / чел" },
  ],
  "Актобе": [
    { name: "Aktobe Grand Hall", address: "пр. Абылхаир хана, 12", price: "от 8 500 ₸ / чел" },
  ],
  "Караганда": [
    { name: "Караганда Royal", address: "пр. Бухар жырау, 35", price: "от 9 500 ₸ / чел" },
  ],
};

const TAMADAS = [
  { name: "Ербол Жанабай", address: "Опытный тамада, 10+ лет", price: "от 150 000 ₸ / вечер" },
  { name: "Айгуль Касымова", address: "Двуязычное ведение (KZ/RU)", price: "от 180 000 ₸ / вечер" },
];

const SINGERS = [
  { name: "Группа «Қазақ Әуені»", address: "Живая музыка, нац. инструменты", price: "от 250 000 ₸ / вечер" },
  { name: "Дуэт «Аруна и Бекзат»", address: "Эстрада + современные хиты", price: "от 200 000 ₸ / вечер" },
];

const DANCERS = [
  { name: "Шоу-балет «Дала»", address: "Народные танцы Казахстана", price: "от 120 000 ₸ / выступ." },
  { name: "Dance Studio «Astana»", address: "Современные танцевальные шоу", price: "от 100 000 ₸ / выступ." },
];

function ResultsContent() {
  const router = useRouter();
  const params = useSearchParams();
  const city = params.get("city") || "";
  const date = params.get("date") || "";
  const showTamada = params.get("tamada") === "1";
  const showSinger = params.get("singer") === "1";
  const showDancers = params.get("dancers") === "1";

  const halls = HALLS_BY_CITY[city] || [];

  return (
    <div className="booking-page">
      <div className="page-toolbar">
        <button
          onClick={() => router.back()}
          style={{ background: "transparent", border: "none", color: "#FFD700", fontSize: 24, cursor: "pointer", padding: 0, marginRight: 12 }}
          aria-label="Назад"
        >
          ←
        </button>
        <div style={{ flex: 1, textAlign: "center", fontSize: 18, fontWeight: 700, marginRight: 36 }}>
          Результаты: {city}
        </div>
      </div>

      <div style={{
        paddingTop: 16,
        paddingLeft: "max(16px, env(safe-area-inset-left))",
        paddingRight: "max(16px, env(safe-area-inset-right))",
      }}>
        {date && (
          <div style={{ fontSize: 13, color: "#888", marginBottom: 12 }}>
            Дата: {formatDate(date)}
          </div>
        )}

        <Section title="Доступные залы" items={halls.length ? halls : [{ name: "Залы скоро появятся", address: city, price: "—" }]} />

        {showTamada && <Section title="Ведущие" items={TAMADAS} />}
        {showSinger && <Section title="Музыканты" items={SINGERS} />}
        {showDancers && <Section title="Танцевальные группы" items={DANCERS} />}

        <button
          onClick={() => router.back()}
          style={{
            width: "100%", height: 52, marginTop: 16,
            background: "transparent", color: "#A87935",
            fontSize: 15, fontWeight: 500,
            border: "1px solid #A87935", borderRadius: 12, cursor: "pointer",
          }}
        >
          ← Назад к поиску
        </button>
      </div>
    </div>
  );
}

function Section({ title, items }) {
  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ fontWeight: 700, marginBottom: 8, fontSize: 16 }}>{title}</div>
      {items.map((item, i) => <Card key={i} item={item} />)}
    </div>
  );
}

function Card({ item }) {
  return (
    <div className="card-light" style={{ marginBottom: 16 }}>
      <div style={{
        height: 180,
        background: "linear-gradient(135deg, #A87935 0%, #800020 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "rgba(255,255,255,0.5)", fontSize: 64,
      }}>
        🎉
      </div>
      <div style={{ padding: 16 }}>
        <div style={{ fontSize: 18, fontWeight: 700 }}>{item.name}</div>
        <div style={{ fontSize: 14, color: "#888", marginTop: 2 }}>{item.address}</div>
        <div style={{ height: 1, background: "rgba(0,0,0,0.12)", margin: "10px 0" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#4CAF50", fontWeight: 700 }}>{item.price}</span>
          <span style={{ color: "#FFD700", fontWeight: 700 }}>Свободно</span>
        </div>
      </div>
    </div>
  );
}

function formatDate(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${parseInt(d, 10)}.${parseInt(m, 10)}.${y}`;
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<div style={{ padding: 30, textAlign: "center" }}><span className="spinner" /></div>}>
      <ResultsContent />
    </Suspense>
  );
}
