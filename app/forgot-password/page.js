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

  const handleSend = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      showToast("Введите ваш Email");
      return;
    }
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      showToast("Инструкции отправлены! Проверьте почту и Спам.");
      setTimeout(() => router.replace("/"), 1500);
    } catch (err) {
      showToast("Ошибка: " + (err.message || err.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100dvh",
      background: "#0A0A0A",
      paddingTop: "calc(30px + env(safe-area-inset-top))",
      paddingLeft: "max(24px, env(safe-area-inset-left))",
      paddingRight: "max(24px, env(safe-area-inset-right))",
      paddingBottom: "calc(24px + env(safe-area-inset-bottom))",
      position: "relative",
    }}>
      <button
        onClick={() => router.back()}
        style={{ background: "transparent", border: "none", color: "#8E8E93", cursor: "pointer", fontSize: 15, padding: 0 }}
      >
        ← Назад
      </button>

      <div style={{ marginTop: 70 }}>
        <h1 style={{ color: "#FFFBEB", fontSize: 32, fontWeight: 500, textAlign: "center", margin: 0 }}>
          Восстановление
        </h1>

        <form onSubmit={handleSend} style={{ marginTop: 40 }}>
          <input
            className="input-gold"
            placeholder="Введите ваш Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoCapitalize="none"
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              height: 60,
              marginTop: 24,
              background: "#C9A96E",
              color: "#0A0A0A",
              fontWeight: 700,
              border: "none",
              borderRadius: 12,
              fontSize: 15,
              letterSpacing: "0.05em",
              cursor: "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? <span className="spinner" style={{ borderTopColor: "#0A0A0A", borderColor: "rgba(0,0,0,0.3)" }} /> : "ОТПРАВИТЬ ССЫЛКУ"}
          </button>
        </form>
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
