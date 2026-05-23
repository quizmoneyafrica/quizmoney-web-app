# QuizMoney Player App — Claude Code Instructions

## 1. Project Identity

- **App:** QuizMoney Player PWA
- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS
- **Auth State:** Zustand (with persist middleware) — see `src/lib/auth-store.ts`
- **Server State:** TanStack React Query — see `src/lib/queries.ts`
- **PWA:** next-pwa configured — do not touch `next.config.ts` unless instructed
- **Viewport:** Mobile-first — all UI decisions prioritise 375px

---

## 2. Migration Context — READ THIS FIRST

This project has gone through **two previous backends**:

1. **Parse/Back4App** — used `X-Parse-Application-Id` headers and a `/api/parse` proxy
2. **AWS Elastic Beanstalk** (`https://frontoffice-prod.quizmoney.ng/api/v1`) — same proxy pattern

Both backends used `callParseEndpoint` / `callWithSessionToken` helper functions.
**We are now on Backend #3: a Fastify server at `https://quizmoneybe.fly.dev`.**

We are also **removing Redux entirely** and replacing it with:
- **Zustand** for auth state (user object + tokens)
- **TanStack React Query** for all server/async state (wallet, leaderboard, KYC, store, etc.)

Follow the same pattern used in the **qm-admin-pwa-1** project exactly.

---

## 3. State Management Architecture

### Auth State → Zustand (`src/lib/auth-store.ts`)
```typescript
import { useAuthStore } from '@/lib/auth-store'

// Read user
const user = useAuthStore((s) => s.user)
const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

// Actions
useAuthStore.getState().setAuth(player, { access_token, refresh_token })
useAuthStore.getState().clearAuth()
useAuthStore.getState().updateUser({ avatar_url: newUrl })
```

### Server/Async State → React Query (`src/lib/queries.ts`)
```typescript
// Reading data
const { data, isLoading, error } = useWalletBalance()
const { data, isLoading } = useLeaderboard('last-game')

// Mutations
const { mutate, isPending } = useRequestWithdrawal()
mutate({ amount: 100000, bank_account_id: 'uuid' })
```

### NEVER use these old patterns:
```typescript
// WRONG — Redux (deleted)
import { useAppSelector } from '@/app/hooks/useAuth'
import { useAppDispatch } from '@/app/hooks/useAuth'
dispatch(setWalletBalance(...))
store.getState().auth.accessToken

// WRONG — old proxy layer (deleted)
callParseEndpoint("auth/login", body)
callWithSessionToken("wallets", {}, "GET")
```

---

## 4. Dead Code — DELETE These Files Completely

**Do not modify. Do not import from. Delete entirely.**

```
# Old proxy / Parse layer
src/app/api/parse/                          ← entire folder
src/lib/parseHeaders.ts
src/app/api/refresh/route.ts

# Old Redux store — replaced by Zustand + React Query
src/app/store/                              ← entire folder
  authSlice.ts, walletSlice.ts, kycSlice.ts,
  gameSlice.ts, storeSlice.ts, leaderboardSlice.ts,
  notificationSlice.ts, coinSlice.ts, gameZoneSlice.ts,
  demoSlice.ts, withdrawalRequestSlice.ts, numberGuessGameSlice.ts,
  stompSlice.ts, store.ts

# Old Redux hooks
src/app/hooks/useAuth.ts                    ← (useAppSelector, useAppDispatch — gone)

# Old STOMP/WebSocket layer — replaced by Socket.io
src/app/api/queries/walletQueries.ts
src/app/api/queries/nextGameQueries.tsx
src/app/api/queries/liveGameQueries.tsx
src/app/api/queries/AppLiveQueries.tsx
src/app/api/queries/homeQueries.ts
src/app/api/queries/leaderboardQueries.ts

# Old game HTTP API — game is Socket.io only now
src/app/api/game.ts

# Old userApi — split into authApi.ts + profileApi.ts
src/app/api/userApi.ts
```

---

## 5. New File Structure to Create

