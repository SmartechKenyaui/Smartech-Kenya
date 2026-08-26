'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => { console.error(error) }, [error])

  return (
    <div className="min-h-screen bg-cream pt-[68px] flex items-center justify-center px-6">
      <div className="text-center max-w-md">

        <div className="font-display text-[7rem] text-cream-warm leading-none mb-2 select-none">!</div>

        <h2 className="font-display text-ink font-light mb-3"
          style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)' }}>
          Something went wrong
        </h2>
        <p className="text-ink-faint text-sm mb-8 leading-relaxed">
          An unexpected error occurred. You can try again or return to the homepage.
        </p>

        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="btn-dark px-7 py-3.5"
          >
            Try Again
          </button>
          <Link href="/" className="btn-cream px-7 py-3.5">
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}
