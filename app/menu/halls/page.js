"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { ref, get, set } from "firebase/database";
import { useToast } from "@/components/Toast";
import { useLanguage } from "@/components/LanguageContext";

const REAL_HALLS = [
  { 
    id: "palazzo",
    name: "Palazzo Di Astana", 
    city: "Астана", 
    address: "ул. Сыганак, 38", 
    price: "от 15 000 ₸/чел", 
    capacity: "до 500 гостей", 
    rating: "4.9",
    reviewsCount: "342 отзыва",
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800",
    description: "Дворцовый стиль в самом сердце столицы. Высокие потолки (8 метров), хрустальные люстры и безупречный сервис. Подходит для масштабных свадеб и правительственных приемов.",
    features: ["LED-экран 12x4м", "Профессиональный звук", "VIP-комнаты", "Гримерки", "Парковка на 100 машин"],
    cuisine: "Казахская, Европейская, Авторская",
    url2gis: "https://2gis.kz/astana/firm/70000001021469339",
    reviews: [
      { user: "Арман", rating: 5, date: "2 недели назад", text: "Проводили здесь ұзату дочери. Всё прошло на высшем уровне." },
      { user: "Динара", rating: 5, date: "Месяц назад", text: "Шикарный интерьер! Фотографии получаются просто бомбические." }
    ]
  },
  { 
    id: "bakshasaray",
    name: "Бакшасарай", 
    city: "Алматы", 
    address: "ул. Тимирязева, 42к1", 
    price: "от 18 000 ₸/чел", 
    capacity: "до 700 гостей", 
    rating: "5.0",
    reviewsCount: "820 отзывов",
    image: "https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&q=80&w=800",
    description: "Легендарный банкетный комплекс в КЦДС Атакент. Несколько залов (Gerey Khan, Pushkin, Small Hall).",
    features: ["Собственная кондитерская", "Летняя терраса", "Детская игровая", "Сцена-трансформер"],
    cuisine: "Национальная, Турецкая, Мировая",
    url2gis: "https://2gis.kz/almaty/firm/9429940000785641",
    reviews: [
      { user: "Марат", rating: 5, date: "3 дня назад", text: "Лучшее место в Алматы для больших тоев. Парковка огромная." }
    ]
  },
  { 
    id: "aura",
    name: "Aura Palace", 
    city: "Шымкент", 
    address: "пр. Тауке хана, 15", 
    price: "от 10 000 ₸/чел", 
    capacity: "до 400 гостей", 
    rating: "4.8",
    reviewsCount: "156 отзывов",
    image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=800",
    description: "Один из самых востребованных залов Шымкента. Уютная атмосфера, современный дизайн и знаменитая южная кухня.",
    features: ["Зона для фотосессий", "Световое шоу", "Мощные кондиционеры"],
    cuisine: "Шымкентская (лучший беш), Восточная",
    url2gis: "https://2gis.kz/shymkent/firm/70000001032398555",
    reviews: [
      { user: "Ербол", rating: 5, date: "Неделю назад", text: "Бешбармак просто пушка! Гости были в восторге." }
    ]
  }
];

