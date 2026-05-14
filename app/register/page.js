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
  const [form, setForm] = useState({ email: "", password: "", confirmPassword: "", name: "", surname: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    const { email, password, confirmPassword, name, surname, phone } = form;
    if (!email.trim() || !password.trim() || !name.trim() || !surname.trim() || !phone.trim()) {
      showToast("Пожалуйста, заполните все поля");
      return;
    }
    if (password.length < 6) {
      showToast("Пароль должен быть не менее 6 символов");
      return;
    }
    if (password !== confirmPassword) {
      showToast("Пароли не совпадают");
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
        createdAt: new Date().toISOString(),
      });

      showToast("Аккаунт успешно создан!");
      router.replace("/menu/home");
    } catch (err) {
      const code = err.code || "";
      if (code === "auth/email-already-in-use") {
        showToast("Этот email уже зарегистрирован");
      } else if (code === "auth/invalid-email") {
        showToast("Некорректный формат email");
      } else if (code === "auth/weak-password") {
        showToast("Слишком простой пароль");
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
      <div style={{ position: "relative", zIndex: 1, width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <img src="/icons/logo.png" alt="toi.kz" style={{ width: 64, height: 64, borderRadius: 14, marginBottom: 10 }} />
        <div className="brand-tag">✦ &nbsp;toi.kz&nbsp; ✦</div>
        <h1 className="welcome-title" style={{ fontSize: 36, marginTop: 8, marginBottom: 4, textAlign: "center" }}>
          Регистрация
        </h1>
        <p className="subtitle" style={{ maxWidth: 300, marginTop: 4 }}>
          Создайте аккаунт и начните организовывать ваш той
        </p>

        <form onSubmit={handleRegister} style={{ width: "100%", maxWidth: 380, marginTop: 28 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <input className="input-gold" placeholder="Имя" value={form.name} onChange={update("name")} autoComplete="given-name" />
            <input className="input-gold" placeholder="Фамилия" value={form.surname} onChange={update("surname")} autoComplete="family-name" />
          </div>
          <div style={{ height: 10 }} />
          <input className="input-gold" placeholder="Email" type="email" value={form.email} onChange={update("email")} autoCapitalize="none" autoComplete="email" />
          <div style={{ height: 10 }} />
          <input className="input-gold" placeholder="Телефон +7 (___) ___-__-__" type="tel" value={form.phone} onChange={update("phone")} autoComplete="tel" />
          <div style={{ height: 10 }} />
          <div style={{ position: "relative" }}>
            <input
              className="input-gold"
              placeholder="Пароль"
              type={showPwd ? "text" : "password"}
              value={form.password}
              onChange={update("password")}
              autoComplete="new-password"
              style={{ paddingRight: 50 }}
            />
            <button
              type="button"
              onClick={() => setShowPwd(!showPwd)}
              style={{
                position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                background: "transparent", border: "none", color: "#A87935", fontSize: 13, cursor: "pointer", padding: 0,
              }}
            >
              {showPwd ? "Скрыть" : "Показать"}
            </button>
          </div>
          <div style={{ height: 10 }} />
          <input
            className="input-gold"
            placeholder="Подтвердите пароль"
            type={showPwd ? "text" : "password"}
            value={form.confirmPassword}
            onChange={update("confirmPassword")}
            autoComplete="new-password"
          />

          <button
            type="submit"
            disabled={loading}
            className="btn-wine"
            style={{
              width: "100%", maxWidth: 260, display: "flex", alignItems: "center", justifyContent: "center",
              margin: "24px auto 0", height: 54, opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? <span className="spinner" /> : "Зарегистрироваться"}
          </button>
        </form>

        <div style={{ marginTop: 16, color: "#A87935", fontSize: 13, textAlign: "center" }}>
          Уже есть аккаунт?{" "}
          <button onClick={() => router.push("/")} style={{ background: "transparent", border: "none", color: "#C9A96E", textDecoration: "underline", cursor: "pointer", fontSize: 13 }}>
            Войти
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
