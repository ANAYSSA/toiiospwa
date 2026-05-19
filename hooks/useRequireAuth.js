"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

export function useRequireAuth() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        setUser(null);
        router.replace("/");
        return;
      }

      setUser(currentUser);
      setChecking(false);
    });

    return () => unsub();
  }, [router]);

  return { user, checking };
}
