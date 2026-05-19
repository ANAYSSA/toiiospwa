"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Calendar,
  Eye,
  EyeOff,
  Heart,
  Lock,
  Phone,
  User,
  Users,
} from "lucide-react";
import styles from "./AuthPage.module.css";

const initialPhone = "";

function isPhoneValid(value) {
  return value.replace(/\D/g, "").length >= 11;
}

function PasswordField({
  value,
  onChange,
  placeholder,
  ariaLabel,
  visible,
  onToggle,
  inputTestId,
  toggleTestId,
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
        data-testid={inputTestId}
        autoComplete={autoComplete}
      />
      <button
        className={styles.iconButton}
        type="button"
        onClick={onToggle}
        aria-label={visible ? "Скрыть пароль" : "Показать пароль"}
        data-testid={toggleTestId}
      >
        {visible ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  );
}

export default function AuthPage({ initialTab = "login" }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [phoneLoginMode, setPhoneLoginMode] = useState(false);
  const [otpStep, setOtpStep] = useState(false);

  const [phone, setPhone] = useState(initialPhone);
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [registerPhone, setRegisterPhone] = useState(initialPhone);
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [phoneOnly, setPhoneOnly] = useState(initialPhone);

  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function flashSuccess(message) {
    setError("");
    setSuccess(message);
  }

  function showError(message) {
    setSuccess("");
    setError(message);
  }

  function resetMessages() {
    setError("");
    setSuccess("");
  }

  function switchTab(tab) {
    setActiveTab(tab);
    setPhoneLoginMode(false);
    setOtpStep(false);
    resetMessages();
  }

  async function handleLogin(e) {
    e.preventDefault();

    if (!phone || !password) {
      setError("Введите телефон и пароль");
      return;
    }

    try {
      console.log({ phone, password });
      // await login({ phone, password });
      setSuccess("Вход выполнен успешно");
      setError("");
    } catch (error) {
      setError("Ошибка входа");
      setSuccess("");
    }
  }

  async function handleRegister(e) {
    e.preventDefault();

    if (!name || !registerPhone || !registerPassword || !confirmPassword) {
      setError("Заполните все поля");
      setSuccess("");
      return;
    }

    if (registerPassword.length < 6) {
      setError("Пароль должен быть минимум 6 символов");
      setSuccess("");
      return;
    }

    if (registerPassword !== confirmPassword) {
      setError("Пароли не совпадают");
      setSuccess("");
      return;
    }

    try {
      console.log({ name, phone: registerPhone, password: registerPassword });
      // await register({ name, phone, password });
      setSuccess("Регистрация успешно завершена");
      setError("");
    } catch (error) {
      setError("Ошибка регистрации");
      setSuccess("");
    }
  }

  function handleSendCode(e) {
    e.preventDefault();

    if (!phoneOnly || !isPhoneValid(phoneOnly)) {
      showError("Введите корректный номер телефона");
      return;
    }

    console.log({ phone: phoneOnly });
    setOtpStep(true);
    flashSuccess("Код отправлен");
  }

  function handleVerifyOtp(e) {
    e.preventDefault();

    if (!otp || !/^\d{4,6}$/.test(otp)) {
      showError("Введите код подтверждения");
      return;
    }

    console.log({ phone: phoneOnly, otp });
    flashSuccess("Вы успешно вошли");
  }

  function handleForgotPassword() {
    flashSuccess("Функция восстановления пароля скоро будет доступна");
  }

  const message = (
    <div
      className={styles.message}
      role="status"
      aria-live="polite"
      data-testid="auth-message"
    >
      {error ? (
        <div className={`${styles.alert} ${styles.error}`}>{error}</div>
      ) : null}
      {success ? (
        <div className={`${styles.alert} ${styles.success}`}>{success}</div>
      ) : null}
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
              <button
                className={`${styles.tab} ${activeTab === "login" ? styles.tabActive : ""}`}
                type="button"
                role="tab"
                aria-selected={activeTab === "login"}
                data-testid="tab-login"
                onClick={() => switchTab("login")}
              >
                Вход
              </button>
              <button
                className={`${styles.tab} ${activeTab === "register" ? styles.tabActive : ""}`}
                type="button"
                role="tab"
                aria-selected={activeTab === "register"}
                data-testid="tab-register"
                onClick={() => switchTab("register")}
              >
                Регистрация
              </button>
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
                    <input
                      className={styles.input}
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+7 (___) ___-__-__"
                      aria-label="Телефон"
                      data-testid="login-phone"
                      autoComplete="tel"
                    />
                  </div>

                  <PasswordField
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Пароль"
                    ariaLabel="Пароль"
                    visible={showLoginPassword}
                    onToggle={() => setShowLoginPassword((value) => !value)}
                    inputTestId="login-password"
                    toggleTestId="login-password-toggle"
                  />

                  <div className={styles.rowEnd}>
                    <button
                      className={styles.linkButton}
                      type="button"
                      data-testid="forgot-password"
                      onClick={handleForgotPassword}
                    >
                      Забыли пароль?
                    </button>
                  </div>

                  <button className={styles.primaryButton} type="submit" data-testid="login-submit">
                    Войти
                  </button>

                  <div className={styles.divider}>или</div>

                  <button
                    className={styles.secondaryButton}
                    type="button"
                    data-testid="phone-login-open"
                    onClick={() => {
                      setPhoneLoginMode(true);
                      resetMessages();
                    }}
                  >
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
                      <input
                        className={styles.input}
                        type="tel"
                        value={phoneOnly}
                        onChange={(e) => setPhoneOnly(e.target.value)}
                        placeholder="+7 (___) ___-__-__"
                        aria-label="Телефон для входа по коду"
                        data-testid="phone-login-phone"
                        autoComplete="tel"
                      />
                    </div>
                    <button className={styles.primaryButton} type="submit" data-testid="send-code">
                      Получить код
                    </button>
                    <button
                      className={styles.backButton}
                      type="button"
                      data-testid="phone-login-back"
                      onClick={() => {
                        setPhoneLoginMode(false);
                        setOtpStep(false);
                        resetMessages();
                      }}
                    >
                      <ArrowLeft size={18} aria-hidden="true" />
                      Вернуться
                    </button>
                  </form>
                ) : (
                  <form className={styles.form} onSubmit={handleVerifyOtp}>
                    <input
                      className={`${styles.input} ${styles.otpInput}`}
                      inputMode="numeric"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                      placeholder="0000"
                      aria-label="Код подтверждения"
                      data-testid="otp-code"
                      autoComplete="one-time-code"
                    />
                    <button className={styles.primaryButton} type="submit" data-testid="verify-code">
                      Подтвердить код
                    </button>
                    <button
                      className={styles.backButton}
                      type="button"
                      data-testid="phone-login-back"
                      onClick={() => {
                        setPhoneLoginMode(false);
                        setOtpStep(false);
                        setOtp("");
                        resetMessages();
                      }}
                    >
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
                  <h2>Создайте аккаунт</h2>
                  <p>Начните организовывать ваш той уже сегодня</p>
                </div>
                {message}
                <form className={styles.form} onSubmit={handleRegister}>
                  <div className={styles.fieldWrap}>
                    <User className={styles.fieldIcon} size={20} aria-hidden="true" />
                    <input
                      className={styles.input}
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ваше имя"
                      aria-label="Имя"
                      data-testid="register-name"
                      autoComplete="name"
                    />
                  </div>

                  <div className={styles.fieldWrap}>
                    <Phone className={styles.fieldIcon} size={20} aria-hidden="true" />
                    <input
                      className={styles.input}
                      type="tel"
                      value={registerPhone}
                      onChange={(e) => setRegisterPhone(e.target.value)}
                      placeholder="+7 (___) ___-__-__"
                      aria-label="Телефон"
                      data-testid="register-phone"
                      autoComplete="tel"
                    />
                  </div>

                  <PasswordField
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    placeholder="Придумайте пароль"
                    ariaLabel="Придумайте пароль"
                    visible={showRegisterPassword}
                    onToggle={() => setShowRegisterPassword((value) => !value)}
                    inputTestId="register-password"
                    toggleTestId="register-password-toggle"
                    autoComplete="new-password"
                  />

                  <PasswordField
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Повторите пароль"
                    ariaLabel="Повторите пароль"
                    visible={showConfirmPassword}
                    onToggle={() => setShowConfirmPassword((value) => !value)}
                    inputTestId="register-confirm-password"
                    toggleTestId="register-confirm-password-toggle"
                    autoComplete="new-password"
                  />

                  <button
                    className={styles.primaryButton}
                    type="submit"
                    data-testid="register-submit"
                  >
                    Зарегистрироваться
                  </button>
                </form>
              </div>
            ) : null}

            <div className={styles.features} aria-label="Возможности toi.kz">
              <div className={styles.feature}>
                <span className={styles.featureIcon}>
                  <Calendar size={22} aria-hidden="true" />
                </span>
                <span>
                  <span className={styles.featureTitle}>Планируйте</span>
                  <span className={styles.featureSubtitle}>все этапы тоя</span>
                </span>
              </div>
              <div className={styles.feature}>
                <span className={styles.featureIcon}>
                  <Users size={22} aria-hidden="true" />
                </span>
                <span>
                  <span className={styles.featureTitle}>Приглашайте</span>
                  <span className={styles.featureSubtitle}>гостей легко</span>
                </span>
              </div>
              <div className={styles.feature}>
                <span className={styles.featureIcon}>
                  <Heart size={22} aria-hidden="true" />
                </span>
                <span>
                  <span className={styles.featureTitle}>Создавайте</span>
                  <span className={styles.featureSubtitle}>незабываемые впечатления</span>
                </span>
              </div>
            </div>
          </div>
        </section>
        <footer className={styles.footer}>
          © 2026 toi.kz — Сделано с любовью в Казахстане ♥
        </footer>
      </div>
    </main>
  );
}
