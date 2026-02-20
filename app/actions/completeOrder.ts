"use server";

import { adminDatabases } from "@/lib/server-appwrite";
import { Query } from "node-appwrite";

export async function completeOrder(orderId: string, shopOwnerEmail: string) {
  try {
    const dbId = process.env.NEXT_PUBLIC_DB_ID!;
    const orderCollectionId = process.env.NEXT_PUBLIC_COLLECTION_ORDERS!;
    const shopCollectionId = process.env.NEXT_PUBLIC_COLLECTION_SHOPS!;

    // Verify that the shop owner has permission to update this order
    // First, get the shop owned by this email
    const shopResponse = await adminDatabases.listDocuments(
      dbId,
      shopCollectionId,
      [Query.equal('ownerEmail', shopOwnerEmail)]
    );

    if (shopResponse.documents.length === 0) {
      return { success: false, error: "No shop found for this owner" };
    }

    const myShopId = shopResponse.documents[0].$id;

    // Get the order and verify it belongs to this shop
    const order = await adminDatabases.getDocument(
      dbId,
      orderCollectionId,
      orderId
    );

    if (order.shopId !== myShopId) {
      return { success: false, error: "You don't have permission to update this order" };
    }

    // Update the order status
    await adminDatabases.updateDocument(
      dbId,
      orderCollectionId,
      orderId,
      { status: 'delivered' }
    );

    return { success: true };
  } catch (error: any) {
    console.error("Error completing order:", error);
    return { success: false, error: error.message || "Failed to update order" };
  }
}
