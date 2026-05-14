"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { useToast, ToastProvider } from "@/components/Toast";

function ForgotInner() {
  const router = useRouter();
  const showToast = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      showToast("Введите ваш Email");
      return;
    }
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setSent(true);
      showToast("Инструкции отправлены! Проверьте почту и Спам.");
    } catch (err) {
      const code = err.code || "";
      if (code === "auth/user-not-found") {
        showToast("Пользователь с таким email не найден");
      } else if (code === "auth/invalid-email") {
        showToast("Некорректный формат email");
      } else {
        showToast("Ошибка: " + (err.message || code));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100dvh",
      background: "#0A0A0A",
      paddingTop: "calc(20px + env(safe-area-inset-top))",
      paddingLeft: "max(24px, env(safe-area-inset-left))",
      paddingRight: "max(24px, env(safe-area-inset-right))",
      paddingBottom: "calc(24px + env(safe-area-inset-bottom))",
      position: "relative",
    }}>
      <div className="top-glow" />

      <button
        onClick={() => router.back()}
        style={{
          background: "transparent",
          border: "none",
          color: "#C9A96E",
          cursor: "pointer",
          fontSize: 15,
          padding: 0,
          position: "relative",
          zIndex: 1,
        }}
      >
        ← Назад
      </button>

      <div style={{ marginTop: 50, position: "relative", zIndex: 1, textAlign: "center" }}>
        <img src="/icons/logo.png" alt="toi.kz" style={{ width: 56, height: 56, borderRadius: 12, marginBottom: 16 }} />

        <h1 style={{ color: "#FFFBEB", fontSize: 28, fontWeight: 600, margin: 0 }}>
          Восстановление пароля
        </h1>
        <p style={{ color: "#7A5A28", fontSize: 14, marginTop: 8, lineHeight: 1.5 }}>
          Введите email, указанный при регистрации. Мы отправим ссылку для сброса пароля.
        </p>

        {sent ? (
          <div style={{
            marginTop: 32,
            background: "rgba(76, 175, 80, 0.1)",
            border: "1px solid rgba(76, 175, 80, 0.3)",
            borderRadius: 12,
            padding: 20,
          }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>✉️</div>
            <div style={{ color: "#4CAF50", fontWeight: 600, fontSize: 16 }}>Письмо отправлено!</div>
            <div style={{ color: "#7A5A28", fontSize: 13, marginTop: 8, lineHeight: 1.5 }}>
              Проверьте вашу почту и папку «Спам». Перейдите по ссылке в письме для сброса пароля.
            </div>
            <button
              onClick={() => router.replace("/")}
              className="btn-wine"
              style={{ width: "100%", maxWidth: 240, height: 48, marginTop: 20 }}
            >
              Вернуться ко входу
            </button>
          </div>
        ) : (
          <form onSubmit={handleSend} style={{ marginTop: 32, maxWidth: 380, marginLeft: "auto", marginRight: "auto" }}>
            <input
              className="input-gold"
              placeholder="Введите ваш Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoCapitalize="none"
              autoComplete="email"
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                height: 54,
                marginTop: 20,
                background: "linear-gradient(135deg, #A87935, #C9A96E)",
                color: "#0A0A0A",
                fontWeight: 700,
                border: "none",
                borderRadius: 12,
                fontSize: 15,
                letterSpacing: "0.03em",
                cursor: "pointer",
                opacity: loading ? 0.7 : 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {loading ? <span className="spinner" style={{ borderTopColor: "#0A0A0A", borderColor: "rgba(0,0,0,0.3)" }} /> : "Отправить ссылку"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <ToastProvider>
      <ForgotInner />
    </ToastProvider>
  );
}
