/**
 * QueryWrapper.tsx
 *
 * Wraps any data-dependent UI section with loading, error, and empty states.
 * Use this instead of repeating if(isLoading)/if(error)/if(!data) in every component.
 *
 * Usage:
 *   <QueryWrapper isLoading={isLoading} error={error} isEmpty={!data?.length} emptyMessage="No transactions yet">
 *     {data?.map(item => <TransactionRow key={item.id} item={item} />)}
 *   </QueryWrapper>
 */

'use client'

import LoadingSpinner from '@/app/components/ui/LoadingSpinner'
import ErrorState from '@/app/components/ui/ErrorState'
import EmptyState from '@/app/components/ui/EmptyState'

interface QueryWrapperProps {
  isLoading: boolean
  error?: Error | null
  isEmpty?: boolean
  emptyMessage?: string
  emptyTitle?: string
  /** Override loading UI */
  loadingFallback?: React.ReactNode
  onRetry?: () => void
  children: React.ReactNode
}

export default function QueryWrapper({
  isLoading,
  error,
  isEmpty = false,
  emptyMessage = 'Nothing to show here yet',
  emptyTitle = 'No data',
  loadingFallback,
  onRetry,
  children,
}: QueryWrapperProps) {
  if (isLoading) {
    return loadingFallback ?? (
      <div className="flex w-full items-center justify-center py-12">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <ErrorState
        message={error.message || 'Something went wrong'}
        onRetry={onRetry}
      />
    )
  }

  if (isEmpty) {
    return <EmptyState title={emptyTitle} description={emptyMessage} />
  }

  return <>{children}</>
}
