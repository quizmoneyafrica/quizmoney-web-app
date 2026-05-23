/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

/**
 * appHeader.tsx
 *
 * App shell header — shown on all authenticated screens.
 *
 * Migration notes:
 * - Removed Redux useDispatch / notificationSlice (notifications come via FCM push)
 * - Notification count now starts at 0; FCM service worker updates badge via
 *   the Notification API — no REST polling needed
 * - useKycStep now returns flat `status` object (not customerKyc array)
 * - Coin balance comes from user profile (user.qmCoinBalance)
 * - Eraser count comes from user profile (user.gameEraserCount)
 */

import { EraserIcon, QuestionMarkCircledIcon } from '@radix-ui/react-icons'
import { Avatar, Container, Flex, Heading } from '@radix-ui/themes'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import {
  ArrowDownFillIcon,
  BellIcon,
  CircleArrowLeft,
  LogoutIcon,
  PersonIcon,
  QMCoin,
  SupportIcon,
  VerifiedBadge,
} from '../icons/icons'
import { useAuth } from '../hooks/useAuth'
import { DropdownMenu } from 'radix-ui'
import LogoutDialog from '../components/logout/logout'
import { motion, useCycle } from 'framer-motion'
import MobileSideBar from './mobileSideBar'
import { useKycStep } from '../hooks/useKycStep'

const useDimensions = (ref: any) => {
  const dimensions = useRef({ width: 0, height: 0 })
  useEffect(() => {
    dimensions.current.width = ref.current.offsetWidth
    dimensions.current.height = ref.current.offsetHeight
  }, [ref])
  return dimensions.current
}

function AppHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const [openLogout, setOpenLogout] = useState(false)
  const { user } = useAuth()
  const { status } = useKycStep()

  const isVerified = status?.bvn_verified ?? false

  // Notification count — FCM delivers push notifications; badge is managed
  // by the service worker. No REST polling needed.
  const [notificationCount] = useState(0)

  // Mobile menu
  const [isOpen, toggleOpen] = useCycle(false, true)
  const containerRef = useRef(null)
  const { height } = useDimensions(containerRef)

  const excludedPaths = ['/practice-game']
  if (excludedPaths.includes(pathname)) return null

  const lastSegment =
    pathname
      .split('/')
      .filter(Boolean)
      .pop()
      ?.replace(/-/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase()) || ''

  const isPin = () => pathname.includes('wallet') && pathname.includes('pin')
  const isVerifyOtp = () =>
    pathname.includes('wallet') && pathname.includes('verify-otp')

  return (
    <div className="pb-4 relative">
      <motion.nav
        initial={false}
        animate={isOpen ? 'open' : 'closed'}
        custom={height}
        ref={containerRef}
        className={`lg:hidden relative bg-green-100 -top-4 -left-5 ${
          !isOpen && '-ml-1 w-screen'
        }`}
      >
        <MobileSideBar isOpen={isOpen} toggle={() => toggleOpen()} />
      </motion.nav>

      <Flex align="center" justify="between" gap="2">
        <Heading
          size={{ initial: '4', lg: '5' }}
          className="capitalize flex items-center flex-wrap overflow-hidden text-ellipsis whitespace-nowrap max-w-[200px] sm:max-w-none"
        >
          <div className="relative flex-row flex items-center gap-2">
            {(pathname.split('/').length > 2 ||
              pathname.includes('notification') ||
              pathname.includes('kyc')) && (
              <button onClick={() => router?.back()} className="cursor-pointer">
                <CircleArrowLeft />
              </button>
            )}
            <div className="hidden lg:block">
              {lastSegment === 'Home' ? (
                <span className="flex items-center gap-1 capitalize font-bold">
                  Welcome, {user?.first_name || ''}
                  {isVerified ? (
                    <VerifiedBadge className="text-primary-900" />
                  ) : (
                    '👋'
                  )}
                </span>
              ) : isVerifyOtp() || isPin() ? (
                <span className="flex capitalize font-bold">Reset Pin</span>
              ) : (
                <span className="flex capitalize font-bold">{lastSegment}</span>
              )}
            </div>
          </div>
        </Heading>

        <Flex align="center" gap={{ initial: '1', lg: '6' }}>
          <Link href="/wallet?tab=coin">
            <Flex
              align="center"
              gap="1"
              className="rounded-full text-xs border-2 py-1 px-2 border-neutral-400 text-neutral-500 hover:border-primary-500 hover:text-primary-900 cursor-pointer"
            >
              <QMCoin width={15} height={15} />
              <span>{(user as any)?.qmCoinBalance ?? 0}</span>
            </Flex>
          </Link>

          <Link href="/store">
            <Flex
              align="center"
              gap="1"
              className="rounded-full text-xs border-2 py-1 px-2 border-neutral-400 text-neutral-500 hover:border-primary-500 hover:text-primary-900 cursor-pointer"
            >
              <EraserIcon />
              <span>{user?.gameEraserCount ?? 0}</span>
            </Flex>
          </Link>

          <Link
            href="/notification"
            className="text-neutral-600 hover:text-primary-900 relative"
          >
            <BellIcon />
            {notificationCount > 0 && (
              <div className="flex items-center justify-center h-4.5 w-4.5 rounded-full bg-primary-900 absolute -top-1 -right-1 text-white text-[0.5rem]">
                {notificationCount > 99 ? '99+' : notificationCount}
              </div>
            )}
          </Link>

          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <Container className="bg-white border border-primary-50 lg:border-none rounded-full p-1 lg:px-2 lg:py-1 cursor-pointer">
                <Flex align="center" gap="2">
                  <Avatar
                    src={user?.avatar_url ?? undefined}
                    fallback={user?.first_name?.charAt(0).toUpperCase() || ''}
                    radius="full"
                    className="bg-primary-50"
                  />
                  <p className="hidden lg:flex text-[#1B212D] capitalize font-medium">
                    {user?.first_name} {user?.last_name}
                  </p>
                  <ArrowDownFillIcon className="text-neutral-500 hidden lg:flex" />
                </Flex>
              </Container>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content className="DropdownMenuContent" sideOffset={5}>
                <DropdownMenu.Item
                  className="DropdownMenuItem"
                  onClick={() => router.push('/settings/profile')}
                >
                  My Profile{' '}
                  <span className="RightSlot">
                    <PersonIcon />
                  </span>
                </DropdownMenu.Item>

                <DropdownMenu.Item
                  className="DropdownMenuItem"
                  onClick={() => router.push('/support')}
                >
                  Support{' '}
                  <span className="RightSlot">
                    <SupportIcon />
                  </span>
                </DropdownMenu.Item>

                <Link href="https://quizmoney.ng/how-it-works" target="_blank">
                  <DropdownMenu.Item className="DropdownMenuItem">
                    How It Works{' '}
                    <span className="RightSlot">
                      <QuestionMarkCircledIcon />
                    </span>
                  </DropdownMenu.Item>
                </Link>

                <DropdownMenu.Item
                  onSelect={() => setOpenLogout(true)}
                  className="DropdownMenuItem hover:!bg-error-900"
                >
                  Logout{' '}
                  <span className="RightSlot">
                    <LogoutIcon />
                  </span>
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </Flex>
      </Flex>

      {/* Mobile page title */}
      <div className="lg:hidden">
        {lastSegment === 'Home' ? (
          <span className="flex items-center gap-1 capitalize font-bold">
            Welcome, {user?.first_name || ''}
            {isVerified ? <VerifiedBadge className="text-primary-900" /> : '👋'}
          </span>
        ) : isVerifyOtp() || isPin() ? (
          <span className="flex capitalize font-bold">Reset Pin</span>
        ) : (
          <span className="flex capitalize font-bold">{lastSegment}</span>
        )}
      </div>

      <LogoutDialog open={openLogout} onOpenChange={setOpenLogout} />
    </div>
  )
}

export default AppHeader
