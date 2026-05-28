'use client'

import { toastPosition } from '@/app/utils/utils'
import { Spinner } from '@radix-ui/themes'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from 'sonner'
import { useLiveGameStore } from '@/lib/live-game-store'

interface JoinGameBtnProps {
  gameId: string
}

function JoinGameBtn({ gameId }: JoinGameBtnProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const reset = useLiveGameStore((s) => s.reset)

  const handleJoinBtn = () => {
    if (!gameId) {
      toast.error('No active game to join', { position: toastPosition })
      return
    }
    setLoading(true)
    // Reset any previous game state before navigating
    reset()
    router.push(`/live-game/${gameId}`)
  }

  return (
    <button
      onClick={handleJoinBtn}
      disabled={loading}
      className="bg-white border border-white rounded-full px-4 py-1 text-primary-900 font-medium cursor-pointer flex items-center gap-1 text-nowrap"
    >
      <i className="bi bi-play-circle mb-1 relative">
        <i className="bi bi-play-circle mb-1 animate-ping absolute left-0 top-0" />
      </i>
      {loading ? <Spinner /> : 'Join Live Game!'}
    </button>
  )
}

export default JoinGameBtn