```
src/lib/
  api-client.ts        ← Axios instance with interceptors (matches admin pattern)
  auth-store.ts        ← Zustand auth store
  query-keys.ts        ← All React Query key factories
  queries.ts           ← All useQuery + useMutation hooks
  types.ts             ← Shared TypeScript types
  utils.ts             ← formatNaira, formatDate, cn, etc.
  routes.ts            ← App route constants

src/components/
  query-provider.tsx   ← QueryClientProvider wrapper
  ui/                  ← shadcn/ui components

src/app/api/
  authApi.ts           ← Auth API functions (no hooks)
  profileApi.ts        ← Profile API functions
  wallet.ts            ← Wallet API functions
  kycApi.ts            ← KYC/Verification API functions
  leaderboardApi.ts    ← Leaderboard API functions
  storeApi.ts          ← Store API functions
  notification.ts      ← Push notification API functions
```

---

## 6. The API Client (`src/lib/api-client.ts`)

Use **Axios** with request/response interceptors — exactly like qm-admin-pwa-1.

```typescript
// Pattern from qm-admin-pwa-1:
import api from '@/lib/api-client'

// In API function files:
const res = await api.get<ApiResponse<WalletBalance>>('/api/wallet/balance')
return res.data.data

const res = await api.post<ApiResponse<LoginResult>>('/api/auth/login', { email, password })
return res.data.data
```

Token storage (matches admin PWA pattern):
```
qm_access_token   → localStorage  (Axios interceptor attaches to every request)
qm_refresh_token  → localStorage  (used by refresh interceptor)
```

On 401: interceptor auto-calls `POST /api/auth/refresh-token`, retries request.
On refresh failure: calls `tokenStorage.clearTokens()` + `window.location.href = '/login'`

---

## 7. Auth Store Pattern (`src/lib/auth-store.ts`)

Exactly mirrors qm-admin-pwa-1 auth-store:

```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      hasHydrated: false,
      setHasHydrated: (v) => set({ hasHydrated: v }),
      setAuth: (user, tokens) => {
        tokenStorage.setTokens(tokens.access_token, tokens.refresh_token)
        set({ user, isAuthenticated: true })
      },
      clearAuth: () => {
        tokenStorage.clearTokens()
        set({ user: null, isAuthenticated: false })
      },
      updateUser: (updates) => set((s) => ({ user: s.user ? { ...s.user, ...updates } : null })),
    }),
    {
      name: 'qm_player_auth',
      partialize: (s) => ({ user: s.user, isAuthenticated: s.isAuthenticated }),
      onRehydrateStorage: () => (state) => state?.setHasHydrated(true),
    },
  ),
)
```

---

## 8. Query Provider (`src/components/query-provider.tsx`)

Mirrors qm-admin-pwa-1 exactly:

```typescript
'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useAuthStore } from '@/lib/auth-store'

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const hasHydrated = useAuthStore((s) => s.hasHydrated)
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60,        // 1 minute default
        retry: (count, error: any) => {
          if ([401, 403, 404].includes(error?.response?.status)) return false
          return count < 2
        },
        refetchOnWindowFocus: false,
      },
      mutations: { retry: false },
    },
  }))

  if (!hasHydrated) return null  // Wait for Zustand to hydrate from localStorage

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
    </QueryClientProvider>
  )
}
```

---

## 9. Query Keys (`src/lib/query-keys.ts`)

Centralise all React Query keys here. Never hardcode strings in components.

```typescript
export const queryKeys = {
  // Auth / Profile
  me: ['profile', 'me'] as const,

  // Wallet
  walletBalance:   ['wallet', 'balance'] as const,
  walletTransactions: (params?: object) => ['wallet', 'transactions', params] as const,
  bankAccounts:    ['wallet', 'bank-accounts'] as const,
  banks:           ['wallet', 'banks'] as const,
  virtualAccount:  ['wallet', 'virtual-account'] as const,
  withdrawals:     (params?: object) => ['wallet', 'withdrawals', params] as const,

  // Leaderboard
  leaderboardLastGame:   ['leaderboard', 'last-game'] as const,
  leaderboardAllTime:    (params?: object) => ['leaderboard', 'all-time', params] as const,
  myLastGameRank:        ['leaderboard', 'my-rank', 'last-game'] as const,
  myAllTimeRank:         ['leaderboard', 'my-rank', 'all-time'] as const,
  myLastGamePerformance: ['leaderboard', 'my-performance', 'last-game'] as const,

  // KYC / Verification
  verificationStatus: ['verification', 'status'] as const,

  // Store
  storeCatalogue: ['store', 'catalogue'] as const,
  storeInventory: ['store', 'inventory'] as const,
}
```

