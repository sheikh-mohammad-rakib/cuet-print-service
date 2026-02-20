import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FileQuestion } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Page Not Found',
}

export default function NotFound() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <div className="text-center max-w-md space-y-4">
                <div className="flex justify-center">
                    <FileQuestion className="h-14 w-14 text-muted-foreground" />
                </div>
                <h1 className="text-4xl font-bold tracking-tight">404</h1>
                <h2 className="text-xl font-semibold">Page not found</h2>
                <p className="text-muted-foreground text-sm">
                    The page you&apos;re looking for doesn&apos;t exist or has been moved.
                </p>
                <div className="flex gap-3 justify-center">
                    <Button asChild>
                        <Link href="/">Go home</Link>
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href="/login">Log in</Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}
