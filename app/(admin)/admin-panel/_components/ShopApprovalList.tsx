'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Check, X, Loader2 } from 'lucide-react'
import { approveShopAction } from '@/app/actions/approveShop'

interface Shop {
    $id: string
    shopName: string
}

export function ShopApprovalList({ shops }: { shops: Shop[] }) {
    const router = useRouter()
    const [loadingId, setLoadingId] = useState<string | null>(null)

    const handleApprove = async (shopId: string) => {
        setLoadingId(shopId)
        try {
            await approveShopAction(shopId)
            // Refresh the server component data (re-fetches the cached shop list)
            router.refresh()
        } finally {
            setLoadingId(null)
        }
    }

    if (shops.length === 0) {
        return (
            <p className="text-muted-foreground text-sm py-8 text-center">
                No pending shops awaiting approval.
            </p>
        )
    }

    return (
        <ul className="space-y-3">
            {shops.map((shop) => (
                <li
                    key={shop.$id}
                    className="flex items-center justify-between rounded-lg border bg-card px-4 py-3 shadow-sm"
                >
                    <div>
                        <p className="font-medium">{shop.shopName}</p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            disabled={loadingId === shop.$id}
                            onClick={() => handleApprove(shop.$id)}
                        >
                            {loadingId === shop.$id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <>
                                    <Check className="mr-1 h-4 w-4" /> Approve
                                </>
                            )}
                        </Button>
                        <Button variant="destructive" size="icon" disabled title="Reject feature coming soon">
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </li>
            ))}
        </ul>
    )
}