---

## 10. Queries File Pattern (`src/lib/queries.ts`)

All `useQuery` and `useMutation` hooks live here. Components import from this file only.

```typescript
// ─── Example query ────────────────────────────────────────────
export const useWalletBalance = () =>
  useQuery({
    queryKey: queryKeys.walletBalance,
    queryFn: WalletAPI.getBalance,
    select: (res) => res.data,          // unwrap { success, data } wrapper
    staleTime: 1000 * 30,               // 30s for balance
  })

// ─── Example mutation ─────────────────────────────────────────
export const useRequestWithdrawal = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: WalletAPI.requestWithdrawal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.walletBalance })
      queryClient.invalidateQueries({ queryKey: ['wallet', 'withdrawals'] })
      toast.success('Withdrawal request submitted')
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Withdrawal failed')
    },
  })
}
```

---

## 11. Complete API Endpoint Reference

Base URL: `https://quizmoneybe.fly.dev`
Axios interceptor attaches `Authorization: Bearer <token>` automatically.

### AUTH — `/api/auth` (no auth required unless noted)
```
POST /api/auth/register         body: { username, email, password, phone_number?, referral_code? }
POST /api/auth/login            body: { email, password }
                                → returns: { access_token, refresh_token, player }
POST /api/auth/verify-email     body: { email, otp }
POST /api/auth/resend-otp       body: { email, purpose: "email_verification"|"password_reset" }
POST /api/auth/refresh-token    body: { refresh_token }
POST /api/auth/logout           body: { refresh_token }              [protected]
POST /api/auth/forgot-password  body: { email }
POST /api/auth/verify-reset-otp body: { email, otp }
POST /api/auth/reset-password   body: { email, otp, new_password }
```

### PROFILE — `/api/profile` (all protected)
```
GET    /api/profile/me
PATCH  /api/profile/me           body: { username?, bio?, avatar_url?, date_of_birth?, state? }
GET    /api/profile/me/games     query: { page?, limit? }
GET    /api/profile/me/referrals
DELETE /api/profile/me
```

### WALLET — `/api/wallet` (all protected unless noted)
```
GET  /api/wallet/balance
POST /api/wallet/deposit                body: { amount }  ← KOBO
GET  /api/wallet/virtual-account
POST /api/wallet/virtual-account/setup ← requires is_fully_verified
GET  /api/wallet/transactions           query: { page?, limit?, type? }
GET  /api/wallet/banks                  [PUBLIC — no auth]
GET  /api/wallet/bank-accounts/resolve  query: { account_number, bank_code }
GET  /api/wallet/bank-accounts
POST /api/wallet/bank-accounts          body: { account_number, bank_code, bank_name, account_name, is_default? }
DELETE /api/wallet/bank-accounts/:id
PATCH  /api/wallet/bank-accounts/:id/default
POST /api/wallet/withdraw               body: { amount, bank_account_id }  ← bank_account_id is UUID
GET  /api/wallet/withdrawals            query: { page?, limit? }
```

### LEADERBOARD — `/api/leaderboard` (all protected)
```
GET /api/leaderboard/last-game              query: { limit? }
GET /api/leaderboard/all-time               query: { limit? }
GET /api/leaderboard/my-rank/last-game
GET /api/leaderboard/my-rank/all-time
GET /api/leaderboard/game/:gameId           query: { limit? }
GET /api/leaderboard/my-performance/last-game
```

### STORE — `/api/store` (all protected)
```
GET  /api/store/catalogue
GET  /api/store/inventory
POST /api/store/purchase                body: { item_id (UUID), quantity }
POST /api/store/scratch-card/purchase
```

### VERIFICATION (KYC) — `/api/verification` (all protected)
```
GET  /api/verification/status
     → { phone_verified, bvn_verified, is_fully_verified, can_withdraw, can_have_virtual_account }
POST /api/verification/phone/send-otp   body: { phone_number }
POST /api/verification/phone/verify-otp body: { phone_number, otp }
POST /api/verification/bvn/verify       body: { bvn, first_name, last_name, date_of_birth? }
```

