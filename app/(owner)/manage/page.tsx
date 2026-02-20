"use client";

import { useEffect, useState } from "react";
import { client, databases, storage, account } from "@/lib/appwrite";
import { Query } from "appwrite";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Download, CheckCircle, RefreshCcw, FileText, Mail, ClipboardList, TrendingUp, Clock } from "lucide-react";
import { completeOrder } from "@/app/actions/completeOrder";

// Define the Order Type
type Order = {
  $id: string;
  student_id: string;
  file_id: string;
  status: string;
  config: string; // JSON string: {"type":"bw", "copies":"2"}
  total_price: number;
  created_at: string;
};

export default function ShopOwnerDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [isVerified, setIsVerified] = useState(true);
  const [noShop, setNoShop] = useState(false);
  const [userEmail, setUserEmail] = useState<string>("");
  const [processingOrders, setProcessingOrders] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<"pending" | "completed">("pending");

  // 1. Fetch Orders
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const user = await account.get();
      setIsVerified(user.emailVerification);
      setUserEmail(user.email);

      const dbId = process.env.NEXT_PUBLIC_DB_ID!;
      const shopCollectionId = process.env.NEXT_PUBLIC_COLLECTION_SHOPS!;
      const orderCollectionId = process.env.NEXT_PUBLIC_COLLECTION_ORDERS!;

      // Step A: Find which shop belongs to this user (by email)
      const shopResponse = await databases.listDocuments(
        dbId,
        shopCollectionId,
        [Query.equal('ownerEmail', user.email)]
      );

      if (shopResponse.documents.length === 0) {
        setNoShop(true);
        setLoading(false);
        return;
      }

      const myShopId = shopResponse.documents[0].$id;

      // Step B: Fetch Orders for my shop
      const response = await databases.listDocuments(
        dbId,
        orderCollectionId,
        [
          Query.equal('shopId', myShopId),
          Query.orderDesc('$createdAt') // Sort by newest
        ]
      );

      const mappedOrders = response.documents.map((doc: any) => ({
        $id: doc.$id,
        student_id: doc.studentId || doc.student_id,
        file_id: doc.fileId || doc.file_id,
        status: doc.status,
        config: doc.config,
        total_price: doc.totalAmount || doc.totalPrice || doc.total_price,
        created_at: doc.$createdAt
      }));

      setOrders(mappedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Real-Time Listener
  useEffect(() => {
    fetchOrders();

    const dbId = process.env.NEXT_PUBLIC_DB_ID!;
    const orderCollectionId = process.env.NEXT_PUBLIC_COLLECTION_ORDERS!;

    let unsubscribe: (() => void) | undefined;

    // Delay subscription to ensure WebSocket connection is ready
    const subscriptionTimeout = setTimeout(() => {
      try {
        unsubscribe = client.subscribe(
          `databases.${dbId}.collections.${orderCollectionId}.documents`,
          (response) => {
            // If an order is created or updated, refresh the list
            if (response.events.includes("databases.*.collections.*.documents.*.create") ||
              response.events.includes("databases.*.collections.*.documents.*.update")) {
              fetchOrders();
              toast({ title: "Queue Updated", description: "New activity detected." });
            }
          }
        );
      } catch (error) {
        console.error("Subscription error:", error);
        // Subscription failed, but app will still work with manual refresh
      }
    }, 1000);

    return () => {
      clearTimeout(subscriptionTimeout);
      if (unsubscribe) { try { unsubscribe(); } catch { } }
    };
  }, []);

  // 3. Helper: Download File
  const handleDownload = (fileId: string) => {
    const bucketId = process.env.NEXT_PUBLIC_BUCKET_FILES!;
    const result = storage.getFileDownload(bucketId, fileId);
    window.open(result, '_blank');
  };

  // 4. Helper: Mark as Done
  const markComplete = async (orderId: string) => {
    if (processingOrders.has(orderId)) return; // Prevent double-clicks

    setProcessingOrders(prev => new Set(prev).add(orderId));

    try {
      const result = await completeOrder(orderId, userEmail);

      if (result.success) {
        toast({ title: "✓ Order Complete", description: "Order has been marked as delivered." });
        fetchOrders();
      } else {
        toast({
          title: "Error",
          description: result.error || "Could not update status",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Could not update status",
        variant: "destructive"
      });
    } finally {
      setProcessingOrders(prev => {
        const next = new Set(prev);
        next.delete(orderId);
        return next;
      });
    }
  };

  const parseConfig = (jsonStr: string) => {
    try { return JSON.parse(jsonStr); }
    catch { return { type: '?', copies: '?' }; }
  };

  const sendVerificationEmail = async () => {
    try {
      await account.createVerification(`${window.location.origin}/verify`);
      toast({ title: "Email Sent", description: "Verification link sent to your email." });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  // Derived stats
  const pendingOrders = orders.filter(o => o.status !== 'delivered');
  const completedOrders = orders.filter(o => o.status === 'delivered');
  const totalRevenue = completedOrders.reduce((sum, o) => sum + (o.total_price || 0), 0);
  const displayedOrders = activeTab === "pending" ? pendingOrders : completedOrders;

  return (
    <div className="max-w-7xl mx-auto space-y-6">

      {!isVerified && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 flex justify-between items-center shadow-sm">
          <div className="flex items-center">
            <Mail className="h-5 w-5 text-yellow-600 mr-2" />
            <div>
              <p className="font-bold text-yellow-700">Email not verified</p>
              <p className="text-sm text-yellow-600">Please verify your email to ensure account security.</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={sendVerificationEmail} className="border-yellow-400 text-yellow-700 hover:bg-yellow-100">
            Verify Email
          </Button>
        </div>
      )}

      {noShop ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-lg border-2 border-dashed border-gray-300 text-center space-y-4">
          <div className="bg-gray-100 p-4 rounded-full">
            <FileText className="h-10 w-10 text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">No Shop Linked</h2>
          <p className="text-gray-500 max-w-sm">
            This account is not linked to any print shop. Please contact the administrator or sign up properly as a shop owner.
          </p>
          <Button onClick={() => window.location.href = '/signup'} variant="outline">
            Go to Signup
          </Button>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">Print Queue</h1>
              <p className="text-gray-500">Manage incoming orders and downloads.</p>
            </div>
            <Button variant="outline" onClick={fetchOrders} size="sm">
              <RefreshCcw className="mr-2 h-4 w-4" /> Refresh
            </Button>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="border-orange-100 bg-orange-50">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="bg-orange-100 p-2 rounded-full">
                  <Clock className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-xs text-orange-600 font-medium uppercase">Pending</p>
                  <p className="text-2xl font-bold text-orange-700">{pendingOrders.length}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-green-100 bg-green-50">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-green-600 font-medium uppercase">Completed</p>
                  <p className="text-2xl font-bold text-green-700">{completedOrders.length}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-blue-100 bg-blue-50">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-blue-600 font-medium uppercase">Revenue</p>
                  <p className="text-2xl font-bold text-blue-700">{totalRevenue}৳</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
            <button
              onClick={() => setActiveTab("pending")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === "pending"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
                }`}
            >
              <span className="flex items-center gap-2">
                <ClipboardList className="h-4 w-4" />
                Pending
                {pendingOrders.length > 0 && (
                  <span className="bg-orange-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
                    {pendingOrders.length}
                  </span>
                )}
              </span>
            </button>
            <button
              onClick={() => setActiveTab("completed")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === "completed"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
                }`}
            >
              <span className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Completed ({completedOrders.length})
              </span>
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center p-20"><Loader2 className="h-10 w-10 animate-spin text-blue-500" /></div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {displayedOrders.map((order) => {
                const config = parseConfig(order.config);
                const isDone = order.status === 'delivered';

                return (
                  <Card key={order.$id} className={`transition-all ${isDone ? "opacity-70 bg-gray-50 border-gray-200" : "border-blue-200 shadow-sm hover:shadow-md"}`}>
                    <CardHeader className="pb-3 bg-gray-50/50 border-b">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <CardTitle className="text-base font-medium flex items-center gap-2">
                            <FileText className="h-4 w-4 text-gray-500" />
                            Order #{order.$id.substring(0, 6).toUpperCase()}
                          </CardTitle>
                          <CardDescription className="text-xs">
                            {new Date(order.created_at).toLocaleString()}
                          </CardDescription>
                        </div>
                        <Badge
                          className={isDone
                            ? "bg-green-100 text-green-700 border-green-200"
                            : "bg-orange-100 text-orange-700 border-orange-200"
                          }
                          variant="outline"
                        >
                          {isDone ? "Delivered" : "Pending"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-4">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="bg-gray-50 p-2 rounded text-center">
                          <span className="text-gray-500 block text-xs uppercase">Copies</span>
                          <span className="font-bold text-lg">{config.copies}</span>
                        </div>
                        <div className="bg-gray-50 p-2 rounded text-center">
                          <span className="text-gray-500 block text-xs uppercase">Type</span>
                          <span className={`font-bold ${config.type === 'color' ? 'text-pink-600' : 'text-gray-900'}`}>
                            {config.type === 'color' ? 'Color' : 'B&W'}
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-sm border-t pt-3">
                        <span className="text-gray-500">Total:</span>
                        <span className="font-bold text-lg text-green-700">{order.total_price}৳</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <Button
                          className="w-full"
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(order.file_id)}
                        >
                          <Download className="mr-1 h-4 w-4" /> PDF
                        </Button>

                        {!isDone ? (
                          <Button
                            className="w-full bg-green-600 hover:bg-green-700 text-white"
                            size="sm"
                            onClick={() => markComplete(order.$id)}
                            disabled={processingOrders.has(order.$id)}
                          >
                            {processingOrders.has(order.$id) ? (
                              <><Loader2 className="mr-1 h-4 w-4 animate-spin" /> Wait</>
                            ) : (
                              <><CheckCircle className="mr-1 h-4 w-4" /> Done</>
                            )}
                          </Button>
                        ) : (
                          <Button variant="ghost" size="sm" disabled className="w-full text-green-600">
                            <CheckCircle className="mr-1 h-4 w-4" /> Done
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              {displayedOrders.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-400 border-2 border-dashed rounded-lg bg-gray-50">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    {activeTab === "pending"
                      ? <ClipboardList className="h-8 w-8 text-gray-300" />
                      : <CheckCircle className="h-8 w-8 text-gray-300" />
                    }
                  </div>
                  <p className="text-lg font-medium">
                    {activeTab === "pending" ? "No pending orders" : "No completed orders yet"}
                  </p>
                  <p className="text-sm">
                    {activeTab === "pending" ? "New orders will appear here automatically." : "Completed orders will show here."}
                  </p>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}