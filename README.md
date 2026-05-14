# toi.kz — PWA

PWA-версия твоего Android-приложения для бронирования залов и услуг для тоев в Казахстане.
Сделано на **Next.js 14 (App Router) + Firebase Web SDK**.

Полностью повторяет весь функционал Android-версии:

- 🔐 **Login** (Email/Password) — `MainActivity`
- ✍️ **Register** (Name, Surname, Email, Phone, Password) — `CreatingAccount`
- 🔄 **Forgot Password** (через Firebase) — `ForgotPassword`
- 🏠 **Меню с нижней навигацией** (Home / Halls / Booking / Profile) — `Menu`
- 📝 **Booking** (выбор города, типа события, даты, услуг) — `BookingFragment`
- 🏛️ **Halls** (карточки залов и услуг по фильтрам) — `HallsFragment`
- 👤 **Profile** (тёмная тема, выбор города, выход) — `ProfileFragment`

Тот же тёмно-золотой дизайн (#0A0A0A / #A87935 / #800020), та же логика, тот же Firebase-проект.

---

## 🚀 Быстрый старт

### 1. Локально запустить

```bash
npm install
npm run dev
```

Открой http://localhost:3000

### 2. Деплой на Vercel

#### Вариант А: через GitHub (рекомендуется)

1. Создай новый репозиторий на GitHub
2. Залей этот проект:
   ```bash
   git init
   git add .
   git commit -m "ToiKz PWA"
   git branch -M main
   git remote add origin https://github.com/ТВОЙ_USERNAME/toikz-pwa.git
   git push -u origin main
   ```
3. Зайди на https://vercel.com → **New Project** → Import репозиторий
4. Просто нажми **Deploy** (Vercel сам определит Next.js, ничего настраивать не надо)
5. Через ~1 минуту получишь ссылку вида `https://toikz-pwa.vercel.app`

#### Вариант Б: через Vercel CLI

```bash
npm i -g vercel
vercel
# следуй инструкциям, выбирай defaults
```

---

## ⚠️ ВАЖНО: настройка Firebase для веба

Твой `google-services.json` — для Android. Чтобы Firebase работал на вебе, нужно:

### 1. Создать Web App в Firebase Console

1. Зайди в https://console.firebase.google.com → выбери проект **toikz-5921a**
2. ⚙️ Project Settings → вкладка **General**
3. Скролл вниз до **Your apps** → нажми **Add app** → **Web (</>)**
4. Введи название "ToiKz Web" → Register app
5. Скопируй блок `firebaseConfig` — там будет нужный `appId` (формат `1:542357949375:web:...`)

### 2. Добавить домен в Authorized

Authentication → Settings → **Authorized domains** → Add domain →
введи свой Vercel-домен (например `toikz-pwa.vercel.app`).
Без этого Login не будет работать на сайте.

### 3. Включить нужные провайдеры

Authentication → **Sign-in method** → включи **Email/Password** (если ещё не включён).

### 4. (Опционально) Поставить env-переменные на Vercel

Если хочешь не хардкодить ключи в `lib/firebase.js`:

1. Vercel Dashboard → твой проект → **Settings** → **Environment Variables**
2. Добавь все переменные из `.env.example` (с твоим реальным `NEXT_PUBLIC_FIREBASE_APP_ID` для веба)
3. Redeploy

По умолчанию проект работает с конфигом, зашитым в `lib/firebase.js` — но `appId` там ставочный. **Обязательно поменяй его** на тот, что выдаст Firebase для Web App.

---

## 📱 Установка как PWA на iOS

После деплоя на Vercel:

1. Открой URL в **Safari** (важно — именно Safari, не Chrome)
2. Нажми кнопку **«Поделиться»** (квадрат со стрелкой вверх)
3. Прокрути вниз → **«На экран Домой»**
4. Нажми **«Добавить»**

Иконка toi.kz появится на рабочем столе. При запуске приложение откроется в полноэкранном режиме без браузерных панелей, как настоящее нативное приложение.

## 📱 Установка как PWA на Android

1. Открой URL в **Chrome**
2. В меню браузера выбери **«Установить приложение»** (или появится баннер)
3. Подтверди установку

---

## 📂 Структура проекта

```
toikz-pwa/
├── app/
│   ├── layout.js            ← root layout + PWA meta
│   ├── page.js              ← / Login (MainActivity)
│   ├── globals.css          ← вся стилистика + safe-area
│   ├── register/page.js     ← /register (CreatingAccount)
│   ├── forgot-password/page.js ← /forgot-password
│   └── menu/
│       ├── layout.js        ← bottom nav, auth guard
│       ├── home/page.js     ← Главная
│       ├── halls/
│       │   ├── page.js      ← список залов
│       │   └── results/page.js ← результаты поиска (HallsFragment)
│       ├── booking/page.js  ← BookingFragment
│       └── profile/page.js  ← ProfileFragment
├── components/
│   └── Toast.js             ← замена Toast.makeText
├── lib/
│   └── firebase.js          ← Firebase Web SDK
├── public/
│   ├── manifest.json        ← PWA manifest
│   ├── sw.js                ← service worker (offline)
│   └── icons/               ← все размеры иконок (твой логотип)
├── package.json
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
├── vercel.json
└── .env.example
```

---

## 🎨 Соответствие Android-версии

| Android Activity / Fragment   | PWA Route                    |
| ----------------------------- | ---------------------------- |
| `MainActivity`                | `/`                          |
| `CreatingAccount`             | `/register`                  |
| `ForgotPassword`              | `/forgot-password`           |
| `Menu`                        | `/menu/*`                    |
| `HomeFragment`                | `/menu/home`                 |
| `HallsFragment` (список)      | `/menu/halls`                |
| `HallsFragment` (результаты)  | `/menu/halls/results?...`    |
| `BookingFragment`             | `/menu/booking`              |
| `ProfileFragment`             | `/menu/profile`              |

---

## 🛠 Стек

- **Next.js 14** (App Router)
- **React 18**
- **Firebase Web SDK** (Auth + Realtime Database)
- **Tailwind CSS** (для базы)
- **Service Worker** (offline + установка)
- **iOS safe-area** (`env(safe-area-inset-*)`) — учтены вырезы и нижняя полоса iPhone

---

Готово! Если что-то не сработает — пиши.