### PUSH — `/api/push` (protected)
```
POST /api/push/subscribe     body: { fcm_token }
POST /api/push/unsubscribe   body: { fcm_token }
```

### GAME — NO HTTP ROUTES
All game interactions are **Socket.io only**. See Section 13 for Socket events.

---

## 12. Data Conventions

```
MONEY: All amounts are KOBO (integer). ₦1,000.00 = 100000 kobo.
Format: formatNaira(koboAmount) from '@/lib/utils'
  → uses: new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount / 100)

ALL API RESPONSES:
  Success: { success: true,  data: T }
  Error:   { success: false, message: string, errors?: Record<string, string[]> }

DATES: ISO 8601 strings. Use standard new Date() to parse.
```

---

## 13. Socket.io

```
Server:  https://quizmoneybe.fly.dev
Auth:    socket.auth = { token: tokenStorage.getAccessToken() }
File:    src/lib/socket.ts  ← singleton, NEVER create new instances in components
```

**Emit (client → server):**
```
game:join           { gameId }                          → ack: { success, eraserOpted }
game:answer         { questionIndex, selectedOption }   → ack: { success }
game:eraser:toggle  { opted: boolean }                  → ack
game:reconnect      (no payload)                        → triggers game:reconnected
```

**Listen (server → client):**
```
game:lobby:update     { totalPlayers }
game:player:joined    { totalPlayers }
game:locked           { totalPlayers }
game:started          { message }
game:question         { questionIndex, totalQuestions, question: { id, text, options: {a,b,c,d} }, timeMs }
game:question:result  { questionIndex, correctOption, partialLeaderboard }
game:eraser:result    { ... }
game:finished         { totalPlayers, leaderboard }
game:cancelled        { message }
game:reconnected      { gameId, currentQuestion, status }
game:error            { message }
```

**IMPORTANT — question shape:** `question.text` (NOT `question_text`), `question.options.a/b/c/d` (NOT `option_a`).

---

## 14. Reusable Components — Rules

**The rule: if JSX or logic appears in more than one place, it must be a component or hook.**

### Where reusable components live:
```
src/app/components/
  ui/                   ← Generic UI primitives (Button, Input, Modal, Badge, etc.)
  common/               ← App-specific reusables (LoadingScreen, EmptyState, PageHeader, etc.)
  wallet/               ← Wallet-specific components
  game/                 ← Game-specific components
  leaderboard/          ← Leaderboard-specific components
  kyc/                  ← KYC flow components
```

### Mandatory reusable components to create (do not repeat inline):

**`src/app/components/ui/LoadingSpinner.tsx`**
Every screen uses a loading state. One component, used everywhere.

**`src/app/components/ui/EmptyState.tsx`**
```tsx
// Props: icon, title, description, action?
<EmptyState icon={<TrophyIcon />} title="No games yet" description="Play your first game" />
```

**`src/app/components/ui/ErrorState.tsx`**
```tsx
// Props: message, onRetry?
<ErrorState message="Failed to load" onRetry={refetch} />
```

**`src/app/components/ui/PageHeader.tsx`**
```tsx
// Props: title, subtitle?, backHref?, action?
<PageHeader title="Wallet" subtitle="Manage your balance" />
```

**`src/app/components/ui/StatCard.tsx`**
```tsx
// Props: title, value, icon, loading, children
// Used for balance display, game stats, referral stats
```

**`src/app/components/ui/BottomSheet.tsx`**
Modal that slides up from bottom — used for confirmations, forms, filters on mobile.

**`src/app/components/common/KoboAmount.tsx`**
```tsx
// Never format kobo inline. Always use this component.
<KoboAmount value={100000} />  → renders ₦1,000.00
```

**`src/app/components/common/AvatarWithFallback.tsx`**
```tsx
// Used on profile, leaderboard rows, game lobby
<AvatarWithFallback src={player.avatar_url} username={player.username} size="md" />
```

**`src/app/components/common/PaginationControls.tsx`**
Reused on transactions, leaderboard, game history.

**`src/app/components/common/QueryWrapper.tsx`**
```tsx
// Wraps any data-dependent section with loading/error/empty states
<QueryWrapper isLoading={isLoading} error={error} isEmpty={!data?.length} emptyMessage="No results">
  {data?.map(...)}
</QueryWrapper>
```

