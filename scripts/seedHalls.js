const hallsData = {
  "palazzo": {
    "name": "Palazzo Di Astana",
    "city": "Астана",
    "address": "ул. Сыганак, 38",
    "price": "от 15 000 ₸/чел",
    "capacity": "до 500 гостей",
    "rating": "4.9",
    "reviewsCount": "342 отзыва",
    "image": "https://avatars.mds.yandex.net/get-altay/10355486/2a0000018a1a1a1a/orig", // Realistic fallback
    "description": "Дворцовый стиль в самом сердце столицы. Высокие потолки (8 метров), хрустальные люстры и безупречный сервис. Подходит для масштабных свадеб и правительственных приемов.",
    "features": ["LED-экран 12x4м", "Профессиональный звук", "VIP-комнаты", "Гримерки", "Парковка на 100 машин"],
    "cuisine": "Казахская, Европейская, Авторская",
    "url2gis": "https://2gis.kz/astana/firm/70000001021469339/tab/reviews",
    "reviews": [
      { "user": "Арман", "rating": 5, "date": "2 недели назад", "text": "Проводили здесь ұзату дочери. Всё прошло на высшем уровне. Кухня очень вкусная, баурсаки горячие, мясо тает во рту." },
      { "user": "Динара", "rating": 5, "date": "Месяц назад", "text": "Шикарный интерьер! Фотографии получаются просто бомбические. Сервис очень внимательный." }
    ]
  },
  "bakshasaray": {
    "name": "Бакшасарай",
    "city": "Алматы",
    "address": "ул. Тимирязева, 42к1",
    "price": "от 18 000 ₸/чел",
    "capacity": "до 700 гостей",
    "rating": "5.0",
    "reviewsCount": "820 отзывов",
    "image": "https://avatars.mds.yandex.net/get-altay/2818617/2a00000171a0b3a3c9b7b9f8f4a1a5b8b0a9/orig",
    "description": "Легендарный банкетный комплекс в КЦДС Атакент. Несколько залов (Gerey Khan, Pushkin, Small Hall). Уникальное сочетание восточного гостеприимства и современных технологий.",
    "features": ["Собственная кондитерская", "Летняя терраса", "Детская игровая", "Сцена-трансформер"],
    "cuisine": "Национальная, Турецкая, Мировая",
    "url2gis": "https://2gis.kz/almaty/firm/9429940000785641/tab/reviews",
    "reviews": [
      { "user": "Марат", "rating": 5, "date": "3 дня назад", "text": "Лучшее место в Алматы для больших тоев. Парковка огромная, места много, кондиционеры работают отлично." },
      { "user": "Гульназ", "rating": 5, "date": "10 дней назад", "text": "Сервис 10/10. Менеджеры помогают с любым вопросом." }
    ]
  },
  "aura": {
    "name": "Aura Palace",
    "city": "Шымкент",
    "address": "пр. Тауке хана, 15",
    "price": "от 10 000 ₸/чел",
    "capacity": "до 400 гостей",
    "rating": "4.8",
    "reviewsCount": "156 отзывов",
    "image": "https://avatars.mds.yandex.net/get-altay/1932371/2a0000016e3c0e3e5b3e1c3e1e5e6b7c8a9d/orig",
    "description": "Один из самых востребованных залов Шымкента. Уютная атмосфера, современный дизайн и знаменитая южная кухня.",
    "features": ["Зона для фотосессий", "Световое шоу", "Мощные кондиционеры"],
    "cuisine": "Шымкентская (лучший беш), Восточная",
    "url2gis": "https://2gis.kz/shymkent/firm/70000001032398555/tab/reviews",
    "reviews": [
      { "user": "Ербол", "rating": 5, "date": "Неделю назад", "text": "Бешбармак просто пушка! Гости были в восторге. Зал чистый, звук хороший." }
    ]
  }
};

const DB_URL = process.env.FIREBASE_DATABASE_URL
  ? `${process.env.FIREBASE_DATABASE_URL.replace(/\/$/, "")}/Halls.json`
  : null;

async function seed() {
  if (!DB_URL) {
    throw new Error("Missing FIREBASE_DATABASE_URL. Example: https://your_project-default-rtdb.firebaseio.com");
  }

  try {
    const res = await fetch(DB_URL, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(hallsData)
    });
    if (res.ok) {
      console.log("Database seeded successfully!");
    } else {
      console.error("Error seeding DB:", await res.text());
    }
  } catch (err) {
    console.error("Error:", err);
  }
}

seed();
