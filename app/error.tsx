'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error('[App Error]', error)
    }, [error])

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <div className="text-center max-w-md space-y-4">
                <div className="flex justify-center">
                    <AlertTriangle className="h-12 w-12 text-destructive" />
                </div>
                <h2 className="text-2xl font-semibold tracking-tight">Something went wrong</h2>
                <p className="text-muted-foreground text-sm">{error.message || 'An unexpected error occurred.'}</p>
                {error.digest && (
                    <p className="text-xs text-muted-foreground font-mono">Error ID: {error.digest}</p>
                )}
                <Button onClick={reset}>Try again</Button>
            </div>
        </div>
    )
}