### Rules for building components:
1. Props over duplication — if two screens show the same thing with different data, make one component with props
2. Extract long JSX blocks (>30 lines) from page files into named components in `components/`
3. Custom hooks for logic — if a component has 3+ `useState` or any `useEffect`, extract to `useXxx.ts` in `app/hooks/`
4. Co-locate closely: a component only used in one screen can live next to that screen, but once used in 2+ places it moves to `components/`

---

## 15. Import Path Rules

```typescript
// CORRECT
import { useWalletBalance } from '@/lib/queries'
import { useAuthStore } from '@/lib/auth-store'
import { apiClient } from '@/lib/api-client'
import { queryKeys } from '@/lib/query-keys'
import { formatNaira } from '@/lib/utils'
import KoboAmount from '@/app/components/common/KoboAmount'

// WRONG — never use relative paths for lib/
import { useWalletBalance } from '../../lib/queries'
import { useAuthStore } from '@/app/lib/auth-store'
```

Icon imports: `lucide-react`
QMCoin icon: `@/app/icons/icons` → `QmCoinIcon`

---

## 16. File Migration Map

### Infrastructure / Foundation (ALL DONE — do not re-create)

| File | Status |
|------|--------|
| `src/lib/api-client.ts` | ✅ Written — Axios instance with 401 auto-refresh |
| `src/lib/auth-store.ts` | ✅ Written — Zustand auth store with persist |
| `src/lib/query-keys.ts` | ✅ Written — centralized query key factories |
| `src/lib/queries.ts` | ✅ Written — all React Query hooks |
| `src/lib/utils.ts` | ✅ Written — cn, formatNaira, formatDate, etc. |
| `src/lib/game-zone-store.ts` | ✅ Written — Zustand store replacing gameZoneSlice |
| `src/components/query-provider.tsx` | ✅ Written — QueryClientProvider |
| `src/app/api/authApi.ts` | ✅ Written |
| `src/app/api/profileApi.ts` | ✅ Written |
| `src/app/api/wallet.ts` | ✅ Written |
| `src/app/api/kycApi.ts` | ✅ Written |
| `src/app/api/leaderboardApi.ts` | ✅ Written |
| `src/app/api/storeApi.ts` | ✅ Written |
| `src/app/api/notification.ts` | ✅ Written |
| `src/app/components/common/QueryWrapper.tsx` | ✅ Written |
| `src/app/components/common/KoboAmount.tsx` | ✅ Written |
| `src/app/components/common/AvatarWithFallback.tsx` | ✅ Written |
| `src/app/components/ui/LoadingSpinner.tsx` | ✅ Written |
| `src/app/components/ui/EmptyState.tsx` | ✅ Written |
| `src/app/components/ui/ErrorState.tsx` | ✅ Written |

### Shell / App-wide (ALL DONE)

| File | Status |
|------|--------|
| `src/app/appSetup.tsx` | ✅ Fixed — uses QueryProvider, removed Redux Provider/PersistGate |
| `src/app/layout/appHeader.tsx` | ✅ Fixed — removed notificationSlice, fixed KYC check |
| `src/app/layout/SidebarNav.tsx` | ✅ Fixed — uses useGameZoneStore |
| `src/app/layout/mobileSideBar.tsx` | ✅ Fixed — uses useGameZoneStore, fixed KYC check |
| `src/app/security/protectedRoute.tsx` | ✅ Fixed — uses useAuthStore |
| `src/app/(screens)/(protected)/layout.tsx` | ✅ Fixed — removed CheckSession, AppLiveQueries |
| `src/app/(screens)/(protected)/(tabs)/layout.tsx` | ✅ Fixed — removed gameSlice dispatch |
| `src/app/(screens)/(protected)/checkSession.tsx` | ✅ Replaced with no-op stub |
| `src/app/components/logout/logout.tsx` | ✅ Fixed — uses useLogout + clearAuth |
| `src/app/components/rehydrated/rehydrationGuard.tsx` | ✅ Fixed — uses useAuthStore.hasHydrated |
| `src/app/logoutAndRedirect.tsx` | ✅ Fixed — uses clearAuth |
| `src/app/utils/logout.ts` | ✅ Fixed — uses clearAuth |
| `src/app/hooks/useAuth.ts` | ✅ Replaced — now wraps Zustand (no Redux exports) |
| `src/app/hooks/useWallet.ts` | ✅ Replaced — wraps React Query hooks |
| `src/app/hooks/useKycStep.ts` | ✅ Replaced — wraps useVerificationStatus() |
| `src/app/hooks/useLastGameState.tsx` | ✅ Replaced — wraps useMyLastGamePerformance() |

