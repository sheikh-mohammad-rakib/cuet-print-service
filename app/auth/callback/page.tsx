"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { account } from "@/lib/appwrite";
import { Loader2 } from "lucide-react";

export default function AuthCallback() {
    const router = useRouter();

    useEffect(() => {
        const handleCallback = async () => {
            try {
                // Appwrite handles the session creation on its redirect.
                // We just need to verify we have a user and route them.

                const user = await account.get();
                let role = user.prefs?.role;

                // If new user via OAuth, they won't have a role. Default to 'student'.
                if (!role) {
                    role = "student";
                    await account.updatePrefs({ role: "student" });
                }

                // Redirect based on role
                if (role === "owner") {
                    router.push("/manage");
                } else {
                    router.push("/dashboard");
                }
            } catch (error) {
                console.error("Auth callback error:", error);
                router.push("/login?error=oauth_failed");
            }
        };

        handleCallback();
    }, [router]);

    return (
        <div className="flex h-screen w-full items-center justify-center bg-gray-50">
            <div className="flex flex-col items-center space-y-4">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
                <p className="text-gray-500">Completing sign in...</p>
            </div>
        </div>
    );
}
