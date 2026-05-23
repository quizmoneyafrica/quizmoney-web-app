/**
 * EmptyState.tsx
 *
 * Consistent empty state for lists, leaderboards, transaction history, etc.
 *
 * Usage:
 *   <EmptyState title="No transactions" description="Your history will appear here" />
 *   <EmptyState icon={<TrophyIcon />} title="No games yet" description="Play your first game" action={<JoinGameBtn />} />
 */

'use client'

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 py-12 text-center ${className}`}>
      {icon && (
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100 text-neutral-400">
          {icon}
        </div>
      )}
      <div className="space-y-1">
        <p className="text-sm font-semibold text-neutral-700">{title}</p>
        {description && (
          <p className="text-xs text-neutral-400">{description}</p>
        )}
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}
