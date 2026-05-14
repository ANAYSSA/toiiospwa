"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { useToast, ToastProvider } from "@/components/Toast";
import Link from "next/link";

function LoginInner() {
  const router = useRouter();
  const showToast = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) router.replace("/menu/home");
      else setCheckingAuth(false);
    });
    return () => unsub();
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      showToast("Заполните все поля");
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      router.replace("/menu/home");
    } catch (err) {
      let msg = "Ошибка входа";
      if (err.code === "auth/user-not-found") msg = "Пользователь не найден";
      else if (err.code === "auth/wrong-password") msg = "Неверный пароль";
      else if (err.code === "auth/invalid-email") msg = "Некорректный email";
      showToast(msg);
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div style={{ height: "100vh", background: "#0A0A0A", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span className="spinner" />
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100dvh",
      background: "#0A0A0A",
      backgroundImage: "url('https://www.transparenttextures.com/patterns/dark-matter.png')",
      paddingTop: "calc(60px + env(safe-area-inset-top))",
      paddingLeft: 24,
      paddingRight: 24,
      position: "relative",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    }}>
      <div className="top-glow" />

      <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
        <img 
          src="/icons/logo.png" 
          alt="toi.kz" 
          style={{ width: 80, height: 80, borderRadius: 20, marginBottom: 20, boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }} 
        />
        <h1 style={{ color: "#FFFBEB", fontSize: 32, fontWeight: 900, margin: 0, letterSpacing: "-0.02em" }}>
          toi.kz
        </h1>
        <p style={{ color: "#A87935", fontSize: 15, marginTop: 8, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em" }}>
          Премиум сервис для вашего тоя
        </p>
      </div>

      <form onSubmit={handleLogin} style={{ width: "100%", maxWidth: 380, marginTop: 40, position: "relative", zIndex: 1 }}>
        <div style={{ position: "relative", marginBottom: 16 }}>
          <input
            className="input-gold"
            placeholder="Ваш Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoCapitalize="none"
          />
        </div>
        
        <div style={{ position: "relative", marginBottom: 12 }}>
          <input
            className="input-gold"
            placeholder="Пароль"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div style={{ textAlign: "right", marginBottom: 24 }}>
          <Link href="/forgot-password" style={{ color: "#A87935", fontSize: 14, textDecoration: "none", fontWeight: 600 }}>
            Забыли пароль?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            height: 58,
            background: "linear-gradient(135deg, #A87935, #800020)",
            color: "#FFFBEB",
            fontWeight: 800,
            border: "none",
            borderRadius: 16,
            fontSize: 16,
            cursor: "pointer",
            boxShadow: "0 10px 25px rgba(128,0,32,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {loading ? <span className="spinner" style={{ width: 20, height: 20 }} /> : "Войти в систему"}
        </button>

        <div style={{ textAlign: "center", marginTop: 32 }}>
          <span style={{ color: "#777", fontSize: 14 }}>Ещё нет аккаунта? </span>
          <Link href="/register" style={{ color: "#FFFBEB", fontWeight: 700, fontSize: 14, textDecoration: "none", borderBottom: "1px solid #A87935" }}>
            Создать аккаунт
          </Link>
        </div>
      </form>

      <div style={{ marginTop: "auto", paddingBottom: 30, textAlign: "center", opacity: 0.5, fontSize: 11, color: "#888" }}>
        © 2026 toi.kz • Сделано с любовью в Казахстане
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
