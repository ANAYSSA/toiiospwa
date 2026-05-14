"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";
import { useToast, ToastProvider } from "@/components/Toast";
import Link from "next/link";

function RegisterInner() {
  const router = useRouter();
  const showToast = useToast();
  
  const [form, setForm] = useState({
    name: "",
    surname: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!form.name || !form.surname || !form.email || !form.phone || !form.password) {
      showToast("Заполните все поля");
      return;
    }
    if (form.password !== form.confirmPassword) {
      showToast("Пароли не совпадают");
      return;
    }
    if (form.password.length < 6) {
      showToast("Пароль должен быть не менее 6 символов");
      return;
    }

    setLoading(true);
    try {
      const res = await createUserWithEmailAndPassword(auth, form.email.trim(), form.password);
      const user = res.user;

      await set(ref(db, "Users/" + user.uid), {
        uid: user.uid,
        name: form.name,
        surname: form.surname,
        email: form.email,
        phoneNumber: form.phone,
        city: "Астана", // По умолчанию
      });

      showToast("Аккаунт создан!");
      router.replace("/menu/home");
    } catch (err) {
      let msg = "Ошибка регистрации";
      if (err.code === "auth/email-already-in-use") msg = "Этот email уже занят";
      else if (err.code === "auth/invalid-email") msg = "Некорректный email";
      showToast(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100dvh",
      background: "#0A0A0A",
      backgroundImage: "url('https://www.transparenttextures.com/patterns/dark-matter.png')",
      paddingTop: "calc(40px + env(safe-area-inset-top))",
      paddingLeft: 24,
      paddingRight: 24,
      paddingBottom: "calc(40px + env(safe-area-inset-bottom))",
      position: "relative",
    }}>
      <div className="top-glow" />

      <Link href="/" style={{ 
        display: "inline-flex", alignItems: "center", gap: 8, color: "#A87935", 
        textDecoration: "none", fontSize: 15, fontWeight: 600, marginBottom: 30, position: "relative", zIndex: 1 
      }}>
        ← Назад к логину
      </Link>

      <div style={{ position: "relative", zIndex: 1 }}>
        <h1 style={{ color: "#FFFBEB", fontSize: 30, fontWeight: 900, margin: 0 }}>Создание аккаунта</h1>
        <p style={{ color: "#888", fontSize: 14, marginTop: 8 }}>Станьте частью сообщества toi.kz</p>
      </div>

      <form onSubmit={handleRegister} style={{ marginTop: 32, maxWidth: 400, position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
          <input className="input-gold" placeholder="Имя" name="name" value={form.name} onChange={handleChange} />
          <input className="input-gold" placeholder="Фамилия" name="surname" value={form.surname} onChange={handleChange} />
        </div>

        <input className="input-gold" placeholder="Email" type="email" name="email" value={form.email} onChange={handleChange} style={{ marginBottom: 12 }} />
        
        <input className="input-gold" placeholder="Номер телефона (7707...)" type="tel" name="phone" value={form.phone} onChange={handleChange} style={{ marginBottom: 12 }} />
        
        <input className="input-gold" placeholder="Пароль" type="password" name="password" value={form.password} onChange={handleChange} style={{ marginBottom: 12 }} />
        
        <input className="input-gold" placeholder="Подтвердите пароль" type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} style={{ marginBottom: 24 }} />

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
            boxShadow: "0 10px 25px rgba(128,0,32,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer"
          }}
        >
          {loading ? <span className="spinner" style={{ width: 20, height: 20 }} /> : "Зарегистрироваться"}
        </button>

        <p style={{ textAlign: "center", marginTop: 20, color: "#666", fontSize: 12, lineHeight: 1.5 }}>
          Нажимая «Зарегистрироваться», вы соглашаетесь с условиями использования и политикой конфиденциальности toi.kz
        </p>
      </form>
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
