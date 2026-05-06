"use client";

export default function HomePage() {
  return (
    <div className="booking-page">
      <div style={{
        paddingTop: "calc(20px + env(safe-area-inset-top))",
        paddingLeft: "max(20px, env(safe-area-inset-left))",
        paddingRight: "max(20px, env(safe-area-inset-right))",
        paddingBottom: 20,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <img src="/icons/logo.png" alt="" style={{ width: 44, height: 44, borderRadius: 10 }} />
          <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0 }}>Главная</h1>
        </div>

        <div className="section-card">
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <div style={{ fontSize: 32 }}>✦</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 18 }}>Добро пожаловать в ТОЙХАНА</div>
              <div style={{ fontSize: 13, color: "#888", marginTop: 4 }}>Платформа для организации тоев в Казахстане</div>
            </div>
          </div>
        </div>

        <div className="section-card">
          <div style={{ fontWeight: 700, color: "#A87935", marginBottom: 8 }}>Возможности</div>
          <ul style={{ paddingLeft: 18, margin: 0, lineHeight: 1.9, fontSize: 14 }}>
            <li>Поиск залов в любом городе</li>
            <li>Подбор тамады, певцов и танцевальных шоу</li>
            <li>Удобное бронирование на нужную дату</li>
            <li>Личный профиль и история заявок</li>
          </ul>
        </div>

        <div className="section-card" style={{ background: "linear-gradient(135deg, #800020 0%, #A87935 100%)", color: "#FFFBEB" }}>
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 6 }}>Готовы устроить незабываемый той?</div>
          <div style={{ fontSize: 13, opacity: 0.9 }}>Перейдите во вкладку «Бронь» и заполните форму — мы подберём лучшие варианты.</div>
        </div>
      </div>
    </div>
  );
}
