/**
 * AvatarWithFallback.tsx
 *
 * Player avatar with initials fallback when no image is set.
 * Used on profile pages, leaderboard rows, game lobby, nav header.
 *
 * Usage:
 *   <AvatarWithFallback src={player.avatar_url} username="Tosin" size="md" />
 */

'use client'

import Image from 'next/image'
import { useState } from 'react'

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

const SIZE_CLASSES: Record<AvatarSize, string> = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-base',
  xl: 'w-20 h-20 text-xl',
}

const SIZE_PX: Record<AvatarSize, number> = {
  xs: 24, sm: 32, md: 40, lg: 56, xl: 80,
}

interface AvatarWithFallbackProps {
  src?: string | null
  username?: string | null
  size?: AvatarSize
  className?: string
}

function getInitials(username?: string | null): string {
  if (!username) return '?'
  return username.slice(0, 2).toUpperCase()
}

export default function AvatarWithFallback({
  src,
  username,
  size = 'md',
  className = '',
}: AvatarWithFallbackProps) {
  const [imgError, setImgError] = useState(false)
  const sizeClass = SIZE_CLASSES[size]
  const px = SIZE_PX[size]

  if (src && !imgError) {
    return (
      <div className={`relative overflow-hidden rounded-full ${sizeClass} ${className}`}>
        <Image
          src={src}
          alt={username ?? 'Player avatar'}
          width={px}
          height={px}
          className="object-cover"
          onError={() => setImgError(true)}
        />
      </div>
    )
  }

  return (
    <div
      className={`flex items-center justify-center rounded-full bg-primary font-semibold text-white ${sizeClass} ${className}`}
    >
      {getInitials(username)}
    </div>
  )
}
