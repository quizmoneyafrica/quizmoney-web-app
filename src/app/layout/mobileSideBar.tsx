'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Avatar, Flex, Grid, Separator, Text } from '@radix-ui/themes'
import { navSidebar } from './nav'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '../hooks/useAuth'
import { VerifiedBadge } from '../icons/icons'
import { MenuToggle } from './MenuToggle'
import { useKycStep } from '../hooks/useKycStep'
import { useGameZoneStore } from '@/lib/game-zone-store'

const sidebarVariants = {
  open: {
    x: 0,
    transition: { type: 'spring', stiffness: 100, damping: 20 },
  },
  closed: {
    x: '-100%',
    transition: { type: 'spring', stiffness: 300, damping: 30 },
  },
}

const variants = {
  open: {
    transition: { staggerChildren: 0.07, delayChildren: 0.2 },
  },
  closed: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
}

interface Prop {
  isOpen: boolean
  toggle: () => void
}

const MobileSideBar = ({ isOpen, toggle }: Prop) => {
  const router = useRouter()
  const pathname = usePathname()
  const { user } = useAuth()
  const { status } = useKycStep()
  const setZonePhase = useGameZoneStore((s) => s.setZonePhase)
  const playZoneAudio = useGameZoneStore((s) => s.playZoneAudio)

  const isVerified = status?.bvn_verified ?? false

  const handleTabRoute = (path: string) => {
    if (pathname !== path) {
      router.push(path)
      window.scrollTo(0, 0)
      toggle()
    }
  }

  return (
    <>
      {/* Always-visible toggle button */}
      <div className="fixed top-0 left-0 z-50">
        <MenuToggle toggle={toggle} />
      </div>

      {/* Background overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={toggle} />
      )}

      <motion.nav
        initial={false}
        animate={isOpen ? 'open' : 'closed'}
        variants={sidebarVariants}
        className="fixed top-0 left-0 h-screen w-[80%] bg-primary-900 z-50 shadow-2xl"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={(_event, info) => {
          if (info.offset.x < -100) {
            toggle()
          }
        }}
      >
        <MenuToggle toggle={toggle} />

        <motion.section
          animate={{ y: isOpen ? 0 : 1000 }}
          transition={{ duration: 0.5 }}
          className="px-2 pt-16"
        >
          <Grid gap="5">
            {/* User Info */}
            <motion.div
              className="text-white pl-4 pb-2 cursor-pointer"
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                router.push('/settings/profile')
                toggle()
              }}
            >
              <Flex gap="2">
                <Avatar
                  src={user?.avatar_url ?? undefined}
                  fallback={user?.username?.charAt(0).toUpperCase() || ''}
                  radius="full"
                  className="bg-primary-50 border-3"
                  size="4"
                />
                <Grid>
                  <Flex align="center" gap="2">
                    <h2 className="capitalize">
                      {user?.username}
                    </h2>
                    {isVerified && <VerifiedBadge />}
                  </Flex>
                  <p className="text-xs text-gray-400 lowercase font-normal">
                    {user?.email}
                  </p>
                </Grid>
              </Flex>
            </motion.div>

            <Separator size="4" color="blue" />

            {/* Sidebar nav links */}
            <motion.div variants={variants} className="relative grid">
              {navSidebar.map((nav, index) => {
                const isActive =
                  pathname === nav.path || pathname.startsWith(nav.path + '/')
                return (
                  <motion.button
                    layout
                    key={index}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      handleTabRoute(nav.path)
                      if (nav.path === 'game-zone') {
                        setZonePhase('zone')
                        playZoneAudio()
                      }
                    }}
                    className={`relative cursor-pointer transition text-sm py-4 px-4 text-left rounded-[8px] ${
                      isActive
                        ? 'text-white font-semibold bg-primary-500'
                        : 'text-primary-300'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="nav-active-indicator"
                        className="absolute inset-0 bg-primary-500 rounded-[8px] z-0"
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    )}
                    <Flex
                      align="center"
                      gap="3"
                      className={`relative z-10 ${
                        isActive ? 'text-white font-semibold' : 'text-primary-300'
                      }`}
                    >
                      {nav.icon}
                      <Text>{nav.name}</Text>
                    </Flex>
                  </motion.button>
                )
              })}
            </motion.div>
          </Grid>
        </motion.section>
      </motion.nav>
    </>
  )
}

export default MobileSideBar