### Dead Code to Delete

```
src/app/api/parse/              ← ENTIRE FOLDER (callParseEndpoint, callWithSessionToken, handleInvalidSession)
src/lib/parseHeaders.ts
src/app/api/refresh/route.ts
src/app/store/                  ← ENTIRE FOLDER (all Redux slices + store.ts)
src/app/api/queries/            ← ENTIRE FOLDER (STOMP-based queries, AppLiveQueries)
src/app/api/game.ts             ← game is socket-only now
src/app/api/userApi.ts          ← replaced by authApi.ts + profileApi.ts
src/app/api/demo.ts             ← if still referencing Parse (check first)
```

### Screens still requiring migration (Claude Code task)

These files still import from deleted Redux slices or old API layers.
Migrate them by replacing Redux patterns with the equivalent hooks from `@/lib/queries`.

**Pattern to follow in every screen:**

```tsx
// BEFORE (Redux + manual fetch)
const dispatch = useAppDispatch()
const { balance } = useAppSelector((s) => s.wallet)
useEffect(() => { dispatch(fetchBalance()) }, [])

// AFTER (React Query)
const { data: balance, isLoading, error } = useWalletBalance()
```

Key screens that still need migration:

| Area | Files |
|------|-------|
| **Wallet** | `components/wallet/WalletBalance.tsx`, `WithdrawalModal.tsx`, `WithdrawalPinModal.tsx`, `WithdrawalAccounts.tsx`, `VirtualDetails.tsx`, `TransactionHistory.tsx`, `AddBankModal.tsx`, `MobileAddBankAccount.tsx`, `MobileWithdrawalForm.tsx`, `MobileWithdrawalPinForm.tsx`, `MobileList.tsx` |
| **Wallet screens** | `(tabs)/wallet/page.tsx`, `coin/coin.tsx`, `coin/RedeemModal.tsx`, `coin/CoinTransactions.tsx`, `coin/CoinTarget.tsx`, `(tabs)/withdraw-request/cmp/WithdrawalActivity.tsx` |
| **Home** | `components/home/JoinGameBtn.tsx`, `GameCard.tsx`, `TopGamers.tsx`, `Share.tsx`, `(tabs)/home/page.tsx` |
| **Leaderboard** | `(tabs)/leaderboard/PlayerCard.tsx`, `ShowPlayerData.tsx`, `my-last-game-result/ResultContent.tsx`, `components/LeaderboardRow.tsx`, `LeaderBoardTableSection.tsx` |
| **Store** | `(tabs)/store/page.tsx`, `productCard.tsx` |
| **Settings** | `(tabs)/settings/page.tsx`, `settings/profile/page.tsx`, `settings/invite-&-earn/page.tsx` |
| **KYC** | `(kyc)/flow/PhoneVerification.tsx`, `OTPVerification.tsx`, `BvnVerification.tsx` |
| **Notifications** | `components/notification/ViewNotification.tsx`, `NotificationBox.tsx`, `(protected)/notification/page.tsx` |
| **Game live** | `(liveGame)/live-game/[id]/page.tsx`, `cmp/GameScreen.tsx`, `cmp/LobbyScreen.tsx`, `cmp/Results.tsx`, `cmp/GameCompleted.tsx`, `cmp/GameAudioManager.tsx` |
| **Game zone** | `(gameZone)/game-zone/page.tsx`, `number-guessing/` (all cmp files), `GameZoneAudioManager.tsx` — use `useGameZoneStore` from `@/lib/game-zone-store` |
| **Game components** | `components/game/gameScreen.tsx`, `resultScreen.tsx`, `leaveGameModal.tsx`, `countDown.tsx`, `adsScreen.tsx`, `useGameBlock.ts` |
| **Demo** | `components/demo/welcomeScreen.tsx`, `result/demoResult.tsx`, `game/demoGameSCreen.tsx`, `blockBackNav.tsx` |
| **Misc** | `components/updateAccount/socialLinksDrawer.tsx`, `components/transactions/WalletActivity.tsx`, `TransactionDetailModal.tsx`, `ActivityRow.tsx`, `components/splashScreen/splash.tsx`, `(preAuthScreen)/login/loginForm.tsx`, `(preAuthScreen)/onboarding/page.tsx` |

