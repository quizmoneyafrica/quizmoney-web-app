# 🎮 QuizMoney – Progressive Web App (PWA)

Welcome to the **QuizMoney** PWA!   
This is the frontend codebase for the QuizMoney trivia platform where users compete in real-time quizzes for cash prizes. This version is optimized for mobile web and can be installed like a native app (PWA).

--- 
  
## 🚀 Features 

- 📱 **PWA support** – installable on Android, iOS (via Safari), and desktop
- 🔐 User authentication (login, signup, forgot password)
- 🧠 Live quiz experience (integrated via WebSocket)
- 🔔 Push notifications with Firebase Cloud Messaging (FCM) 
- 🌙 Theme support and responsive UI 
- 📊 Leaderboard, earnings, and user profile dashboard 
- 🎯 Smooth onboarding with Swiper.js

---

## 🛠️ Tech Stack

| Layer         | Technology                     |
|--------------|---------------------------------|
| Framework     | [Next.js](https://nextjs.org/) (App Router) |
| UI Library    | [Radix UI](https://www.radix-ui.com/) + Tailwind CSS |
| PWA Features  | Service Worker + Web Manifest |
| Push System   | Firebase Cloud Messaging (FCM) |
| State Mgmt    | Zustand / Context API (as needed) |
| Notifications | [Sonner](https://sonner.emilkowal.ski/) for toast UI |
| Auth Backend  | Parse Server (REST + sessions) |

---

## ⚙️ Setup Instructions

### 1. Clone the repo
```bash
git clone https://github.com/quizmoneyafrica/quizmoney-web-app.git
cd quizmoney-web-app
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment variables

Create a `.env.local` file using `.env.example` as a guide:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=xxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxx
NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=xxx
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxx
NEXT_PUBLIC_FIREBASE_MESSAGING_KEY_PAIR=xxx
NEXT_PUBLIC_FIREBASE_APP_ID=xxx
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=xxx
```

### 4. Run the dev server
```bash
npm run dev
```

quizmoney-web-app will be accessible at: `http://localhost:3000`

---

## 📦 Build for Production

```bash
npm run build
npm run start
```

---

## 📲 Push Notification Notes

- FCM public VAPID key must be set in `.env.local`
- Tokens are stored per user and sent to backend for future targeting
- iOS Safari requires the app to be installed before permission is granted
- Firebase setup is in `firebase-messaging-sw.js` (under `/public`)

---

## 🧪 Testing

- QM behavior: [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- Push: Test via Firebase console
- iOS: Must test in Safari → Add to Home Screen

---

## 🧑‍💻 Team Development Notes

- Follow feature folder structure (`auth/`, `quiz/`, `user/`, etc.)
- Use descriptive git commit messages:  
  `feat(auth): add forgot password toast feedback`
- Keep `NEXT_PUBLIC_` env variables strictly public
- Secure routes are protected via layout middleware
- Notifications are triggered inside `useFcmToken()` hook

---

## 🧑‍💻 View Encrypted User
```bash
const encrypted = useAppSelector((s) => s.auth.userEncryptedData);
const user = encrypted ? decryptData(encrypted) : null;
```
---

## 👥 Contributors

- **@Solomonwole** – Frontend / PWA Architect
- **@you** – Join the team 🎉

---

## 📄 License

© 2025 QM Technologies. All rights reserved.
