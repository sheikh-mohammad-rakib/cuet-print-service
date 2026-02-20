"use client";

import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { account } from "@/lib/appwrite";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, LogOut, LayoutDashboard, Settings } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  // In a real app, strict role checking "owner" would be passed here
  const { loading, user } = useAuthRedirect("owner");
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

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Sidebar for Desktop */}
      <aside className="w-full md:w-64 bg-white border-r min-h-screen flex-col hidden md:flex">
        <div className="p-6 border-b">
          <h1 className="font-bold text-xl text-blue-700">Shop Admin</h1>
          <p className="text-xs text-gray-500 mt-1 truncate">{user?.name}</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link href="/manage">
            <Button variant="ghost" className="w-full justify-start bg-blue-50 text-blue-700">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Queue
            </Button>
          </Link>
          <Link href="/settings">
            <Button variant="ghost" className="w-full justify-start text-gray-600 hover:text-blue-600 hover:bg-blue-50">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </Link>
        </nav>

        <div className="p-4 border-t">
          <Button
            variant="ghost"
            className="w-full justify-start text-slate-500 hover:text-red-600 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b p-4 flex justify-between items-center sticky top-0 z-10">
        <h1 className="font-bold text-blue-700">Shop Admin</h1>
        <Button size="sm" variant="ghost" onClick={handleLogout}><LogOut className="h-4 w-4" /></Button>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}