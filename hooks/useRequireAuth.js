"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { canAccessRole, getSession, ROLE_ROUTES } from "@/lib/session";

export function useRequireAuth({ allowedRoles = ["client", "vendor", "admin"], redirectTo = "/" } = {}) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const allowedKey = allowedRoles.join("|");

  useEffect(() => {
    let disposed = false;

    const localUser = getSession();
    if (localUser) {
      if (canAccessRole(localUser, allowedRoles)) {
        setUser(localUser);
        setChecking(false);
      } else {
        router.replace(ROLE_ROUTES[localUser.role] || redirectTo);
      }
      return undefined;
    }

    const unsub = onAuthStateChanged(auth, (currentUser) => {
      if (disposed) return;

      if (!currentUser) {
        setUser(null);
        setChecking(false);
        router.replace(redirectTo);
        return;
      }

      const firebaseUser = {
        uid: currentUser.uid,
        role: "client",
        name: currentUser.displayName || "toi.kz user",
        phone: currentUser.phoneNumber || "",
        email: currentUser.email || "",
      };

      if (!canAccessRole(firebaseUser, allowedRoles)) {
        setChecking(false);
        router.replace(redirectTo);
        return;
      }

      setUser(firebaseUser);
      setChecking(false);
    });

    return () => {
      disposed = true;
      unsub();
    };
  }, [allowedKey, redirectTo, router]);

  return { user, checking };
}
