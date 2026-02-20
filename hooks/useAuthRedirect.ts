"use client";

import { useEffect, useState } from "react";
import { account } from "@/lib/appwrite"; // Imports your Appwrite config
import { useRouter } from "next/navigation";

export function useAuthRedirect(requiredRole: "student" | "owner" | "any" = "any") {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        // 1. Check if user has an active session
        const session = await account.get();
        setUser(session);

        if (requiredRole !== "any") {
          const role = session.prefs?.role || "student"; // Default to student if undefined

          if (role !== requiredRole) {
            console.log(`Role mismatch: Required ${requiredRole}, Got ${role}`);
            if (role === "owner") {
              router.push("/manage");
            } else {
              router.push("/dashboard");
            }
            return;
          }
        }

      } catch (error) {
        // 2. If no session, redirect to Login
        console.log("Not logged in");
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [router, requiredRole]);

  return { user, loading };
}