"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { signOut, onAuthStateChanged, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { ref, get, update } from "firebase/database";
import { useToast } from "@/components/Toast";

const KZ_CITIES = [
  "Алматы", "Астана", "Шымкент", "Актобе", "Караганда",
  "Тараз", "Павлодар", "Усть-Каменогорск", "Семей", "Атырау",
  "Костанай", "Кызылорда", "Уральск", "Петропавловск", "Актау", "Туркестан",
];

export default function ProfilePage() {
  const router = useRouter();
  const showToast = useToast();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState("");
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [darkTheme, setDarkTheme] = useState(false);
  const [avatar, setAvatar] = useState(null); // base64 string
  const fileInputRef = useRef(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("theme");
      if (saved === "dark") {
        setDarkTheme(true);
        document.documentElement.classList.add("dark");
      }
      const savedCity = localStorage.getItem("userCity");
      if (savedCity) setCity(savedCity);
      const savedAvatar = localStorage.getItem("userAvatar");
      if (savedAvatar) setAvatar(savedAvatar);
    } catch (e) {}

    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        try {
          const snap = await get(ref(db, "Users/" + u.uid));
          if (snap.exists()) {
            const data = snap.val();
            setProfile(data);
            // если в БД есть город — взять оттуда
            if (data.city && !city) {
              setCity(data.city);
              try { localStorage.setItem("userCity", data.city); } catch (e) {}
            }
          }
        } catch (e) {
          console.log("Could not fetch user profile:", e);
          showToast("Не удалось загрузить профиль");
        }
      }
      setLoading(false);
    });
    return () => unsub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleTheme = () => {
    const newVal = !darkTheme;
    setDarkTheme(newVal);
    try {
      if (newVal) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
    } catch (e) {}
  };

  const handleSelectCity = async (c) => {
    setCity(c);
    try { localStorage.setItem("userCity", c); } catch (e) {}
    setShowCityPicker(false);
    showToast("Город изменен на: " + c);
    // сохранить в Firebase
    if (user) {
      try {
        await update(ref(db, "Users/" + user.uid), { city: c });
      } catch (e) {
        console.log("Could not save city:", e);
      }
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      showToast("Файл слишком большой (макс. 2 МБ)");
      return;
    }
    // resize to 256x256 square via canvas to keep storage small
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const size = 256;
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        // fit cover (square crop)
        const minSide = Math.min(img.width, img.height);
        const sx = (img.width - minSide) / 2;
        const sy = (img.height - minSide) / 2;
        ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, size, size);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
        setAvatar(dataUrl);
        try {
          localStorage.setItem("userAvatar", dataUrl);
          showToast("Аватарка обновлена");
        } catch (err) {
          showToast("Ошибка сохранения");
        }
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setAvatar(null);
    try { localStorage.removeItem("userAvatar"); } catch (e) {}
    showToast("Аватарка удалена");
  };

  const handleLogout = async () => {
    if (!confirm("Выйти из аккаунта?")) return;
    try {
      await signOut(auth);
      router.replace("/");
    } catch (err) {
      showToast("Ошибка выхода: " + err.message);
    }
  };

  // ---- if no profile loaded yet, show spinner ----
  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <span className="spinner" style={{ width: 30, height: 30, borderWidth: 3 }} />
      </div>
    );
  }

  const displayName = profile
    ? `${profile.name || ""} ${profile.surname || ""}`.trim() || "Пользователь"
    : "Пользователь";
  const phoneStr = profile?.phoneNumber
    ? formatPhone(profile.phoneNumber)
    : "Не указан";
  const emailStr = profile?.email || user?.email || "—";
  const initials = ((profile?.name?.[0] || "") + (profile?.surname?.[0] || "")).toUpperCase() || "✦";

  return (
    <div style={{
      background: darkTheme ? "#0F0F0F" : "#F8F9FA",
      color: darkTheme ? "#FFFBEB" : "#1A1A1A",
      paddingBottom: "calc(120px + env(safe-area-inset-bottom))",
    }}>
      {/* Gradient header */}
      <div className="profile-header" style={{ position: "relative" }}>
        <div style={{
          position: "absolute",
          top: "calc(env(safe-area-inset-top) + 20px)",
          left: 0, right: 0,
          textAlign: "center",
          color: "white", fontSize: 20, fontWeight: 700,
        }}>
          Мой профиль
        </div>
      </div>

      {/* Profile card */}
      <div style={{
        margin: `0 max(20px, env(safe-area-inset-left)) 0 max(20px, env(safe-area-inset-right))`,
        marginTop: -80,
        background: darkTheme ? "#1A1A1A" : "white",
        borderRadius: 20,
        boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
        padding: 20,
        position: "relative",
      }}>
        <div style={{ display: "flex", gap: 15, alignItems: "flex-start" }}>
          {/* Avatar with edit button */}
          <div style={{ position: "relative", flexShrink: 0 }}>
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                width: 90, height: 90,
                borderRadius: "50%",
                background: avatar ? "transparent" : "linear-gradient(135deg, #A87935, #800020)",
                border: "3px solid #FFD700",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "white", fontSize: 32, fontWeight: 700,
                overflow: "hidden",
                cursor: "pointer",
              }}
            >
              {avatar ? (
                <img src={avatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <span>{initials}</span>
              )}
            </div>
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                position: "absolute",
                bottom: -2, right: -2,
                width: 30, height: 30,
                borderRadius: "50%",
                background: "#A87935",
                border: `2px solid ${darkTheme ? "#1A1A1A" : "white"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "white", fontSize: 14,
                cursor: "pointer",
              }}
            >
              📷
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              style={{ display: "none" }}
            />
          </div>

          <div style={{ flex: 1, paddingTop: 8, minWidth: 0 }}>
            <div style={{ fontSize: 18, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {displayName}
            </div>
            <div style={{ color: "#4CAF50", fontSize: 12, marginTop: 4 }}>● Активный</div>
            {avatar && (
              <button
                onClick={handleRemoveAvatar}
                style={{
                  marginTop: 6, background: "transparent", border: "none",
                  color: "#F44336", fontSize: 11, cursor: "pointer", padding: 0,
                }}
              >
                Удалить фото
              </button>
            )}
          </div>
        </div>

        <div style={{ height: 1, background: darkTheme ? "#333" : "rgba(0,0,0,0.08)", margin: "16px 0" }} />

        <InfoRow icon="✉️" label="Email" value={emailStr} dark={darkTheme} />
        <InfoRow icon="📞" label="Телефон" value={phoneStr} dark={darkTheme} />
        <InfoRow
          icon="📍"
          label="Город"
          value={city || "Не выбран"}
          dark={darkTheme}
          onClick={() => setShowCityPicker(true)}
        />

        <button
          onClick={() => setShowEdit(true)}
          style={{
            marginTop: 16, width: "100%",
            background: "rgba(168, 121, 53, 0.12)",
            color: "#A87935",
            border: "1px solid #A87935",
            borderRadius: 12,
            padding: "12px",
            fontWeight: 600,
            fontSize: 14,
            cursor: "pointer",
          }}
        >
          ✎ Редактировать профиль
        </button>
      </div>

      <SectionTitle>Настройки</SectionTitle>

      <SettingsBlock dark={darkTheme}>
        <div style={{ display: "flex", alignItems: "center", padding: "12px", height: 55 }}>
          <span style={{ color: "#FFD700", fontSize: 20, marginRight: 12 }}>🌙</span>
          <span style={{ flex: 1 }}>Тёмная тема</span>
          <label className="switch">
            <input type="checkbox" checked={darkTheme} onChange={toggleTheme} />
            <span className="slider" />
          </label>
        </div>
        <DividerRow dark={darkTheme} />
        <SettingsRow icon="📍" label="Изменить город" onClick={() => setShowCityPicker(true)} dark={darkTheme} />
        <DividerRow dark={darkTheme} />
        <SettingsRow icon="🔒" label="Сменить пароль" onClick={() => setShowPassword(true)} dark={darkTheme} />
        <DividerRow dark={darkTheme} />
        <SettingsRow icon="🌐" label="Тілді таңдау (KZ/RU)" onClick={() => showToast("Скоро будет доступно")} dark={darkTheme} />
      </SettingsBlock>

      <SectionTitle>Поддержка</SectionTitle>
      <SettingsBlock dark={darkTheme}>
        <SettingsRow icon="❓" label="Помощь" onClick={() => showToast("Раздел помощи в разработке")} dark={darkTheme} />
        <DividerRow dark={darkTheme} />
        <SettingsRow icon="ℹ️" label="О приложении" onClick={() => showToast("ТОЙХАНА v1.0 — PWA")} dark={darkTheme} />
        <DividerRow dark={darkTheme} />
        <SettingsRow icon="⏻" label="Выйти" onClick={handleLogout} dark={darkTheme} danger />
      </SettingsBlock>

      <div style={{ textAlign: "center", color: "#888", fontSize: 12, marginTop: 30 }}>
        ТОЙХАНА · v1.0
      </div>

      {/* City picker */}
      {showCityPicker && (
        <div className="modal-overlay" onClick={() => setShowCityPicker(false)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 18 }}>Выберите ваш город</div>
            {KZ_CITIES.map((c) => (
              <div key={c} className="modal-item" onClick={() => handleSelectCity(c)}>{c}</div>
            ))}
          </div>
        </div>
      )}

      {/* Edit profile */}
      {showEdit && (
        <EditProfileModal
          user={user}
          profile={profile}
          dark={darkTheme}
          onClose={() => setShowEdit(false)}
          onSaved={(newProfile) => {
            setProfile(newProfile);
            setShowEdit(false);
            showToast("Профиль обновлён");
          }}
          onError={(msg) => showToast(msg)}
        />
      )}

      {/* Change password */}
      {showPassword && (
        <ChangePasswordModal
          dark={darkTheme}
          onClose={() => setShowPassword(false)}
          onSaved={() => {
            setShowPassword(false);
            showToast("Пароль изменён");
          }}
          onError={(msg) => showToast(msg)}
        />
      )}
    </div>
  );
}

/* ============== HELPER COMPONENTS ============== */

function InfoRow({ icon, label, value, dark, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "10px 0",
        cursor: onClick ? "pointer" : "default",
      }}
    >
      <span style={{ fontSize: 18, width: 28, textAlign: "center" }}>{icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 11, color: dark ? "#888" : "#999" }}>{label}</div>
        <div style={{ fontSize: 14, fontWeight: 500, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {value}
        </div>
      </div>
      {onClick && <span style={{ color: "#888" }}>›</span>}
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <div style={{
      marginTop: 25,
      paddingLeft: "max(25px, calc(env(safe-area-inset-left) + 5px))",
      paddingRight: "max(25px, calc(env(safe-area-inset-right) + 5px))",
      color: "#888", fontWeight: 700, fontSize: 13,
      textTransform: "uppercase", letterSpacing: "0.05em",
    }}>
      {children}
    </div>
  );
}

function SettingsBlock({ children, dark }) {
  return (
    <div style={{
      margin: "10px max(20px, env(safe-area-inset-left)) 0 max(20px, env(safe-area-inset-right))",
      background: dark ? "#1A1A1A" : "white",
      borderRadius: 15,
      padding: 10,
      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
    }}>
      {children}
    </div>
  );
}

function SettingsRow({ icon, label, onClick, dark, danger }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", width: "100%",
        background: "transparent", border: "none", padding: "0 12px",
        height: 55, color: danger ? "#F44336" : "inherit", fontSize: 14,
        cursor: "pointer", textAlign: "left",
      }}
    >
      <span style={{ color: danger ? "#F44336" : "#FFD700", fontSize: 20, marginRight: 12 }}>{icon}</span>
      <span style={{ flex: 1 }}>{label}</span>
      <span style={{ color: "#888" }}>›</span>
    </button>
  );
}

function DividerRow({ dark }) {
  return <div style={{ height: 1, background: dark ? "#333" : "rgba(0,0,0,0.06)" }} />;
}

/* ============== EDIT MODAL ============== */

function EditProfileModal({ user, profile, dark, onClose, onSaved, onError }) {
  const [form, setForm] = useState({
    name: profile?.name || "",
    surname: profile?.surname || "",
    phone: profile?.phoneNumber ? String(profile.phoneNumber) : "",
  });
  const [saving, setSaving] = useState(false);

  const upd = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const save = async () => {
    if (!form.name.trim() || !form.surname.trim()) {
      onError("Имя и фамилия обязательны");
      return;
    }
    setSaving(true);
    try {
      const cleanPhone = form.phone.replace(/[^0-9]/g, "");
      const updated = {
        name: form.name.trim(),
        surname: form.surname.trim(),
        phoneNumber: cleanPhone ? Number(cleanPhone) : 0,
      };
      await update(ref(db, "Users/" + user.uid), updated);
      onSaved({ ...profile, ...updated });
    } catch (err) {
      onError("Ошибка: " + (err.message || err.code));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()} style={{ background: dark ? "#1A1A1A" : "white", color: dark ? "#FFFBEB" : "#1A1A1A" }}>
        <div style={{ fontWeight: 700, marginBottom: 16, fontSize: 18 }}>Редактировать профиль</div>

        <FormField label="Имя">
          <input
            value={form.name}
            onChange={upd("name")}
            className="modal-input"
            style={inputStyle(dark)}
          />
        </FormField>

        <FormField label="Фамилия">
          <input
            value={form.surname}
            onChange={upd("surname")}
            style={inputStyle(dark)}
          />
        </FormField>

        <FormField label="Телефон">
          <input
            value={form.phone}
            onChange={upd("phone")}
            type="tel"
            placeholder="77001234567"
            style={inputStyle(dark)}
          />
        </FormField>

        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <button onClick={onClose} style={btnSecondary(dark)} disabled={saving}>
            Отмена
          </button>
          <button onClick={save} style={btnPrimary()} disabled={saving}>
            {saving ? <span className="spinner" /> : "Сохранить"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============== CHANGE PASSWORD MODAL ============== */

function ChangePasswordModal({ dark, onClose, onSaved, onError }) {
  const [oldPwd, setOldPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!oldPwd || !newPwd) {
      onError("Заполните все поля");
      return;
    }
    if (newPwd.length < 6) {
      onError("Новый пароль не менее 6 символов");
      return;
    }
    if (newPwd !== confirm) {
      onError("Пароли не совпадают");
      return;
    }
    setSaving(true);
    try {
      const u = auth.currentUser;
      const cred = EmailAuthProvider.credential(u.email, oldPwd);
      await reauthenticateWithCredential(u, cred);
      await updatePassword(u, newPwd);
      onSaved();
    } catch (err) {
      const code = err.code || "";
      if (code === "auth/wrong-password" || code === "auth/invalid-credential") {
        onError("Неверный текущий пароль");
      } else {
        onError("Ошибка: " + (err.message || code));
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()} style={{ background: dark ? "#1A1A1A" : "white", color: dark ? "#FFFBEB" : "#1A1A1A" }}>
        <div style={{ fontWeight: 700, marginBottom: 16, fontSize: 18 }}>Сменить пароль</div>

        <FormField label="Текущий пароль">
          <input type="password" value={oldPwd} onChange={(e) => setOldPwd(e.target.value)} style={inputStyle(dark)} />
        </FormField>
        <FormField label="Новый пароль">
          <input type="password" value={newPwd} onChange={(e) => setNewPwd(e.target.value)} style={inputStyle(dark)} />
        </FormField>
        <FormField label="Повторите новый пароль">
          <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} style={inputStyle(dark)} />
        </FormField>

        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <button onClick={onClose} style={btnSecondary(dark)} disabled={saving}>Отмена</button>
          <button onClick={save} style={btnPrimary()} disabled={saving}>
            {saving ? <span className="spinner" /> : "Сменить"}
          </button>
        </div>
      </div>
    </div>
  );
}

function FormField({ label, children }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 12, color: "#888", marginBottom: 6, fontWeight: 500 }}>{label}</div>
      {children}
    </div>
  );
}

function inputStyle(dark) {
  return {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 10,
    border: `1px solid ${dark ? "#333" : "#DDD"}`,
    background: dark ? "#0F0F0F" : "#F8F9FA",
    color: dark ? "#FFFBEB" : "#1A1A1A",
    fontSize: 16,
    outline: "none",
  };
}

function btnPrimary() {
  return {
    flex: 1,
    height: 48,
    background: "#A87935",
    color: "white",
    border: "none",
    borderRadius: 10,
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };
}

function btnSecondary(dark) {
  return {
    flex: 1,
    height: 48,
    background: "transparent",
    color: dark ? "#FFFBEB" : "#1A1A1A",
    border: `1px solid ${dark ? "#333" : "#DDD"}`,
    borderRadius: 10,
    fontWeight: 500,
    fontSize: 14,
    cursor: "pointer",
  };
}

function formatPhone(num) {
  const s = String(num);
  // 77001234567 → +7 (700) 123-45-67
  if (s.length === 11 && s.startsWith("7")) {
    return `+7 (${s.slice(1, 4)}) ${s.slice(4, 7)}-${s.slice(7, 9)}-${s.slice(9, 11)}`;
  }
  if (s.length === 10) {
    return `+7 (${s.slice(0, 3)}) ${s.slice(3, 6)}-${s.slice(6, 8)}-${s.slice(8, 10)}`;
  }
  return "+" + s;
}
