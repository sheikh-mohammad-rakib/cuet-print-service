"use client";

import { useState, useEffect } from "react";
import { databases, account } from "@/lib/appwrite";
import { Query } from "appwrite";
import { FileUploader } from "@/components/FileUploader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, MapPin, Printer, Mail } from "lucide-react";

import { useAuthRedirect } from "@/hooks/useAuthRedirect";

// Type definition for a Shop
type Shop = {
  $id: string;
  shop_name: string;
  location: string;
  is_online: boolean;
  price_bw: number;
  price_color: number;
};

// Type definition for Shop Document from Appwrite
type ShopDocument = {
  $id: string;
  shopName?: string;
  shop_name?: string;
  location: string;
  isOnline?: boolean;
  is_online?: boolean;
  price_bw?: number;
  priceBw?: number;
  price_color?: number;
  priceColor?: number;
};

export default function StudentDashboard() {
  const { user } = useAuthRedirect("student");

  const [shops, setShops] = useState<Shop[]>([]);
  const [loadingShops, setLoadingShops] = useState(true);
  const [selectedShop, setSelectedShop] = useState<string>("");
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  const isVerified = user?.emailVerification ?? true; // Default to true if loading

  // Default Config
  const [printConfig, setPrintConfig] = useState({
    type: "bw", // 'bw' or 'color'
    copies: "1",
  });

  // Helper to send verification email
  const sendVerificationEmail = async () => {
    setSending(true);
    try {
      await account.createVerification(`${window.location.origin}/verify`);
      toast({ title: "Email Sent", description: "Verification link sent to your email." });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to send verification email";
      toast({ title: "Error", description: message, variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  // 1. Fetch Shops on Load
  useEffect(() => {
    const fetchShops = async () => {
      try {
        const dbId = process.env.NEXT_PUBLIC_DB_ID!;
        const collectionId = process.env.NEXT_PUBLIC_COLLECTION_SHOPS!;

        const response = await databases.listDocuments(dbId, collectionId, [
          Query.equal('is_active', true)
        ]);

        const shopList = (response.documents as unknown as ShopDocument[]).map((doc) => ({
          $id: doc.$id,
          shop_name: doc.shopName || doc.shop_name || '',
          location: doc.location,
          is_online: doc.isOnline !== undefined ? doc.isOnline : doc.is_online ?? false,
          price_bw: doc.price_bw || doc.priceBw || 2.0,
          price_color: doc.price_color || doc.priceColor || 5.0
        }));
        setShops(shopList);
      } catch (error) {
        console.error("Failed to load shops", error);
      } finally {
        setLoadingShops(false);
      }
    };

    fetchShops();
  }, []);

  const currentShop = shops.find(s => s.$id === selectedShop);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">New Print Job</h1>
        <p className="text-gray-500">
          Select a shop, configure your settings, and upload your PDF.
        </p>

        {!isVerified && user && (
          <div className="bg-warning/10 border-l-4 border-warning p-4 mt-4 flex justify-between items-center">
            <div className="flex items-center">
              <Mail className="h-5 w-5 text-warning mr-2" />
              <div>
                <p className="font-bold text-warning-foreground">Email not verified</p>
                <p className="text-sm text-muted-foreground">Please verify your email to ensure you receive order notifications.</p>
              </div>
            </div>
            <Button onClick={sendVerificationEmail} disabled={sending} variant="outline" size="sm" className="border-warning text-warning-foreground hover:bg-warning/10">
              {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify Email"}
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* LEFT COLUMN: Configuration */}
        <div className="space-y-6">

          {/* 1. Shop Selector */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                Select Shop
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingShops ? (
                <div className="flex justify-center p-4"><Loader2 className="animate-spin text-gray-400" /></div>
              ) : (
                <Select onValueChange={setSelectedShop}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Choose a printing shop..." />
                  </SelectTrigger>
                  <SelectContent>
                    {shops.map((shop) => (
                      <SelectItem key={shop.$id} value={shop.$id} disabled={!shop.is_online}>
                        <div className="flex justify-between w-full items-center gap-2 min-w-50">
                          <span className="font-medium">{shop.shop_name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400">({shop.location})</span>
                            {!shop.is_online && <Badge variant="destructive">Closed</Badge>}
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                    {shops.length === 0 && (
                      <div className="p-2 text-sm text-gray-500 text-center">No shops found</div>
                    )}
                  </SelectContent>
                </Select>
              )}
            </CardContent>
          </Card>

          {/* 2. Print Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Printer className="h-5 w-5 text-blue-600" />
                Print Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">

              {/* Color vs BW */}
              <div className="space-y-3">
                <Label className="text-base">Color Mode</Label>
                <RadioGroup
                  defaultValue="bw"
                  onValueChange={(val: string) => setPrintConfig({ ...printConfig, type: val })}
                  className="grid grid-cols-2 gap-4"
                >
                  <label htmlFor="bw" className={`flex flex-col items-center justify-between rounded-md border-2 p-4 hover:bg-gray-50 cursor-pointer ${printConfig.type === 'bw' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}`}>
                    <RadioGroupItem value="bw" id="bw" className="sr-only" />
                    <span className="font-bold text-gray-900">Black & White</span>
                    <span className="text-sm text-gray-500">{currentShop ? `${currentShop.price_bw}৳` : '2৳'} / page</span>
                  </label>

                  <label htmlFor="color" className={`flex flex-col items-center justify-between rounded-md border-2 p-4 hover:bg-gray-50 cursor-pointer ${printConfig.type === 'color' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}`}>
                    <RadioGroupItem value="color" id="color" className="sr-only" />
                    <span className="font-bold text-gray-900">Color</span>
                    <span className="text-sm text-gray-500">{currentShop ? `${currentShop.price_color}৳` : '5৳'} / page</span>
                  </label>
                </RadioGroup>
              </div>

              {/* Number of Copies */}
              <div className="space-y-3">
                <Label className="text-base">Number of Copies</Label>
                <Select
                  defaultValue="1"
                  onValueChange={(val: string) => setPrintConfig({ ...printConfig, copies: val })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 10, 20].map(num => (
                      <SelectItem key={num} value={num.toString()}>{num} {num === 1 ? 'Copy' : 'Copies'}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN: Upload */}
        <div className="space-y-6">
          <Card className="h-full border-2 border-blue-100 shadow-lg">
            <CardHeader className="bg-blue-50 border-b border-blue-100">
              <CardTitle className="text-blue-800">3. Upload & Pay</CardTitle>
              <CardDescription>Supported format: PDF only</CardDescription>
            </CardHeader>
            <CardContent className="pt-8 flex flex-col justify-center min-h-75">

              {selectedShop ? (
                <div className="space-y-6">
                  {/* We pass the selected shop and config to the uploader */}
                  <FileUploader
                    shopId={selectedShop}
                    config={printConfig}
                    priceBw={currentShop?.price_bw || 2}
                    priceColor={currentShop?.price_color || 5}
                  />

                  <div className="bg-yellow-50 p-4 rounded-md text-xs text-yellow-800 border border-yellow-200">
                    <strong>Note:</strong> Payment is currently handled via cash or manual bKash at the shop counter upon collection.
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-400 space-y-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <MapPin className="h-8 w-8 text-gray-300" />
                  </div>
                  <p>Please select a shop from the list to enable uploading.</p>
                </div>
              )}

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}