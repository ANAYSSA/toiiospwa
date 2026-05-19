"use client";
import { usePathname, useRouter } from "next/navigation";
import { ToastProvider } from "@/components/Toast";
import { useRequireAuth } from "@/hooks/useRequireAuth";

const navItems = [
  {
    id: "home",
    href: "/menu/home",
    label: "Главная",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9.5L12 3l9 6.5V21a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1V9.5Z" />
      </svg>
    ),
  },
  {
    id: "halls",
    href: "/menu/halls",
    label: "Залы",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4" />
        <path d="M9 9v.01M9 12v.01M9 15v.01M9 18v.01" />
      </svg>
    ),
  },
  {
    id: "booking",
    href: "/menu/booking",
    label: "Бронь",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </svg>
    ),
  },
  {
    id: "about",
    href: "/menu/about",
    label: "О нас",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4M12 8h.01" />
      </svg>
    ),
  },
  {
    id: "profile",
    href: "/menu/profile",
    label: "Профиль",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </svg>
    ),
  },
];

export default function MenuLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { checking } = useRequireAuth();

  if (checking) {
    return (
      <div style={{ minHeight: "100vh", background: "#0A0A0A", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span className="spinner" style={{ width: 30, height: 30, borderWidth: 3 }} />
      </div>
    );
  }

  const activeId = navItems.find((it) => pathname.startsWith(it.href))?.id || "home";

  return (
    <ToastProvider>
      <div style={{ minHeight: "100vh", paddingBottom: "calc(80px + env(safe-area-inset-bottom))" }}>
        {children}
      </div>
      <nav className="bottom-nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activeId === item.id ? "active" : ""}`}
            onClick={() => router.push(item.href)}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </ToastProvider>
  );
}
