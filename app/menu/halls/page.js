"use client";
import { useRouter } from "next/navigation";

const SAMPLE_HALLS = [
  { name: "Bishkek Park (Almaty Hall)", city: "Алматы", address: "ул. Розыбакиева, 247", price: "от 12 000 ₸ / чел", status: "Свободно" },
  { name: "Royal Ballroom Astana", city: "Астана", address: "пр. Кабанбай батыра, 11", price: "от 18 000 ₸ / чел", status: "Свободно" },
  { name: "Khan Shatyr Hall", city: "Астана", address: "ул. Туран, 37", price: "от 22 000 ₸ / чел", status: "Свободно" },
  { name: "Almaty Towers Hall", city: "Алматы", address: "пр. Достык, 280", price: "от 14 000 ₸ / чел", status: "Свободно" },
  { name: "Shymkent Plaza", city: "Шымкент", address: "пр. Тауке хана, 4", price: "от 9 000 ₸ / чел", status: "Свободно" },
];

export default function HallsPage() {
  const router = useRouter();

  return (
    <div className="booking-page">
      <div className="page-toolbar" style={{ justifyContent: "center" }}>
        <div style={{ fontSize: 18, fontWeight: 700 }}>Все залы</div>
      </div>

      <div style={{
        paddingTop: 16,
        paddingLeft: "max(16px, env(safe-area-inset-left))",
        paddingRight: "max(16px, env(safe-area-inset-right))",
        paddingBottom: 16,
      }}>
        <p style={{ marginTop: 0, marginBottom: 16, color: "#888", fontSize: 14 }}>
          Популярные залы по всему Казахстану
        </p>

        {SAMPLE_HALLS.map((hall, idx) => <HallCard key={idx} hall={hall} />)}

        <button
          onClick={() => router.push("/menu/booking")}
          style={{
            width: "100%", height: 56, marginTop: 8,
            background: "#A87935", color: "white",
            fontSize: 16, fontWeight: 500, border: "none",
            borderRadius: 14, cursor: "pointer",
          }}
        >
          Перейти к бронированию
        </button>
      </div>
    </div>
  );
}

function HallCard({ hall }) {
  return (
    <div className="card-light" style={{ marginBottom: 16 }}>
      <div style={{
        height: 180,
        background: "linear-gradient(135deg, #A87935 0%, #800020 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "rgba(255,255,255,0.5)", fontSize: 64,
      }}>
        🏛️
      </div>
      <div style={{ padding: 16 }}>
        <div style={{ fontSize: 18, fontWeight: 700 }}>{hall.name}</div>
        <div style={{ fontSize: 14, color: "#888", marginTop: 2 }}>{hall.address}</div>
        <div style={{ height: 1, background: "rgba(0,0,0,0.12)", margin: "10px 0" }} />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ color: "#4CAF50", fontWeight: 700 }}>{hall.price}</span>
          <span style={{ color: "#FFD700", fontWeight: 700 }}>{hall.status}</span>
        </div>
      </div>
    </div>
  );
}
