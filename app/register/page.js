"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";
import { useToast, ToastProvider } from "@/components/Toast";

function RegisterInner() {
  const router = useRouter();
  const showToast = useToast();
  const [form, setForm] = useState({ email: "", password: "", name: "", surname: "", phone: "" });
  const [loading, setLoading] = useState(false);

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    const { email, password, name, surname, phone } = form;
    if (!email.trim() || !password.trim() || !name.trim() || !surname.trim() || !phone.trim()) {
      showToast("Пожалуйста, заполните все поля");
      return;
    }
    if (password.length < 6) {
      showToast("Пароль должен быть не менее 6 символов");
      return;
    }
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password.trim());
      const uid = cred.user.uid;
      const cleanPhone = phone.replace(/[^0-9]/g, "");
      const phoneNum = cleanPhone ? Number(cleanPhone) : 0;

      await set(ref(db, "Users/" + uid), {
        name: name.trim(),
        surname: surname.trim(),
        email: email.trim(),
        phoneNumber: phoneNum,
      });

      showToast("Аккаунт успешно создан!");
      router.replace("/menu/home");
    } catch (err) {
      showToast("Ошибка регистрации: " + (err.message || err.code || "неизвестно"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="top-glow" />
      <div style={{ position: "relative", zIndex: 1, width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <img src="/icons/logo.png" alt="ТОЙХАНА" style={{ width: 64, height: 64, borderRadius: 14, marginBottom: 10 }} />
        <div className="brand-tag">✦ &nbsp;ТОЙХАНА&nbsp; ✦</div>
        <h1 className="welcome-title" style={{ fontSize: 40, marginTop: 8, marginBottom: 6 }}>Create Account</h1>
        <p className="subtitle">Join us on your special journey</p>

        <form onSubmit={handleRegister} style={{ width: "100%", maxWidth: 380, marginTop: 36 }}>
          <input className="input-gold" placeholder="E-mail" type="email" value={form.email} onChange={update("email")} autoCapitalize="none" />
          <div style={{ height: 12 }} />
          <input className="input-gold" placeholder="Password" type="password" value={form.password} onChange={update("password")} />
          <div style={{ height: 12 }} />
          <input className="input-gold" placeholder="Name" value={form.name} onChange={update("name")} />
          <div style={{ height: 12 }} />
          <input className="input-gold" placeholder="Surname" value={form.surname} onChange={update("surname")} />
          <div style={{ height: 12 }} />
          <input className="input-gold" placeholder="+7 (999) 999-99-99" type="tel" value={form.phone} onChange={update("phone")} />

          <button
            type="submit"
            disabled={loading}
            className="btn-wine"
            style={{ width: "100%", maxWidth: 260, display: "block", margin: "30px auto 0", height: 54, opacity: loading ? 0.7 : 1 }}
          >
            {loading ? <span className="spinner" /> : "Create Account"}
          </button>
        </form>

        <div style={{ marginTop: 16, color: "#A87935", fontSize: 13, textAlign: "center" }}>
          Already have an account?{" "}
          <button onClick={() => router.push("/")} style={{ background: "transparent", border: "none", color: "#C9A96E", textDecoration: "underline", cursor: "pointer", fontSize: 13 }}>
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <ToastProvider>
      <RegisterInner />
    </ToastProvider>
  );
}
