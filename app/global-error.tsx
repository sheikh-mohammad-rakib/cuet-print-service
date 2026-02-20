'use client'

import { useEffect } from 'react'

/**
 * global-error.tsx catches errors thrown in the root layout.
 * It MUST include <html> and <body> tags because it replaces the layout entirely.
 */
export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error('[Global Error]', error)
    }, [error])

    return (
        <html lang="en">
            <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', background: '#09090b', color: '#fafafa' }}>
                <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                    <div style={{ textAlign: 'center', maxWidth: '28rem' }}>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>Something went wrong</h1>
                        <p style={{ color: '#a1a1aa', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                            {error.message || 'A critical error occurred. Please refresh the page.'}
                        </p>
                        {error.digest && (
                            <p style={{ color: '#71717a', fontSize: '0.75rem', fontFamily: 'monospace', marginBottom: '1rem' }}>
                                Error ID: {error.digest}
                            </p>
                        )}
                        <button
                            onClick={reset}
                            style={{ padding: '0.5rem 1.25rem', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '0.375rem', cursor: 'pointer', fontSize: '0.875rem' }}
                        >
                            Try again
                        </button>
                    </div>
                </div>
            </body>
        </html>
    )
}
