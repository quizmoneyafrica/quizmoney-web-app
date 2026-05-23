'use client'

/**
 * Tabs layout
 *
 * Prefetches the main tab routes on mount for instant navigation.
 *
 * Removed:
 *   - useAppDispatch / setIsAllowedInGame — gameSlice (Redux) has been deleted.
 *     Game access control is now handled server-side via the game session API.
 */

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    router.prefetch('/home')
    router.prefetch('/wallet')
    router.prefetch('/store')
    router.prefetch('/leaderboard')
    router.prefetch('/settings')
    router.prefetch('/support')
  }, [router])

  return <main>{children}</main>
}
