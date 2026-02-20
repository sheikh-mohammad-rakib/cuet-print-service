"use server";

import { adminDatabases } from "@/lib/server-appwrite";
import { revalidateTag } from "next/cache";

export async function approveShopAction(shopId: string) {
    try {
        const dbId = process.env.NEXT_PUBLIC_DB_ID!;
        const shopColId = process.env.NEXT_PUBLIC_COLLECTION_SHOPS!;

        // Perform the update using the Admin Client (adminDatabases)
        // This bypasses the row-level permissions (RLS) that block the client-side user
        await adminDatabases.updateDocument(
            dbId,
            shopColId,
            shopId,
            { is_active: true }
        );

        // Immediately invalidate the cached pending-shops list so the next
        // request to admin-panel sees the updated list without waiting for revalidation
        revalidateTag("pending-shops", { expire: 0 }); // expire: 0 = immediate invalidation

        return { success: true };
    } catch (error: any) {
        console.error("Server Action Error:", error);
        return { success: false, error: error.message };
    }
}

