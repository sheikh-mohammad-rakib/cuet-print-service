"use client";

import { useEffect, useState } from "react";
import { account, databases } from "@/lib/appwrite";
import { Query } from "appwrite";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save } from "lucide-react";

export default function ShopSettings() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const { toast } = useToast();

    const [shopId, setShopId] = useState("");
    const [formData, setFormData] = useState({
        shopName: "",
        location: "",
        priceBw: "2",
        priceColor: "5",
        isActive: true, // This is Admin verification status, not modifiable by user usually, but maybe 'isOnline' is what they want?
        isOnline: true  // This is Open/Closed status
    });

    useEffect(() => {
        const fetchShopDetails = async () => {
            try {
                const user = await account.get();
                const dbId = process.env.NEXT_PUBLIC_DB_ID!;
                const shopCollectionId = process.env.NEXT_PUBLIC_COLLECTION_SHOPS!;

                const response = await databases.listDocuments(
                    dbId,
                    shopCollectionId,
                    [Query.equal('ownerEmail', user.email)]
                );

                if (response.documents.length > 0) {
                    const doc = response.documents[0];
                    setShopId(doc.$id);
                    setFormData({
                        shopName: doc.shopName || doc.shop_name,
                        location: doc.location,
                        priceBw: (doc.priceBw || doc.price_bw || 2).toString(),
                        priceColor: (doc.priceColor || doc.price_color || 5).toString(),
                        isActive: doc.is_active !== undefined ? doc.is_active : doc.isActive,
                        isOnline: doc.isOnline !== undefined ? doc.isOnline : doc.is_online
                    });
                }
            } catch (error) {
                console.error("Error fetching shop:", error);
                toast({ title: "Error", description: "Could not load shop details.", variant: "destructive" });
            } finally {
                setLoading(false);
            }
        };

        fetchShopDetails();
    }, []);

    const handleSave = async () => {
        if (!shopId) return;

        setSaving(true);
        try {
            const dbId = process.env.NEXT_PUBLIC_DB_ID!;
            const shopCollectionId = process.env.NEXT_PUBLIC_COLLECTION_SHOPS!;

            await databases.updateDocument(
                dbId,
                shopCollectionId,
                shopId,
                {
                    shopName: formData.shopName,
                    location: formData.location,
                    price_bw: parseFloat(formData.priceBw),
                    price_color: parseFloat(formData.priceColor),
                    isOnline: formData.isOnline
                }
            );

            toast({ title: "Saved", description: "Shop settings updated successfully." });
        } catch (error: any) {
            console.error(error);
            toast({ title: "Error", description: error.message || "Failed to save settings.", variant: "destructive" });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center p-20"><Loader2 className="animate-spin h-8 w-8 text-blue-500" /></div>;
    }

    if (!shopId) {
        return (
            <div className="p-8 text-center text-gray-500">
                <p>No shop found linked to this account.</p>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Settings</h1>
                <p className="text-gray-500">Manage your shop details and pricing.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Shop Profile</CardTitle>
                    <CardDescription>Update your shop's visible information.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Shop Name</Label>
                        <Input
                            value={formData.shopName}
                            onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Location</Label>
                        <Input
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Pricing & Status</CardTitle>
                    <CardDescription>Set your printing rates and availability.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>B&W Price (per page)</Label>
                            <div className="relative">
                                <Input
                                    type="number"
                                    step="0.5"
                                    value={formData.priceBw}
                                    onChange={(e) => setFormData({ ...formData, priceBw: e.target.value })}
                                    className="pl-8"
                                />
                                <span className="absolute left-3 top-2.5 text-gray-500 font-bold">৳</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Color Price (per page)</Label>
                            <div className="relative">
                                <Input
                                    type="number"
                                    step="0.5"
                                    value={formData.priceColor}
                                    onChange={(e) => setFormData({ ...formData, priceColor: e.target.value })}
                                    className="pl-8"
                                />
                                <span className="absolute left-3 top-2.5 text-gray-500 font-bold">৳</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                            <Label className="text-base">Shop Status</Label>
                            <p className="text-sm text-gray-500">
                                {formData.isOnline ? "Your shop is currently OPEN." : "Your shop is currently CLOSED."}
                            </p>
                        </div>
                        <Switch
                            checked={formData.isOnline}
                            onCheckedChange={(checked) => setFormData({ ...formData, isOnline: checked })}
                        />
                    </div>

                    <Button onClick={handleSave} disabled={saving} className="w-full">
                        {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </Button>

                </CardContent>
            </Card>
        </div>
    );
}
