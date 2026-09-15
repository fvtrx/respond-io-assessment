# Respond.io Assessment

A mobile messaging app built with Expo SDK 57 and Expo Router. The app includes a sign-in/sign-up flow, a conversation list, chat detail screens, profile views, and app-level state management powered by Zustand and React Query.

## Stack

- Expo SDK 57
- React Native 0.86.3
- Expo Router
- TypeScript
- TanStack Query
- Zustand
- FlashList
- Expo Image / Linear Gradient / Blur / Haptics
- Lucide React Native icons

## Project structure

```text
.
├── app.json
├── eas.json
├── package.json
├── src/
│   ├── app/
│   │   ├── _layout.tsx
│   │   ├── +not-found.tsx
│   │   ├── auth.tsx
│   │   ├── index.tsx
│   │   ├── (tabs)/
│   │   │   ├── _layout.tsx
│   │   │   ├── index.tsx
│   │   │   └── settings.tsx
│   │   ├── chat/
│   │   │   └── [id].tsx
│   │   └── profile/
│   │       └── [id].tsx
│   ├── components/
│   │   ├── Avatar.tsx
│   │   ├── ChatListSkeleton.tsx
│   │   ├── ConfirmModal.tsx
│   │   ├── ConversationRow.tsx
│   │   ├── EmptyState.tsx
│   │   ├── GlassTabBar.tsx
│   │   ├── MessageBubble.tsx
│   │   ├── MessageSkeleton.tsx
│   │   └── Skeleton.tsx
│   ├── constants/
│   │   └── theme.ts
│   ├── hooks/
│   │   ├── useFrameworkReady.ts
│   │   └── queries/
│   │       ├── index.ts
│   │       ├── useContact.ts
│   │       ├── useContactsInfinite.ts
│   │       ├── useMessages.ts
│   │       └── useSendMessage.ts
│   ├── lib/
│   │   ├── api.ts
│   │   ├── countryCodes.ts
│   │   ├── mockAuth.ts
│   │   ├── queryClient.ts
│   │   ├── theme.ts
│   │   └── types.ts
│   ├── store/
│   │   ├── authStore.ts
│   │   └── blockedContactStore.ts
│   ├── utils/
│   │   ├── format.ts
│   │   ├── mapMessages.ts
│   │   └── sentMessages.ts
│   └── global.css
├── assets/
├── scripts/
│   └── reset-project.js
└── README.md
```

## Features

- Authentication screen with country code selection and sign-in/sign-up logic
- Persistent auth state via Zustand
- Infinite or paginated contact list with search
- Chat thread screens with message rendering and send flow
- User profile routes and tabbed navigation
- Custom theming, skeleton loading states, and glassmorphism-inspired UI
- API integration with a remote backend and graceful local fallback behavior


## App Screenshots
| Screen | Snapshots | 
| --- | --- | 
| Sign In Screen | <img width="302" height="656" alt="Simulator Screenshot - iPhone 17 - 2026-09-15 at 15 09 36" src="https://github.com/user-attachments/assets/bc67d5eb-7ce6-4a5f-afe7-755670b1feac" /> |
| Sign Up Screen | <img width="302" height="656" alt="Simulator Screenshot - iPhone 17 - 2026-09-15 at 15 09 42" src="https://github.com/user-attachments/assets/f30bf1a0-c637-428c-9a3b-3e978ce4eacb" /> |
| Home (Chat List) | <img width="302" height="656" alt="Simulator Screenshot - iPhone 17 - 2026-09-15 at 15 10 00" src="https://github.com/user-attachments/assets/9fc0e4f7-48a3-431f-b30b-d6ac99b3ed43" />|
| Chat Screen | <img width="302" height="656" alt="Simulator Screenshot - iPhone 17 - 2026-09-15 at 15 10 08" src="https://github.com/user-attachments/assets/380bd445-3340-4619-b89f-2697c4fc410a" />|
| Profile Screen | <img width="302" height="656" alt="Simulator Screenshot - iPhone 17 - 2026-09-15 at 15 10 21" src="https://github.com/user-attachments/assets/60803ab4-1ee2-42b7-9b26-117158aa9aaf" />|
| Settings Screen | <img width="302" height="656" alt="Simulator Screenshot - iPhone 17 - 2026-09-15 at 15 10 27" src="https://github.com/user-attachments/assets/ec7ab38e-30ff-41d6-baac-cf6a11bf605f" />|


## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the Expo development server:

   ```bash
   npm start
   ```

   Or use:

   ```bash
   npx expo start
   ```

3. Open the app in a simulator or device:

   - Android: `npm run android`
   - iOS: `npm run ios`
   - Web: `npm run web`

## Available scripts

```bash
npm start          # expo start
npm run android    # expo start --android
npm run ios        # expo start --ios
npm run web        # expo start --web
npm run lint       # expo lint
npm run reset-project
npm run build-configure
npm run build-apk-dev
npm run build-apk-prod
npm run build-ios-dev
npm run build-ios-prod
```

## App flow

- The app bootstraps from `src/app/_layout.tsx`.
- `src/app/auth.tsx` handles entry authentication logic.
- `src/app/(tabs)/index.tsx` shows the conversation list and search experience.
- `src/app/chat/[id].tsx` renders an individual conversation thread.
- `src/app/profile/[id].tsx` renders a selected user profile.
- `src/lib/api.ts` centralizes backend requests.
- Zustand stores under `src/store/` manage authentication and blocked-contact state.
- Query hooks under `src/hooks/queries/` provide data fetching and mutation logic.

## Notes

- This project uses file-based routing from Expo Router.
- The app is configured through `app.json` and `eas.json` for Expo builds and deployment workflows.
- The project uses a custom design system and lightweight mock/fallback logic for messaging interactions.

## Related documentation

- [Expo SDK reference](https://docs.expo.dev/versions/v57.0.0/)
- [Expo Router](https://docs.expo.dev/router/introduction)
- [Expo CLI](https://docs.expo.dev/more/expo-cli/)
