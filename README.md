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
