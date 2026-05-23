'use client'

/**
 * logout.tsx
 *
 * Logout confirmation dialog.
 * Uses useLogout() mutation from React Query, which calls POST /auth/logout
 * then clears Zustand auth state.
 *
 * Removed: useAppDispatch, clearWalletState (Redux), handleInvalidSession (Parse).
 */

import { useRouter } from 'next/navigation'
import React from 'react'
import Modal from '../game/modal/ModalWindow'
import { useAuthStore } from '@/lib/auth-store'
import { useLogout } from '@/lib/queries'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const LogoutDialog = ({ open, onOpenChange }: Props) => {
  const router = useRouter()
  const clearAuth = useAuthStore((s) => s.clearAuth)
  const { mutate: logoutMutation, isPending } = useLogout()

  const handleLogout = () => {
    logoutMutation(undefined, {
      onSettled: () => {
        // Always clear local state and redirect — even if the API call fails
        clearAuth()
        onOpenChange(false)
        router.replace('/login')
      },
    })
  }

  return (
    <Modal
      open={open}
      handleClose={onOpenChange}
      redTitle
      title="Confirm Logout"
      actionBtnText="Log Out"
      actionOnClick={handleLogout}
      actionLoader={isPending}
    >
      <div>
        <p>Are you sure you want to log out of Quiz Money?</p>
      </div>
    </Modal>
  )
}

export default LogoutDialog
