"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Briefcase,
  Building2,
  Calendar,
  Eye,
  EyeOff,
  Heart,
  Lock,
  MapPin,
  Phone,
  ShieldCheck,
  User,
  Users,
} from "lucide-react";
import { CATEGORIES, EVENT_TYPES, KZ_CITIES } from "@/lib/appData";
import { useAppStore } from "@/lib/appStore";
import { isValidKazakhstanPhone, normalizePhone, sanitizeText } from "@/lib/sanitize";
import { makeSessionUser, ROLE_ROUTES, setSession } from "@/lib/session";
import styles from "./AuthPage.module.css";

function PasswordField({
  value,
  onChange,
  placeholder,
  ariaLabel,
  visible,
  onToggle,
  autoComplete = "current-password",
}) {
  return (
    <div className={styles.fieldWrap}>
      <Lock className={styles.fieldIcon} size={20} aria-hidden="true" />
      <input
        className={`${styles.input} ${styles.inputWithToggle}`}
        type={visible ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-label={ariaLabel}
        autoComplete={autoComplete}
      />
      <button
        className={styles.iconButton}
        type="button"
        onClick={onToggle}
        aria-label={visible ? "Скрыть пароль" : "Показать пароль"}
      >
        {visible ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  );
}

export default function AuthPage({ initialTab = "login" }) {
  const router = useRouter();
  const { setStore, upsertCurrentUser } = useAppStore();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [accountType, setAccountType] = useState("client");
  const [phoneLoginMode, setPhoneLoginMode] = useState(false);
  const [otpStep, setOtpStep] = useState(false);

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [city, setCity] = useState("Алматы");
  const [eventType, setEventType] = useState("Үйлену той");
  const [businessName, setBusinessName] = useState("");
  const [vendorCategory, setVendorCategory] = useState("Залы");
  const [instagram, setInstagram] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [registerPhone, setRegisterPhone] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [phoneOnly, setPhoneOnly] = useState("");

  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const accountCopy =
    accountType === "vendor"
      ? {
          title: "Кабинет поставщика услуг",
          subtitle: "Получайте заявки, управляйте календарем и профилем услуги",
          icon: Briefcase,
        }
      : {
          title: "Я организую той",
          subtitle: "План, гости, бюджет, бронь и приглашения в одном приложении",
          icon: Users,
        };

  function resetMessages() {
    setError("");
    setSuccess("");
  }

  function showError(message) {
    setSuccess("");
    setError(message);
  }

  function switchTab(tab) {
    setActiveTab(tab);
    setPhoneLoginMode(false);
    setOtpStep(false);
    resetMessages();
  }

  function finishAuth(user) {
    setSession(user);
    upsertCurrentUser(user);
    setSubmitting(false);
    router.replace(ROLE_ROUTES[user.role] || "/menu/home");
  }

  async function handleLogin(e) {
    e.preventDefault();
    setSubmitting(true);

    const safePhone = normalizePhone(phone);

    if (!safePhone || !password) {
      setSubmitting(false);
      setError("Введите телефон и пароль");
      return;
    }

    if (!isValidKazakhstanPhone(safePhone)) {
      setSubmitting(false);
      setError("Введите корректный номер телефона");
      return;
    }

    try {
      // await login({ phone: safePhone, password });
      const user = makeSessionUser({
        role: accountType,
        name: accountType === "vendor" ? "Бизнес аккаунт" : "Гость toi.kz",
        phone: safePhone,
        city,
        businessName: accountType === "vendor" ? "Мой бизнес" : "",
        status: accountType === "vendor" ? "active" : "active",
      });
      setSuccess("Вход выполнен успешно");
      finishAuth(user);
    } catch {
      setSubmitting(false);
      setError("Ошибка входа");
      setSuccess("");
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    setSubmitting(true);

    const safeName = sanitizeText(name, 80);
    const safePhone = normalizePhone(registerPhone);
    const safeBusinessName = sanitizeText(businessName, 120);

    if (!safeName || !safePhone || !registerPassword || !confirmPassword) {
      setSubmitting(false);
      setError("Заполните все поля");
      setSuccess("");
      return;
    }

    if (accountType === "vendor" && !safeBusinessName) {
      setSubmitting(false);
      setError("Укажите название бизнеса");
      setSuccess("");
      return;
    }

    if (!isValidKazakhstanPhone(safePhone)) {
      setSubmitting(false);
      setError("Введите корректный номер телефона");
      setSuccess("");
      return;
    }

    if (registerPassword.length < 6) {
      setSubmitting(false);
      setError("Пароль должен быть минимум 6 символов");
      setSuccess("");
      return;
    }

    if (registerPassword !== confirmPassword) {
      setSubmitting(false);
      setError("Пароли не совпадают");
      setSuccess("");
      return;
    }

    try {
      // await register({ name: safeName, phone: safePhone, password: registerPassword, role: accountType });
      const user = makeSessionUser({
        role: accountType,
        name: safeName,
        phone: safePhone,
        city,
        businessName: safeBusinessName,
        status: accountType === "vendor" ? "pendingApproval" : "active",
      });

      if (accountType === "vendor") {
        setStore((current) => ({
          ...current,
          vendors: [
            {
              id: user.uid,
              ownerId: user.uid,
              businessName: safeBusinessName,
              title: safeBusinessName,
              category: vendorCategory,
              city,
              description: "Новый vendor profile ожидает проверки администратора.",
              priceFrom: 0,
              capacity: null,
              rating: 0,
              reviewsCount: 0,
              verified: false,
              featured: false,
              status: "pending",
              phone: safePhone,
              whatsapp: sanitizeText(whatsapp, 32),
              instagram: sanitizeText(instagram, 80),
              image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1200",
              features: [],
              availableDates: [],
              createdAt: new Date().toISOString(),
            },
            ...current.vendors.filter((vendor) => vendor.ownerId !== user.uid),
          ],
        }));
      }

      setSuccess(accountType === "vendor" ? "Заявка поставщика отправлена на проверку" : "Регистрация успешно завершена");
      finishAuth(user);
    } catch {
      setSubmitting(false);
      setError("Ошибка регистрации");
      setSuccess("");
    }
  }

  function handleSendCode(e) {
    e.preventDefault();

    const safePhone = normalizePhone(phoneOnly);

    if (!phoneOnly || !isValidKazakhstanPhone(safePhone)) {
      showError("Введите корректный номер телефона");
      return;
    }

    setPhoneOnly(safePhone);
    setOtpStep(true);
    setError("");
    setSuccess("Код отправлен");
  }

  function handleVerifyOtp(e) {
    e.preventDefault();

    if (!otp || !/^\d{4,6}$/.test(otp)) {
      showError("Введите код подтверждения");
      return;
    }

    const user = makeSessionUser({
      role: "client",
      name: "Гость toi.kz",
      phone: phoneOnly,
      city,
      status: "active",
    });
    setSuccess("Вы успешно вошли");
    finishAuth(user);
  }

  function handleForgotPassword() {
    setError("");
    setSuccess("Функция восстановления пароля скоро будет доступна");
  }

  const AccountIcon = accountCopy.icon;
  const message = (
    <div className={styles.message} role="status" aria-live="polite">
      {error ? <div className={`${styles.alert} ${styles.error}`}>{error}</div> : null}
      {success ? <div className={`${styles.alert} ${styles.success}`}>{success}</div> : null}
    </div>
  );

  return (
    <main className={styles.page}>
      <div className={styles.overlay} />
      <div className={styles.shell}>
        <section className={styles.card} aria-label="Авторизация toi.kz">
          <div className={styles.content}>
            <header className={styles.brand}>
              <div className={styles.monogram} aria-hidden="true">
                <span>T</span>
              </div>
              <h1 className={styles.logoText}>TOI.KZ</h1>
              <div className={styles.ornamentLine} aria-hidden="true">
                <span className={styles.diamond} />
              </div>
              <p className={styles.tagline}>Сервис для вашего идеального тоя</p>
            </header>

            <div className={styles.tabs} role="tablist" aria-label="Тип формы">
              <button className={`${styles.tab} ${activeTab === "login" ? styles.tabActive : ""}`} type="button" role="tab" aria-selected={activeTab === "login"} onClick={() => switchTab("login")}>
                Вход
              </button>
              <button className={`${styles.tab} ${activeTab === "register" ? styles.tabActive : ""}`} type="button" role="tab" aria-selected={activeTab === "register"} onClick={() => switchTab("register")}>
                Регистрация
              </button>
            </div>

            <div className={styles.roleSwitch} aria-label="Тип аккаунта">
              <button className={`${styles.roleOption} ${accountType === "client" ? styles.roleActive : ""}`} type="button" onClick={() => setAccountType("client")}>
                <Users size={18} aria-hidden="true" />
                <span>Я организую той</span>
              </button>
              <button className={`${styles.roleOption} ${accountType === "vendor" ? styles.roleActive : ""}`} type="button" onClick={() => setAccountType("vendor")}>
                <Briefcase size={18} aria-hidden="true" />
                <span>Я предоставляю услугу</span>
              </button>
            </div>

            <div className={styles.accountHint}>
              <AccountIcon size={18} aria-hidden="true" />
              <span>
                <strong>{accountCopy.title}</strong>
                {accountCopy.subtitle}
              </span>
            </div>

            {activeTab === "login" && !phoneLoginMode ? (
              <div className={styles.formPanel} key="login">
                <div className={styles.formHeader}>
                  <h2>Войдите в свой аккаунт</h2>
                  <p>Управляйте вашим тоем легко и удобно</p>
                </div>
                {message}
                <form className={styles.form} onSubmit={handleLogin}>
                  <div className={styles.fieldWrap}>
                    <Phone className={styles.fieldIcon} size={20} aria-hidden="true" />
                    <input className={styles.input} type="tel" value={phone} onChange={(e) => setPhone(sanitizeText(e.target.value, 24))} placeholder="+7 (___) ___-__-__" aria-label="Телефон" autoComplete="tel" />
                  </div>

                  <PasswordField value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Пароль" ariaLabel="Пароль" visible={showLoginPassword} onToggle={() => setShowLoginPassword((value) => !value)} />

                  <div className={styles.rowEnd}>
                    <button className={styles.linkButton} type="button" onClick={handleForgotPassword}>
                      Забыли пароль?
                    </button>
                  </div>

                  <button className={styles.primaryButton} type="submit" disabled={submitting}>
                    {submitting ? "Входим..." : "Войти"}
                  </button>

                  <div className={styles.divider}>или</div>

                  <button className={styles.secondaryButton} type="button" onClick={() => { setPhoneLoginMode(true); resetMessages(); }}>
                    <Phone size={20} aria-hidden="true" />
                    Войти по номеру телефона
                  </button>
                </form>
              </div>
            ) : null}

            {activeTab === "login" && phoneLoginMode ? (
              <div className={styles.formPanel} key="phone-login">
                <div className={styles.formHeader}>
                  <h2>Вход по номеру телефона</h2>
                  <p>Введите номер, чтобы получить код подтверждения</p>
                </div>
                {message}
                {!otpStep ? (
                  <form className={styles.form} onSubmit={handleSendCode}>
                    <div className={styles.fieldWrap}>
                      <Phone className={styles.fieldIcon} size={20} aria-hidden="true" />
                      <input className={styles.input} type="tel" value={phoneOnly} onChange={(e) => setPhoneOnly(sanitizeText(e.target.value, 24))} placeholder="+7 (___) ___-__-__" aria-label="Телефон для входа по коду" autoComplete="tel" />
                    </div>
                    <button className={styles.primaryButton} type="submit">Получить код</button>
                    <button className={styles.backButton} type="button" onClick={() => { setPhoneLoginMode(false); setOtpStep(false); resetMessages(); }}>
                      <ArrowLeft size={18} aria-hidden="true" />
                      Вернуться
                    </button>
                  </form>
                ) : (
                  <form className={styles.form} onSubmit={handleVerifyOtp}>
                    <input className={`${styles.input} ${styles.otpInput}`} inputMode="numeric" maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} placeholder="0000" aria-label="Код подтверждения" autoComplete="one-time-code" />
                    <button className={styles.primaryButton} type="submit">Подтвердить код</button>
                    <button className={styles.backButton} type="button" onClick={() => { setPhoneLoginMode(false); setOtpStep(false); setOtp(""); resetMessages(); }}>
                      <ArrowLeft size={18} aria-hidden="true" />
                      Вернуться
                    </button>
                  </form>
                )}
              </div>
            ) : null}

            {activeTab === "register" ? (
              <div className={styles.formPanel} key="register">
                <div className={styles.formHeader}>
                  <h2>{accountType === "vendor" ? "Создайте vendor кабинет" : "Создайте аккаунт"}</h2>
                  <p>{accountType === "vendor" ? "После регистрации профиль попадет на проверку администратору" : "Начните организовывать ваш той уже сегодня"}</p>
                </div>
                {message}
                <form className={styles.form} onSubmit={handleRegister}>
                  <div className={styles.fieldWrap}>
                    <User className={styles.fieldIcon} size={20} aria-hidden="true" />
                    <input className={styles.input} type="text" value={name} onChange={(e) => setName(sanitizeText(e.target.value, 80))} placeholder="Ваше имя" aria-label="Имя" autoComplete="name" />
                  </div>

                  <div className={styles.fieldWrap}>
                    <Phone className={styles.fieldIcon} size={20} aria-hidden="true" />
                    <input className={styles.input} type="tel" value={registerPhone} onChange={(e) => setRegisterPhone(sanitizeText(e.target.value, 24))} placeholder="+7 (___) ___-__-__" aria-label="Телефон" autoComplete="tel" />
                  </div>

                  <div className={styles.gridFields}>
                    <div className={styles.fieldWrap}>
                      <MapPin className={styles.fieldIcon} size={19} aria-hidden="true" />
                      <select className={styles.input} value={city} onChange={(e) => setCity(e.target.value)} aria-label="Город">
                        {KZ_CITIES.map((item) => <option key={item} value={item}>{item}</option>)}
                      </select>
                    </div>
                    {accountType === "client" ? (
                      <select className={`${styles.input} ${styles.inputPlain}`} value={eventType} onChange={(e) => setEventType(e.target.value)} aria-label="Тип мероприятия">
                        {EVENT_TYPES.map((item) => <option key={item} value={item}>{item}</option>)}
                      </select>
                    ) : (
                      <select className={`${styles.input} ${styles.inputPlain}`} value={vendorCategory} onChange={(e) => setVendorCategory(e.target.value)} aria-label="Категория услуги">
                        {CATEGORIES.map((item) => <option key={item.id} value={item.name}>{item.name}</option>)}
                      </select>
                    )}
                  </div>

                  {accountType === "vendor" ? (
                    <>
                      <div className={styles.fieldWrap}>
                        <Building2 className={styles.fieldIcon} size={20} aria-hidden="true" />
                        <input className={styles.input} type="text" value={businessName} onChange={(e) => setBusinessName(sanitizeText(e.target.value, 120))} placeholder="Название бизнеса" aria-label="Название бизнеса" />
                      </div>
                      <div className={styles.gridFields}>
                        <input className={`${styles.input} ${styles.inputPlain}`} value={instagram} onChange={(e) => setInstagram(sanitizeText(e.target.value, 80))} placeholder="Instagram optional" aria-label="Instagram" />
                        <input className={`${styles.input} ${styles.inputPlain}`} value={whatsapp} onChange={(e) => setWhatsapp(sanitizeText(e.target.value, 32))} placeholder="WhatsApp optional" aria-label="WhatsApp" />
                      </div>
                    </>
                  ) : null}

                  <PasswordField value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} placeholder="Придумайте пароль" ariaLabel="Придумайте пароль" visible={showRegisterPassword} onToggle={() => setShowRegisterPassword((value) => !value)} autoComplete="new-password" />
                  <PasswordField value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Повторите пароль" ariaLabel="Повторите пароль" visible={showConfirmPassword} onToggle={() => setShowConfirmPassword((value) => !value)} autoComplete="new-password" />

                  <button className={styles.primaryButton} type="submit" disabled={submitting}>
                    {submitting ? "Отправляем..." : accountType === "vendor" ? "Отправить на проверку" : "Зарегистрироваться"}
                  </button>
                </form>
              </div>
            ) : null}

            <button className={styles.adminLink} type="button" onClick={() => router.push("/admin/login")}>
              <ShieldCheck size={16} aria-hidden="true" />
              Админ вход
            </button>

            <div className={styles.features} aria-label="Возможности toi.kz">
              <div className={styles.feature}>
                <span className={styles.featureIcon}><Calendar size={22} aria-hidden="true" /></span>
                <span><span className={styles.featureTitle}>Планируйте</span><span className={styles.featureSubtitle}>все этапы тоя</span></span>
              </div>
              <div className={styles.feature}>
                <span className={styles.featureIcon}><Users size={22} aria-hidden="true" /></span>
                <span><span className={styles.featureTitle}>Приглашайте</span><span className={styles.featureSubtitle}>гостей легко</span></span>
              </div>
              <div className={styles.feature}>
                <span className={styles.featureIcon}><Heart size={22} aria-hidden="true" /></span>
                <span><span className={styles.featureTitle}>Создавайте</span><span className={styles.featureSubtitle}>незабываемые впечатления</span></span>
              </div>
            </div>
          </div>
        </section>
        <footer className={styles.footer}>© 2026 toi.kz — Сделано с любовью в Казахстане ♥</footer>
      </div>
    </main>
  );
}
