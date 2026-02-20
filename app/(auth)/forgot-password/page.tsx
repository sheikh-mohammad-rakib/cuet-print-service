"use client";

import { useState } from "react";
import { account } from "@/lib/appwrite";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
    const { toast } = useToast();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            toast({ title: "Error", description: "Please enter your email", variant: "destructive" });
            return;
        }

        setLoading(true);
        try {
            // The redirect URL for the password recovery page
            const redirectUrl = `${window.location.origin}/recovery`;

            await account.createRecovery(email, redirectUrl);

            setSent(true);
            toast({ title: "Success", description: "Password recovery email sent!" });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to send recovery email",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    if (sent) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
                <Card className="w-full max-w-md text-center">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-green-700">Email Sent</CardTitle>
                        <CardDescription>
                            Check your inbox for a link to reset your password.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-gray-600 mb-6">
                            If you don't see it, check your spam folder.
                        </p>
                        <Link href="/login">
                            <Button variant="outline">Back to Login</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                        <Link href="/login" className="text-blue-600 hover:text-blue-800 transition-colors">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </div>
                    <CardTitle className="text-2xl font-bold text-blue-700">Forgot Password</CardTitle>
                    <CardDescription>Enter your email to receive a password reset link.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleReset} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Send Recovery Email
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
