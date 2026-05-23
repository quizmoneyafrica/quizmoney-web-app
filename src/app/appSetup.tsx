'use client'

/**
 * appSetup.tsx
 *
 * Root app wrapper. Provides:
 *   - Radix Theme (light)
 *   - QueryProvider (React Query + Zustand hydration gate)
 *   - Toaster (Sonner)
 *   - FCM push token hook
 *   - AudioManager for live game sounds
 *   - iOS PWA permission guide
 *
 * Redux Provider and PersistGate have been removed — auth state is
 * now handled by Zustand (useAuthStore) and server state by React Query.
 */

import React, { ReactNode, useEffect } from 'react'
import { Theme } from '@radix-ui/themes'
import EnablePushOnIosButton from './pwa/iosNotificationRequest'
import { Toaster } from '@/app/components/toaster/sonner'
import useFcmToken from './hooks/useFcmToken'
import { disableConsoleInProduction, isIosPwaInstalled } from './utils/utils'
import PermissionGuide from './pwa/permissionGuide'
import AudioManager from './(screens)/(liveGame)/live-game/cmp/GameAudioManager'
import { isMobile } from 'react-device-detect'
import QueryProvider from '@/components/query-provider'

type Props = {
  children: ReactNode
}

const AppSetup = ({ children }: Props) => {
  const { token, notificationPermissionStatus } = useFcmToken()

  const isVisible =
    notificationPermissionStatus === 'default' ||
    notificationPermissionStatus === 'denied'

  useEffect(() => {
    disableConsoleInProduction()
    window.scrollTo(0, 0)
    const viewport = document.querySelector('meta[name=viewport]')
    if (viewport) {
      viewport.setAttribute(
        'content',
        'width=device-width, initial-scale=1, maximum-scale=1',
      )
    }
  }, [])

  useEffect(() => {
    if (!isMobile) {
      let devtoolsOpen = false
      const threshold = 160
      const check = () => {
        const widthThreshold = window.outerWidth - window.innerWidth > threshold
        const heightThreshold = window.outerHeight - window.innerHeight > threshold
        if (widthThreshold || heightThreshold) {
          devtoolsOpen = true
        }
      }
      setInterval(() => {
        check()
        if (devtoolsOpen) {
          // window.location.href = '/blocked'
        }
      }, 1000)
    }
  }, [])

  return (
    <Theme appearance="light" className="!font-text">
      <QueryProvider>
        {isVisible && !token && !isIosPwaInstalled() && <PermissionGuide />}
        <Toaster appearance="light" />
        <EnablePushOnIosButton />
        <AudioManager />
        {children}
      </QueryProvider>
    </Theme>
  )
}

export default AppSetup
