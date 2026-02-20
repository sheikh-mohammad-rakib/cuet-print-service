"use client";

import { useEffect, useState, Suspense } from "react";
import { account } from "@/lib/appwrite";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

function VerifyContent() {
    const searchParams = useSearchParams();
    const userId = searchParams.get("userId");
    const secret = searchParams.get("secret");

    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("Verifying your email...");

    useEffect(() => {
        if (!userId || !secret) {
            setStatus("error");
            setMessage("Invalid verification link. Missing parameters.");
            return;
        }

        const verifyEmail = async () => {
            try {
                await account.updateVerification(userId, secret);
                setStatus("success");
                setMessage("Your email has been successfully verified!");
            } catch (error: any) {
                setStatus("error");
                setMessage(error.message || "Failed to verify email. The link may have expired.");
            }
        };

        verifyEmail();
    }, [userId, secret]);

    return (
        <Card className="w-full max-w-md">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-blue-700">Email Verification</CardTitle>
                <CardDescription>
                    {status === "loading" && "Please wait while we verify your email address."}
                    {status === "success" && "Verification Complete"}
                    {status === "error" && "Verification Failed"}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-6">
                {status === "loading" && (
                    <Loader2 className="h-16 w-16 animate-spin text-blue-500" />
                )}

                {status === "success" && (
                    <div className="flex flex-col items-center gap-4">
                        <CheckCircle className="h-16 w-16 text-green-500" />
                        <p className="text-center text-gray-700">{message}</p>
                        <Button asChild className="w-full mt-4">
                            <Link href="/dashboard">Go to Dashboard</Link>
                        </Button>
                    </div>
                )}

                {status === "error" && (
                    <div className="flex flex-col items-center gap-4">
                        <XCircle className="h-16 w-16 text-red-500" />
                        <p className="text-center text-gray-700">{message}</p>
                        <Button asChild variant="outline" className="w-full mt-4">
                            <Link href="/">Back to Home</Link>
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export default function VerifyPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin" />}>
                <VerifyContent />
            </Suspense>
        </div>
    );
}
