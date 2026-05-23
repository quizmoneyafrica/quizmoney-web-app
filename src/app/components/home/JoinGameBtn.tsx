'use client'

import { toastPosition } from '@/app/utils/utils'
import { Spinner } from '@radix-ui/themes'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from 'sonner'
import { api } from '@/lib/api-client'

interface JoinGameBtnProps {
  gameId: string
}

function JoinGameBtn({ gameId }: JoinGameBtnProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleJoinBtn = async () => {
    if (!gameId) {
      toast.error('No active game to join', { position: toastPosition })
      return
    }
    setLoading(true)
    try {
      // Game joining is socket-based — navigate to the live game room.
      // The live-game screen emits game:join via Socket.io on mount.
      // TODO: if a REST pre-register endpoint is added (e.g. POST /api/game/register/:id),
      //       call it here before navigating.
      await api.post(`/api/game/register/${gameId}`).catch(() => {
        // No HTTP register endpoint currently — proceed to socket join
      })
      router.replace(`/live-game/${gameId}`)
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || 'Failed to join game'
      toast.error(msg, { position: toastPosition })
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleJoinBtn}
      disabled={loading}
      className="bg-white border border-white rounded-full px-4 py-1 text-primary-900 font-medium cursor-pointer flex items-center gap-1 text-nowrap"
    >
      <i className="bi bi-play-circle mb-1 relative">
        <i className="bi bi-play-circle mb-1 animate-ping absolute left-0 top-0"></i>
      </i>
      {loading ? <Spinner /> : 'Join Live Game!'}
    </button>
  )
}

export default JoinGameBtn