export default function HallsPage() {
  const router = useRouter();
  const { lang } = useLanguage();
  const [darkTheme, setDarkTheme] = useState(false);
  const [filter, setFilter] = useState("Все");
  const [selectedHall, setSelectedHall] = useState(null);
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("theme");
      if (saved === "dark") setDarkTheme(true);
    } catch (e) {}

    const fetchHalls = async () => {
      try {
        const snap = await get(ref(db, "Halls"));
        if (snap.exists()) {
          const data = Object.values(snap.val());
          // Если ссылки яндексовские или старые, форсированно обновляем на новые стабильные
          if (data[0] && data[0].image.includes("yandex")) {
             setHalls(REAL_HALLS);
             if (auth.currentUser) {
               const dbData = {};
               REAL_HALLS.forEach(h => dbData[h.id] = h);
               set(ref(db, "Halls"), dbData).catch(()=>{});
             }
          } else {
             setHalls(data);
          }
        } else {
          setHalls(REAL_HALLS);
          if (auth.currentUser) {
            const dbData = {};
            REAL_HALLS.forEach(h => dbData[h.id] = h);
            set(ref(db, "Halls"), dbData).catch(() => {});
          }
        }
      } catch (err) {
        console.error(err);
        setHalls(REAL_HALLS);
      } finally {
        setLoading(false);
      }
    };
    
    fetchHalls();
  }, []);

  const bg = darkTheme ? "#0A0A0A" : "#F8F9FA";
  const cardBg = darkTheme ? "#141414" : "#FFFFFF";
  const textPrimary = darkTheme ? "#FFFBEB" : "#1A1A1A";
  const textSecondary = darkTheme ? "#888" : "#666";
  const border = darkTheme ? "#222" : "#EEE";

  const cities = ["Все", ...new Set(halls.map((h) => h.city))];
  const filtered = filter === "Все" ? halls : halls.filter((h) => h.city === filter);

  if (loading) return <div style={{ height: "100vh", background: bg, display: "flex", alignItems: "center", justifyContent: "center" }} />;

  return (
    <div style={{ 
      background: bg, 
      color: textPrimary, 
      minHeight: "100vh" 
    }}>
      <div style={{
        background: darkTheme ? "rgba(10,10,10,0.85)" : "rgba(255,255,255,0.85)",
        backdropFilter: "blur(20px)",
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

      <div style={{ padding: "16px 16px 120px" }}>
        {filtered.map((hall) => (
          <div
            key={hall.id}
            onClick={() => setSelectedHall(hall)}
            style={{
              background: cardBg, borderRadius: 24, marginBottom: 20, overflow: "hidden",
              boxShadow: darkTheme ? "0 4px 20px rgba(0,0,0,0.5)" : "0 4px 20px rgba(0,0,0,0.05)", cursor: "pointer", border: `1px solid ${border}`
            }}
          >
            <div style={{ height: 200, position: "relative" }}>
              <img src={hall.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", top: 12, right: 12, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", borderRadius: 10, padding: "6px 12px", color: "white", fontSize: 13, fontWeight: 800 }}>
                ★ {hall.rating}
              </div>
            </div>
            <div style={{ padding: 20 }}>
              <div style={{ fontSize: 19, fontWeight: 800, marginBottom: 4 }}>{hall.name}</div>
              <div style={{ fontSize: 13, color: textSecondary, marginBottom: 12 }}>{hall.address}</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#A87935" }}>{hall.price}</div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{hall.capacity}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedHall && (
        <div className="detail-sheet" style={{ background: bg }}>
          <button className="close-btn" onClick={() => setSelectedHall(null)}>✕</button>
          
          <img src={selectedHall.image} style={{ width: "100%", height: 300, objectFit: "cover" }} />
          
          <div style={{ padding: 24, position: "relative", marginTop: -30, background: bg, borderRadius: "30px 30px 0 0", borderTop: `1px solid ${border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div>
                <h1 style={{ fontSize: 26, fontWeight: 900, margin: 0 }}>{selectedHall.name}</h1>
                <div style={{ fontSize: 14, color: textSecondary, marginTop: 4 }}>{selectedHall.address}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 24, fontWeight: 900, color: "#A87935" }}>{selectedHall.rating}</div>
                <div style={{ fontSize: 11, color: textSecondary }}>{selectedHall.reviewsCount}</div>
              </div>
            </div>

            <div style={{ height: 1, background: border, margin: "20px 0" }} />

            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>Описание</h3>
            <p style={{ fontSize: 15, lineHeight: 1.6, color: textSecondary, margin: 0 }}>{selectedHall.description}</p>

            <h3 style={{ fontSize: 18, fontWeight: 800, marginTop: 24, marginBottom: 12 }}>Особенности</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {selectedHall.features?.map(f => (
                <span key={f} style={{ background: darkTheme ? "#222" : "#F1F3F4", padding: "6px 12px", borderRadius: 8, fontSize: 13, fontWeight: 600 }}>{f}</span>
              ))}
            </div>

            <h3 style={{ fontSize: 18, fontWeight: 800, marginTop: 24, marginBottom: 8 }}>Кухня</h3>
            <p style={{ fontSize: 15, color: textSecondary }}>{selectedHall.cuisine}</p>

            <div style={{ height: 1, background: border, margin: "20px 0" }} />

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>Отзывы</h3>
              {selectedHall.url2gis && (
                <a href={selectedHall.url2gis} target="_blank" rel="noopener noreferrer" style={{ color: "#3182CE", fontSize: 14, fontWeight: 700, textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
                  Открыть в 2GIS <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/></svg>
                </a>
              )}
            </div>

            {selectedHall.reviews?.map((r, i) => (
              <div key={i} style={{ background: cardBg, padding: 16, borderRadius: 16, marginBottom: 12, border: `1px solid ${border}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontWeight: 800 }}>{r.user}</span>
                  <span style={{ fontSize: 12, color: "#A87935" }}>{"★".repeat(r.rating)}</span>
                </div>
                <p style={{ fontSize: 14, color: textSecondary, margin: 0, lineHeight: 1.5 }}>{r.text}</p>
                <div style={{ fontSize: 11, color: "#888", marginTop: 8 }}>{r.date}</div>
              </div>
            ))}

            <button
              onClick={() => { setSelectedHall(null); router.push("/menu/booking"); }}
              style={{ width: "100%", height: 60, marginTop: 20, background: "linear-gradient(135deg, #A87935, #800020)", color: "white", border: "none", borderRadius: 16, fontWeight: 800, fontSize: 16, boxShadow: "0 10px 20px rgba(128,0,32,0.3)", cursor: "pointer" }}
            >
              Забронировать этот зал
            </button>
            <div style={{ height: 40 }} />
          </div>
        </div>
      )}
    </div>
  );
}
