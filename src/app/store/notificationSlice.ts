/* eslint-disable */
// STUB — notifications come via FCM push; no REST polling

export type Content = {
  id: string
  [key: string]: any
}

export const setNotificationsCount = (_v: number) => ({ type: 'stub/setNotificationsCount' })
export const setNotifications = (_v: any) => ({ type: 'stub/setNotifications' })

export default function notificationReducer(
  state = { notificationCount: 0, notifications: [] },
  _action: any,
) {
  return state
}

export const appendNotifications = (_v: any) => ({ type: 'stub/appendNotifications' })
export const clearNotifications = () => ({ type: 'stub/clearNotifications' })
