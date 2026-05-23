/**
 * query-provider.tsx
 *
 * TanStack React Query provider.
 * Mirrors the pattern from qm-admin-pwa-1/src/components/query-provider.tsx.
 *
 * Waits for Zustand to rehydrate from localStorage before rendering children.
 * This prevents flashes of unauthenticated content on page load.
 */

'use client'

import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useAuthStore } from '@/lib/auth-store'

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const hasHydrated = useAuthStore((state) => state.hasHydrated)

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60,      // 1 minute default stale time
            gcTime: 1000 * 60 * 5,     // 5 minute garbage collection
            retry: (failureCount, error: unknown) => {
              // Never retry on auth or not-found errors
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const status = (error as any)?.response?.status
              if ([401, 403, 404].includes(status)) return false
              return failureCount < 2
            },
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: false,
          },
        },
      }),
  )

  // Wait for Zustand to finish reading from localStorage
  // Prevents briefly showing the wrong UI state on page load
  if (!hasHydrated) return null

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} position="bottom" />
      )}
    </QueryClientProvider>
  )
}
