"use client";
import { useEffect, useState } from "react";
import { account } from "@/lib/appwrite";
import { useRouter } from "next/navigation";
import { Loader2, LogOut } from "lucide-react";
import { ADMIN_EMAILS } from "@/lib/constants";
import { Button } from "@/components/ui/button";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const user = await account.get();

                if (!ADMIN_EMAILS.includes(user.email)) {
                    // If not an admin, send them to login
                    router.push("/login");
                }
            } catch (error) {
                router.push("/login");
            } finally {
                setLoading(false);
            }
        };
        checkAdmin();
    }, [router]);

    const handleLogout = async () => {
        await account.deleteSession("current");
        router.push("/login");
    };

    if (loading) {
        return <div className="h-screen w-full flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
    }

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100">
            <nav className="border-b border-slate-800 p-4 px-8 flex justify-between items-center bg-slate-950">
                <div className="flex items-center gap-4">
                    <h1 className="font-bold text-xl text-blue-500">SUPER ADMIN</h1>
                    <div className="text-xs text-slate-500">Platform Control</div>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="text-slate-400 hover:text-white hover:bg-slate-800"
                >
                    <LogOut className="h-4 w-4 mr-2" /> Logout
                </Button>
            </nav>
            <main className="p-8">{children}</main>
        </div>
    );
}