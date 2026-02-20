"use client";

import { OAuthProvider } from "appwrite";
import { ADMIN_EMAILS } from "@/lib/constants";

import { useState } from "react";
import { account } from "@/lib/appwrite";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleOAuthLogin = async () => {
    try {
      await account.createOAuth2Session(
        OAuthProvider.Google,
        `${window.location.origin}/auth/callback`, // Success
        `${window.location.origin}/login?error=oauth_cancel` // Failure
      );
    } catch (error: any) {
      console.error(error);
      toast({ title: "Error", description: "Could not initiate Google Login", variant: "destructive" });
    }
  };

  const handleLogin = async (role: "student" | "owner") => {
    if (!email || !password) {
      toast({ title: "Error", description: "Please fill in all fields", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      // 1. Create Email Session
      await account.createEmailPasswordSession(email, password);

      toast({ title: "Success", description: "Logged in successfully." });

      // 2. Redirect based on user preference if available, else tab selection
      const user = await account.get();
      const savedRole = user.prefs?.role;

      if (ADMIN_EMAILS.includes(email)) {
        router.push("/admin-panel");
      } else if (savedRole === "owner" || role === "owner") { // Check saved pref first
        router.push("/manage");
      } else {
        router.push("/dashboard");
      }

    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-blue-700">CUET Print Service</CardTitle>
          <CardDescription>Enter your credentials to access the portal</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Add Google Button Here */}
          <div className="mb-6">
            <Button variant="outline" className="w-full flex items-center gap-2" onClick={handleOAuthLogin}>
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </Button>
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or email</span>
              </div>
            </div>
          </div>

          <Tabs defaultValue="student" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="student">Student</TabsTrigger>
              <TabsTrigger value="owner">Shop Owner</TabsTrigger>
            </TabsList>

            {/* Student Login Tab */}
            <TabsContent value="student">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="student-email">Student Email</Label>
                  <Input
                    id="student-email"
                    type="email"
                    placeholder="u1904000@student.cuet.ac.bd"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="student-pass">Password</Label>
                  <Input
                    id="student-pass"
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="flex justify-end">
                  <Link
                    href="/forgot-password"
                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Button className="w-full" disabled={loading} onClick={() => handleLogin("student")}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Login as Student
                </Button>
              </div>
            </TabsContent>

            {/* Owner Login Tab */}
            <TabsContent value="owner">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="owner-email">Shop Email</Label>
                  <Input
                    id="owner-email"
                    type="email"
                    placeholder="shop@cuet.ac.bd"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="owner-pass">Password</Label>
                  <Input
                    id="owner-pass"
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="flex justify-end">
                  <Link
                    href="/forgot-password"
                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Button variant="secondary" className="w-full" disabled={loading} onClick={() => handleLogin("owner")}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Login to Dashboard
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-500">
            Don't have an account? <Link href="/signup" className="text-blue-600 hover:underline">Sign up</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}