### Key migration facts for screen-level work

- `useAppDispatch` / `useAppSelector` are removed — use `useAuthStore`, `useGameZoneStore`, or React Query hooks
- `state.wallet.*` → use `useWalletBalance()`, `useWalletTransactions()` from `@/lib/queries`
- `state.kyc.*` → use `useKycStep()` from `@/app/hooks/useKycStep` (wraps `useVerificationStatus()`)
- `state.notifications.*` → notifications are FCM push only; remove polling
- `state.gameZone.*` → use `useGameZoneStore` from `@/lib/game-zone-store`
- `state.auth.*` → use `useAuthStore` from `@/lib/auth-store`
- Old STOMP hooks (`useStompClient`, `useLiveGameQueries`, etc.) → replace with Socket.io
- `LeaderboardAPI.userLastGameStat()` is gone → use `useMyLastGamePerformance()` from `@/lib/queries`
- `KycAPI.getCustomerKyc()` array format is gone → use `useKycStep()` which returns flat `status` object
  - Old: `customerKyc.find(s => s.step === 'BVN')?.status === 'COMPLETED'`
  - New: `status?.bvn_verified === true`

| Old file | New file |
|----------|--------|
| `src/app/store/` (whole folder) | **DELETE** — replaced by Zustand + React Query |
| `src/app/api/parse/` (whole folder) | **DELETE** |
| `src/lib/parseHeaders.ts` | **DELETE** |
| `src/app/api/refresh/route.ts` | **DELETE** |
| `src/app/api/queries/` (whole folder) | **DELETE** — replaced by `src/lib/queries.ts` |
| `src/app/api/game.ts` | **DELETE** — game is socket-only |
| `src/app/api/userApi.ts` | **DELETE** — replaced by `authApi.ts` + `profileApi.ts` |
| `next.config.ts` | **DO NOT TOUCH** |
| `tailwind.config.ts` | **DO NOT TOUCH** |

---

## 17. Package Dependencies

Ensure these are installed (check `package.json`):

```bash
# Required (add if missing)
npm install zustand
npm install @tanstack/react-query @tanstack/react-query-devtools
npm install axios

# Remove if present (no longer needed)
npm uninstall @reduxjs/toolkit react-redux
npm uninstall @stomp/stompjs sockjs-client   # old WebSocket layer
```

---

## 18. Environment Variables

```bash
# .env.local — ONLY this backend now
NEXT_PUBLIC_API_URL=https://quizmoneybe.fly.dev

# Firebase (push notifications — unchanged)
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_FIREBASE_VAPID_KEY=...

# OLD — REMOVE FROM .env.local
# X_BASE_URL=https://frontoffice-prod.quizmoney.ng/api/v1
# X_PARSE_APP_ID=...
# X_PARSE_REST_API_KEY=...
# NEXT_PUBLIC_SECRET_KEY=...
```

---

## 19. PWA Requirements

- All pages must work with stale cache when offline
- Use `staleTime` + `gcTime` in React Query options for offline resilience
- Never call `localStorage`, `window`, or browser APIs inside Server Components
- All interactive features must be `'use client'`
- Service worker managed by next-pwa — do not create custom SW files

---

## 20. Code Style Rules

- All API calls through `api` (Axios instance) — never raw `fetch` in components
- All query/mutation hooks from `@/lib/queries` — never `useQuery` directly in components
- No relative imports for `lib/` files — always `@/lib/...`
- No `.then()` chains — use `async/await`
- TypeScript strict — no `any` unless unavoidable; use `unknown` then narrow
- Money: KOBO internally, only divide by 100 at the display layer via `formatNaira()` or `<KoboAmount />`
- Extract repeated JSX into components. Extract repeated logic into hooks.
