"use client";

import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { account } from "@/lib/appwrite";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, LogOut } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const { loading, user } = useAuthRedirect("student");
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await account.deleteSession("current");
      router.push("/login");
      toast({ title: "Logged out" });
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  // Show loading spinner while checking if user is logged in
  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Student Navigation Bar */}
      <nav className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="font-bold text-xl text-blue-700">
            CUET Print
          </Link>
          
          <div className="flex items-center gap-4">
            {user && (
              <span className="text-sm text-gray-600 hidden md:block">
                Hello, {user.name}
              </span>
            )}
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-red-600 hover:text-red-700 hover:bg-red-50">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 container mx-auto p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}