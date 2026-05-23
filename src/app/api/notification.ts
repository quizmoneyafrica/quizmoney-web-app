/**
 * notification.ts
 *
 * Push notification device token registration.
 * Replaces old notification.ts which called: notifications/count, notifications (GET), notifications/:id (GET)
 *
 * NOTE: The new backend handles notifications via Firebase Cloud Messaging (FCM).
 * - Device token registration goes to /api/push/subscribe
 * - Notification data is delivered via FCM push, not polled via REST
 * - If you need an in-app notification list, confirm the endpoint with the backend team first
 */

import { apiClient } from '@/lib/api-client'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PushSubscribeBody {
  /** Firebase Cloud Messaging device token */
  fcm_token: string
}

// ─── Notification API ─────────────────────────────────────────────────────────

const NotificationAPI = {
  /**
   * Register an FCM device token for push notifications.
   * Call this after obtaining the FCM token in useFcmToken.ts.
   */
  subscribe(body: PushSubscribeBody): Promise<{ success: boolean; message: string }> {
    return apiClient.post('/api/push/subscribe', body)
  },

  /**
   * Unregister the FCM device token (on logout).
   */
  unsubscribe(body: PushSubscribeBody): Promise<{ success: boolean; message: string }> {
    return apiClient.post('/api/push/unsubscribe', body)
  },

  // Legacy aliases — un-migrated notification screen still calls these
  /* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */
  fetchNotifications: async (..._args: any[]) =>
    Promise.resolve({ success: false as const, data: { content: [] as any[], pageNo: 0, last: true } }),
  fetchNotificationsCount: async () =>
    Promise.resolve({ success: false as const, data: { count: 0 } }),
  readNotification: async (..._args: any[]) =>
    Promise.resolve({ success: false as const, data: {} as any }),
  /* eslint-enable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */
}

export default NotificationAPI
