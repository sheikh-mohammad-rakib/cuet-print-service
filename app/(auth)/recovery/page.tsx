"use client";

import { useEffect, useState, Suspense } from "react";
import { account } from "@/lib/appwrite";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

function RecoveryContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();

    const userId = searchParams.get("userId");
    const secret = searchParams.get("secret");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [validLink, setValidLink] = useState(true);

    useEffect(() => {
        if (!userId || !secret) {
            setValidLink(false);
        }
    }, [userId, secret]);

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast({ title: "Error", description: "Passwords do not match", variant: "destructive" });
            return;
        }

        if (password.length < 8) {
            toast({ title: "Error", description: "Password must be at least 8 characters", variant: "destructive" });
            return;
        }

        if (!userId || !secret) {
            toast({ title: "Error", description: "Invalid recovery link", variant: "destructive" });
            return;
        }

        setLoading(true);
        try {
            await account.updateRecovery(userId, secret, password);

            toast({ title: "Success", description: "Password updated successfully!" });
            router.push("/login");
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to update password",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    if (!validLink) {
        return (
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-red-600">Invalid Link</CardTitle>
                    <CardDescription>The password recovery link is invalid or missing information.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={() => router.push("/forgot-password")} className="w-full">
                        Request a new Link
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-blue-700">Set New Password</CardTitle>
                <CardDescription>Enter your new password below to reset your account access.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleUpdatePassword} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="password">New Password</Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={8}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm Password</Label>
                        <Input
                            id="confirm-password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            minLength={8}
                        />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Reset Password
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}

export default function RecoveryPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin" />}>
                <RecoveryContent />
            </Suspense>
        </div>
    );
}
