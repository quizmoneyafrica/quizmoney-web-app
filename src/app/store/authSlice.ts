/* eslint-disable */
// STUB — auth state has moved to src/lib/auth-store.ts (Zustand)
// This file prevents build errors while un-migrated screens are still importing from here.
// When migrating a screen: replace all imports from this file with useAuthStore from '@/lib/auth-store'

export type UserObject = {
  id?: string
  username?: string
  email?: string
  firstName?: string
  lastName?: string
  avatarUrl?: string | null
  gameEraserCount?: number
  [key: string]: any
}

export type LoginPayload = {
  user: UserObject
  accessToken: string
  refreshToken: string
}

// No-op action creators — dispatching these does nothing
export const login = (_payload: LoginPayload) => ({ type: 'stub/login', payload: _payload })
export const logout = () => ({ type: 'stub/logout' })
export const updateUser = (_payload: Partial<UserObject>) => ({ type: 'stub/updateUser', payload: _payload })
export const setRehydrated = (_value: boolean) => ({ type: 'stub/setRehydrated', payload: _value })

export default function authReducer(state = {}, _action: any) {
  return state
}

export const setShowOtpVerification = (_v: boolean) => ({ type: 'stub/setShowOtpVerification' })
export const setOpenModal = (_v: boolean) => ({ type: 'stub/setOpenModal' })
