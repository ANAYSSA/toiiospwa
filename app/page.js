"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { useToast, ToastProvider } from "@/components/Toast";

function LoginInner() {
  const router = useRouter();
  const showToast = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) router.replace("/menu/home");
    });
    return () => unsub();
  }, [router]);

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      showToast("Пожалуйста, заполните все поля");
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password.trim());
      showToast("Успешный вход!");
      router.replace("/menu/home");
    } catch (err) {
      const code = err.code || "";
      if (code === "auth/user-not-found" || code === "auth/invalid-credential") {
        showToast("Такого логина не существует. Создайте аккаунт.");
      } else if (code === "auth/wrong-password") {
        showToast("Неверный пароль");
      } else {
        showToast("Ошибка: " + (err.message || code));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="top-glow" />
      <div style={{ position: "relative", zIndex: 1, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
        <img
          src="/icons/logo.png"
          alt="ТОЙХАНА"
          style={{ width: 72, height: 72, borderRadius: 16, marginBottom: 12 }}
        />

        <div className="brand-tag">✦ &nbsp;ТОЙХАНА&nbsp; ✦</div>

        <h1 className="welcome-title" style={{ marginTop: 8, marginBottom: 6 }}>Welcome</h1>
        <p className="subtitle" style={{ maxWidth: 320 }}>
          Let&apos;s make your dream wedding happen together
        </p>

        <form onSubmit={handleSignIn} style={{ width: "100%", maxWidth: 380, marginTop: 36 }}>
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-gold"
            autoCapitalize="none"
            autoComplete="email"
          />
          <div style={{ height: 12 }} />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-gold"
            autoComplete="current-password"
          />

          <div style={{ textAlign: "center", marginTop: 6 }}>
            <button
              type="button"
              onClick={() => router.push("/forgot-password")}
              style={{
                background: "transparent",
                border: "none",
                color: "#FFFBEB",
                opacity: 0.6,
                fontSize: 13,
                cursor: "pointer",
                padding: "8px",
              }}
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-wine"
            style={{ width: "100%", maxWidth: 260, display: "block", margin: "10px auto 0", height: 54, opacity: loading ? 0.7 : 1 }}
          >
            {loading ? <span className="spinner" /> : "Sign in"}
          </button>
        </form>

        <div style={{ marginTop: 24, color: "rgba(255,255,255,0.23)", letterSpacing: "0.2em", fontSize: 12 }}>
          — OR —
        </div>

        <button
          onClick={() => router.push("/register")}
          className="btn-gold-outline"
          style={{ marginTop: 14, width: "100%", maxWidth: 260, height: 52 }}
        >
          ✚ Create an account
        </button>

        <button
          onClick={() => showToast("Вход по телефону скоро будет доступен")}
          className="btn-gold-outline"
          style={{ marginTop: 10, width: "100%", maxWidth: 260, height: 52 }}
        >
          📱 Sign in with phone
        </button>

        <div style={{ flex: 1, minHeight: 32 }} />
        <p style={{ color: "rgba(255,255,255,0.13)", letterSpacing: "0.05em", fontSize: 12, marginTop: 32, textAlign: "center" }}>
          — Don&apos;t have an account yet —
        </p>
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
