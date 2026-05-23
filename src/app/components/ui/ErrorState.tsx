/**
 * ErrorState.tsx
 *
 * Consistent error display for failed queries.
 * Always used inside QueryWrapper — rarely needed directly.
 *
 * Usage:
 *   <ErrorState message="Failed to load balance" onRetry={refetch} />
 */

'use client'

import { AlertCircle } from 'lucide-react'

interface ErrorStateProps {
  message?: string
  onRetry?: () => void
  className?: string
}

export default function ErrorState({
  message = 'Something went wrong',
  onRetry,
  className = '',
}: ErrorStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 py-12 text-center ${className}`}>
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
        <AlertCircle className="h-8 w-8 text-red-400" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-semibold text-neutral-700">Error</p>
        <p className="text-xs text-neutral-400">{message}</p>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-1 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white active:opacity-80"
        >
          Try again
        </button>
      )}
    </div>
  )
}
