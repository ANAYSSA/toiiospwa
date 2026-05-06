"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MenuIndex() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/menu/home");
  }, [router]);
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
      <span className="spinner" />
    </div>
  );
}
