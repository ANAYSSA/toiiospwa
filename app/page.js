"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber, onAuthStateChanged } from "firebase/auth";
import { ref, get, set } from "firebase/database";
import { useToast, ToastProvider } from "@/components/Toast";
import Link from "next/link";

function LoginInner() {
  const router = useRouter();
  const showToast = useToast();
  const [phone, setPhone] = useState("+7");
  const [code, setCode] = useState("");
  const [step, setStep] = useState(1); 
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [newUserForm, setNewUserForm] = useState({ name: "", surname: "" });
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user && step === 1) {
        const snap = await get(ref(db, "Users/" + user.uid));
        if (snap.exists() && snap.val().name) {
          router.replace("/menu/home");
        } else {
          setCurrentUser(user);
          setStep(3);
          setCheckingAuth(false);
        }
      } else {
        setCheckingAuth(false);
      }
    });
    return () => unsub();
  }, [router, step]);

  useEffect(() => {
    // Only init Recaptcha when the container is in the DOM
    if (!checkingAuth && step === 1 && !window.recaptchaVerifier) {
      setTimeout(() => {
        try {
          window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
            'size': 'invisible'
          });
        } catch(e) {
          console.error("Recaptcha error:", e);
        }
      }, 100);
    }
  }, [checkingAuth, step]);

  const handleSendSMS = async (e) => {
    e.preventDefault();
    if (phone.length < 11) {
      showToast("Введите корректный номер");
      return;
    }
    setLoading(true);
    try {
      const confirmation = await signInWithPhoneNumber(auth, phone, window.recaptchaVerifier);
      setConfirmationResult(confirmation);
      setStep(2);
      showToast("СМС отправлено!");
    } catch (err) {
      console.error(err);
      showToast("Ошибка отправки: " + err.message);
      if (window.recaptchaVerifier) window.recaptchaVerifier.render().then(id => window.grecaptcha.reset(id));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (code.length < 6) {
      showToast("Введите код");
      return;
    }
    setLoading(true);
    try {
      const result = await confirmationResult.confirm(code);
      const user = result.user;
      const snap = await get(ref(db, "Users/" + user.uid));
      if (!snap.exists() || !snap.val().name) {
        setCurrentUser(user);
        setStep(3); 
      } else {
        router.replace("/menu/home");
      }
    } catch (err) {
      console.error(err);
      showToast("Неверный код");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!newUserForm.name || !newUserForm.surname) {
      showToast("Заполните все поля");
      return;
    }
    setLoading(true);
    try {
      await set(ref(db, "Users/" + currentUser.uid), {
        uid: currentUser.uid,
        name: newUserForm.name,
        surname: newUserForm.surname,
        phoneNumber: currentUser.phoneNumber,
        city: "Астана"
      });
      router.replace("/menu/home");
    } catch (err) {
      showToast("Ошибка сохранения");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100dvh",
      background: "#0A0A0A",
      backgroundImage: "url('https://www.transparenttextures.com/patterns/dark-matter.png')",
      paddingTop: "calc(60px + env(safe-area-inset-top))",
      paddingLeft: 24, paddingRight: 24,
      position: "relative",
      display: "flex", flexDirection: "column", alignItems: "center",
      transition: "opacity 0.3s ease",
      opacity: checkingAuth ? 0 : 1 // Плавный переход вместо экрана загрузки
    }}>
      <div className="top-glow" />

      <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
        <img src="/icons/logo.png" alt="toi.kz" style={{ width: 80, height: 80, borderRadius: 20, marginBottom: 20, boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }} />
        <h1 style={{ color: "#FFFBEB", fontSize: 32, fontWeight: 900, margin: 0, letterSpacing: "-0.02em" }}>toi.kz</h1>
        <p style={{ color: "#A87935", fontSize: 15, marginTop: 8, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em" }}>
          Премиум сервис для вашего тоя
        </p>
      </div>

      <div style={{ width: "100%", maxWidth: 380, marginTop: 40, position: "relative", zIndex: 1 }}>
        <div id="recaptcha-container"></div>
        
        {step === 1 && (
          <form onSubmit={handleSendSMS}>
            <div style={{ marginBottom: 24 }}>
              <input className="input-gold" placeholder="Номер телефона (+7...)" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <button type="submit" disabled={loading} style={btnStyle}>
              {loading ? <span className="spinner" /> : "Получить СМС код"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyCode}>
            <div style={{ color: "#888", marginBottom: 16, textAlign: "center", fontSize: 14 }}>
              СМС отправлено на {phone}
            </div>
            <div style={{ marginBottom: 24 }}>
              <input className="input-gold" placeholder="Код из СМС" type="number" value={code} onChange={(e) => setCode(e.target.value)} autoFocus />
            </div>
            <button type="submit" disabled={loading} style={btnStyle}>
              {loading ? <span className="spinner" /> : "Подтвердить вход"}
            </button>
            <div style={{ textAlign: "center", marginTop: 16 }}>
              <button type="button" onClick={() => setStep(1)} style={{ background: "transparent", color: "#A87935", border: "none", fontWeight: 600 }}>Изменить номер</button>
            </div>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleSaveProfile}>
            <div style={{ color: "#FFFBEB", marginBottom: 24, textAlign: "center", fontSize: 18, fontWeight: 700 }}>
              Давайте познакомимся
            </div>
            <div style={{ marginBottom: 12 }}>
              <input className="input-gold" placeholder="Ваше Имя" value={newUserForm.name} onChange={(e) => setNewUserForm({...newUserForm, name: e.target.value})} />
            </div>
            <div style={{ marginBottom: 24 }}>
              <input className="input-gold" placeholder="Ваша Фамилия" value={newUserForm.surname} onChange={(e) => setNewUserForm({...newUserForm, surname: e.target.value})} />
            </div>
            <button type="submit" disabled={loading} style={btnStyle}>
              {loading ? <span className="spinner" /> : "Сохранить профиль"}
            </button>
          </form>
        )}
      </div>

      <div style={{ marginTop: "auto", paddingBottom: 30, textAlign: "center", opacity: 0.5, fontSize: 11, color: "#888" }}>
        © 2026 toi.kz • Сделано с любовью в Казахстане
      </div>
    </div>
  );
}

const btnStyle = {
  width: "100%", height: 58, background: "linear-gradient(135deg, #A87935, #800020)",
  color: "#FFFBEB", fontWeight: 800, border: "none", borderRadius: 16, fontSize: 16,
  cursor: "pointer", boxShadow: "0 10px 25px rgba(128,0,32,0.3)", display: "flex",
  alignItems: "center", justifyContent: "center"
};

export default function LoginPage() {
  return (
    <ToastProvider>
      <LoginInner />
    </ToastProvider>
  );
}
