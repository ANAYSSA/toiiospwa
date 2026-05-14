"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { useToast, ToastProvider } from "@/components/Toast";

function LoginInner() {
  const router = useRouter();
  const showToast = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [showPwd, setShowPwd] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace("/menu/home");
      } else {
        setChecking(false);
      }
    });
    return () => unsub();
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      showToast("Введите email и пароль");
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password.trim());
      router.replace("/menu/home");
    } catch (err) {
      const code = err.code || "";
      if (code === "auth/user-not-found" || code === "auth/invalid-credential") {
        showToast("Неверный email или пароль");
      } else if (code === "auth/invalid-email") {
        showToast("Некорректный формат email");
      } else if (code === "auth/too-many-requests") {
        showToast("Слишком много попыток. Попробуйте позже");
      } else {
        showToast("Ошибка входа: " + (err.message || code));
      }
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100dvh", background: "#0A0A0A" }}>
        <span className="spinner" style={{ width: 30, height: 30, borderWidth: 3 }} />
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="top-glow" />
      <div style={{ position: "relative", zIndex: 1, width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
        {/* Logo */}
        <img
          src="/icons/logo.png"
          alt="toi.kz"
          style={{ width: 72, height: 72, borderRadius: 16, marginBottom: 12 }}
        />
        <div className="brand-tag">✦ &nbsp;toi.kz&nbsp; ✦</div>
        <h1
          className="welcome-title"
          style={{ marginTop: 10, marginBottom: 4, textAlign: "center" }}
        >
          Добро пожаловать
        </h1>
        <p className="subtitle" style={{ maxWidth: 300, marginTop: 6 }}>
          Войдите, чтобы организовать незабываемый той
        </p>

        {/* Form */}
        <form
          onSubmit={handleLogin}
          style={{ width: "100%", maxWidth: 380, marginTop: 36 }}
        >
          <input
            className="input-gold"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoCapitalize="none"
            autoComplete="email"
          />
          <div style={{ height: 12 }} />
          <div style={{ position: "relative" }}>
            <input
              className="input-gold"
              placeholder="Пароль"
              type={showPwd ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              style={{ paddingRight: 50 }}
            />
            <button
              type="button"
              onClick={() => setShowPwd(!showPwd)}
              style={{
                position: "absolute",
                right: 14,
                top: "50%",
                transform: "translateY(-50%)",
                background: "transparent",
                border: "none",
                color: "#A87935",
                fontSize: 13,
                cursor: "pointer",
                padding: 0,
              }}
            >
              {showPwd ? "Скрыть" : "Показать"}
            </button>
          </div>

          {/* Forgot password */}
          <div style={{ textAlign: "right", marginTop: 10 }}>
            <button
              type="button"
              onClick={() => router.push("/forgot-password")}
              style={{
                background: "transparent",
                border: "none",
                color: "#C9A96E",
                fontSize: 13,
                cursor: "pointer",
                padding: 0,
              }}
            >
              Забыли пароль?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-wine"
            style={{
              width: "100%",
              maxWidth: 280,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "24px auto 0",
              height: 54,
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? (
              <span className="spinner" />
            ) : (
              "Войти"
            )}
          </button>
        </form>

        {/* Divider */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          width: "100%",
          maxWidth: 380,
          margin: "24px 0 20px",
        }}>
          <div style={{ flex: 1, height: 1, background: "rgba(168,121,53,0.25)" }} />
          <span style={{ color: "#7A5A28", fontSize: 12 }}>или</span>
          <div style={{ flex: 1, height: 1, background: "rgba(168,121,53,0.25)" }} />
        </div>

        {/* Register link */}
        <button
          onClick={() => router.push("/register")}
          className="btn-gold-outline"
          style={{
            width: "100%",
            maxWidth: 280,
            height: 50,
          }}
        >
          Создать аккаунт
        </button>

        <div style={{ marginTop: 32, color: "#555", fontSize: 11, textAlign: "center" }}>
          toi.kz · v1.0
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <ToastProvider>
      <LoginInner />
    </ToastProvider>
  );
}
