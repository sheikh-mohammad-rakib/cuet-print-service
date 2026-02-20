/**
 * Admin Panel — Server Component
 *
 * Fetches pending shops on the server using the admin client (bypasses RLS).
 * The fetch is wrapped in 'use cache' + cacheTag so it is only re-fetched when
 * approveShopAction calls revalidateTag('pending-shops').
 *
 * Static shell (heading, card wrapper) is prerendered at build time.
 * The shop list streams in from the cache on first request.
 */
import { cacheLife, cacheTag } from 'next/cache'
import { adminDatabases } from '@/lib/server-appwrite'
import { Query } from 'node-appwrite'
import { Store } from 'lucide-react'
import { ShopApprovalList } from './_components/ShopApprovalList'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Admin Panel' }

async function getPendingShops() {
  'use cache'
  cacheLife('minutes')           // Revalidate every few minutes in background
  cacheTag('pending-shops')       // Invalidated immediately by approveShopAction

  const dbId = process.env.NEXT_PUBLIC_DB_ID!
  const shopColId = process.env.NEXT_PUBLIC_COLLECTION_SHOPS!

  const response = await adminDatabases.listDocuments(dbId, shopColId, [
    Query.equal('is_active', false),
  ])

  // Return plain objects — no class instances to client boundary
  return response.documents.map((doc) => ({
    $id: doc.$id,
    shopName: doc.shopName as string,
    location: doc.location as string | undefined,
    ownerEmail: doc.ownerEmail as string | undefined,
    price_bw: doc.price_bw as number | undefined,
    price_color: doc.price_color as number | undefined,
  }))
}

export default async function AdminDashboard() {
  const pendingShops = await getPendingShops()

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Static shell — prerendered at build time */}
      <div>
        <h1 className="text-3xl font-bold">Pending Approvals</h1>
        <p className="text-slate-400">New shops waiting for verification.</p>
      </div>

      {/* Cached shop list — streams in from cache */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pendingShops.map((shop) => (
          <div key={shop.$id} className="rounded-xl border bg-slate-800 border-slate-700 text-slate-100 p-5 space-y-4 shadow-sm">
            <div>
              <div className="flex items-center gap-2 font-semibold text-lg">
                <Store className="h-5 w-5 text-blue-400" />
                {shop.shopName}
              </div>
              {shop.location && (
                <p className="text-slate-400 text-sm mt-0.5">{shop.location}</p>
              )}
            </div>

            <div className="text-sm space-y-1">
              {shop.ownerEmail && (
                <p><span className="text-slate-500">Owner:</span> {shop.ownerEmail}</p>
              )}
              {shop.price_bw !== undefined && (
                <p><span className="text-slate-500">B&W Price:</span> {shop.price_bw}৳</p>
              )}
              {shop.price_color !== undefined && (
                <p><span className="text-slate-500">Color Price:</span> {shop.price_color}৳</p>
              )}
            </div>

            {/* Interactive approve/reject — Client Component */}
            <ShopApprovalList shops={[shop]} />
          </div>
        ))}

        {pendingShops.length === 0 && (
          <div className="col-span-full p-12 text-center border-2 border-dashed border-slate-800 rounded-lg text-slate-500">
            No pending shops found.
          </div>
        )}
      </div>
    </div>
  )
}