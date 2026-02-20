"use client";

import { useState } from "react";
import { account, databases } from "@/lib/appwrite";
import { ID } from "appwrite";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Shared State
  const [role, setRole] = useState<"student" | "owner">("student");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Shop Owner Specific State
  const [shopName, setShopName] = useState("");
  const [location, setLocation] = useState("");

  const handleSignup = async () => {
    // 1. Validation
    if (!email || !password || !name) {
      toast({ title: "Error", description: "Please fill in all basic fields", variant: "destructive" });
      return;
    }
    if (role === "owner" && (!shopName || !location)) {
      toast({ title: "Error", description: "Shop Name and Location are required", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      // 2. Create Appwrite Account
      // ID.unique() generates a random ID for the user
      await account.create(ID.unique(), email, password, name);

      // 3. Log them in immediately (Session creation)
      await account.createEmailPasswordSession(email, password);

      // 3.5 Save role to preferences
      await account.updatePrefs({ role: role });

      // 4. If Shop Owner, create the Shop Entry in Database
      if (role === "owner") {
        const dbId = process.env.NEXT_PUBLIC_DB_ID;
        const collectionId = process.env.NEXT_PUBLIC_COLLECTION_SHOPS;

        if (!dbId || !collectionId) {
          throw new Error("Database configuration missing");
        }

        await databases.createDocument(
          dbId,
          collectionId,
          ID.unique(),
          {
            shopName: shopName,
            location: location,
            ownerEmail: email,
            isOnline: true,
            is_active: false,
            price_bw: 2.0,
            price_color: 5.0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        );
      }

      toast({ title: "Welcome!", description: "Account created successfully." });

      // 5. Redirect
      if (role === "student") {
        router.push("/dashboard");
      } else {
        router.push("/manage");
      }

    } catch (error: any) {
      console.error(error);
      toast({
        title: "Signup Failed",
        description: error.message || "Could not create account",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-blue-700">Join CUET Print</CardTitle>
          <CardDescription>Create an account to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="student" className="w-full" onValueChange={(val) => setRole(val as "student" | "owner")}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="student">Student</TabsTrigger>
              <TabsTrigger value="owner">Shop Owner</TabsTrigger>
            </TabsList>

            <div className="space-y-4">
              {/* Common Fields */}
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input placeholder="John Doe" onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" placeholder="email@cuet.ac.bd" onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Password</Label>
                <Input type="password" onChange={(e) => setPassword(e.target.value)} />
              </div>

              {/* Shop Owner Extra Fields */}
              <TabsContent value="owner" className="space-y-4 pt-2 border-t">
                <p className="text-sm font-medium text-gray-500">Shop Details</p>
                <div className="space-y-2">
                  <Label>Shop Name</Label>
                  <Input placeholder="Mayer Doa Photostat" onChange={(e) => setShopName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input placeholder="Civil Building, Ground Floor" onChange={(e) => setLocation(e.target.value)} />
                </div>
              </TabsContent>

              <Button className="w-full mt-4" disabled={isLoading} onClick={handleSignup}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {role === "student" ? "Sign Up as Student" : "Register Shop"}
              </Button>
            </div>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-500">
            Already have an account? <Link href="/login" className="text-blue-600 hover:underline">Login</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}