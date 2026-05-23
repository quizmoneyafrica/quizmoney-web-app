'use client'

/**
 * rehydrationGuard.tsx
 *
 * Blocks render until Zustand has rehydrated from localStorage.
 * Replaces the old Redux version that waited for s.auth.rehydrated.
 *
 * Zustand sets hasHydrated = true in onRehydrateStorage callback.
 * QueryProvider also gates on hasHydrated — this guard is for any
 * component outside QueryProvider that needs to wait for auth.
 */

import { useAuthStore } from '@/lib/auth-store'
import AppLoader from '../loader/loader'

export default function RehydrationGuard({
  children,
}: {
  children: React.ReactNode
}) {
  const hasHydrated = useAuthStore((s) => s.hasHydrated)

  if (!hasHydrated) {
    return <AppLoader />
  }

  return <>{children}</>
}
