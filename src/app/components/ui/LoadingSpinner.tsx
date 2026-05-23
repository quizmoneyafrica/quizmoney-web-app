/**
 * LoadingSpinner.tsx
 *
 * Single source of truth for all loading states.
 * Never create inline spinners or "Loading..." text in screens.
 *
 * Usage:
 *   <LoadingSpinner />
 *   <LoadingSpinner size="sm" />
 *   <LoadingSpinner size="lg" className="text-white" />
 */

'use client'

type SpinnerSize = 'sm' | 'md' | 'lg'

const SIZE_CLASSES: Record<SpinnerSize, string> = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-2',
  lg: 'h-12 w-12 border-[3px]',
}

interface LoadingSpinnerProps {
  size?: SpinnerSize
  className?: string
}

export default function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={`animate-spin rounded-full border-primary border-t-transparent ${SIZE_CLASSES[size]} ${className}`}
    />
  )
}

/** Full-screen loading state for route transitions */
export function FullScreenLoader() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <LoadingSpinner size="lg" />
    </div>
  )
}

/** Skeleton block — use for content placeholders */
export function SkeletonBlock({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-neutral-200 ${className}`} />
}
