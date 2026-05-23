'use client'

/**
 * checkSession.tsx
 *
 * Previously handled boot-time token refresh by calling the old
 * Parse/handleInvalidSession layer. This is now a no-op — the Axios
 * response interceptor in src/lib/api-client.ts automatically handles
 * 401 responses by refreshing the token and retrying the request.
 *
 * This component is kept as a stub so existing layout.tsx imports
 * don't break during migration. It can be removed once all screens
 * have been verified against the new auth flow.
 */

export default function CheckSession() {
  return null
}
