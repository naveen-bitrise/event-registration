# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## About

Event-Registration is a React Native / Expo app targeting iOS, Android, and Web. Bundle ID: `io.bitrise.hackathon2026`. Built as a Bitrise hackathon project.

## Commands

```bash
npm install           # install dependencies
npm run start         # start Expo dev server (interactive: press i=iOS, a=Android, w=web)
npm run ios           # run on iOS simulator
npm run android       # run on Android emulator
npm run web           # start web dev server
npm run lint          # ESLint via expo lint
npx tsc --noEmit      # type-check without emitting
npx expo prebuild     # generate native ios/ and android/ directories
```

There is no test runner configured yet.

## Architecture

### Routing
Expo Router with file-based routing. All screens live in `src/app/`. The root layout (`src/app/_layout.tsx`) wraps the app in `ThemeProvider` and renders `AnimatedSplashOverlay` + `AppTabs`.

### Platform-specific files
Platform variants use the `.web.tsx` / `.web.ts` suffix (Expo resolves them automatically):
- `src/components/app-tabs.tsx` vs `app-tabs.web.tsx` — native uses `NativeTabs` from `expo-router/unstable-native-tabs`; web has its own implementation
- `src/components/animated-icon.web.tsx` — web-specific animation variant
- `src/hooks/use-color-scheme.ts` vs `use-color-scheme.web.ts`

### Theming
`src/constants/theme.ts` is the single source of truth for all design tokens:
- `Colors` — light/dark palettes (`text`, `background`, `backgroundElement`, `backgroundSelected`, `textSecondary`)
- `Fonts` — platform-specific font stacks (system-ui on iOS, CSS vars on web)
- `Spacing` — named scale (`half`=2, `one`=4 … `six`=64)
- `BottomTabInset`, `MaxContentWidth` — layout constants

Use `useTheme()` (from `src/hooks/use-theme.ts`) to get the current color palette. `ThemedText` and `ThemedView` consume it internally — prefer these over raw `Text`/`View` for themed UI.

### Path aliases
`@/*` resolves to `src/*` and `@/assets/*` to `assets/*` (configured in `tsconfig.json`).

### Animations
Splash screen and icon animations use `react-native-reanimated` (Keyframe API) + `react-native-worklets`. The `scheduleOnRN` worklet helper bridges animation callbacks back to the React Native thread.

## CI (Bitrise)

The main `bitrise.yml` includes platform-specific YMLs via `include`:
- `ios_yml/bitrise.yml` — `ios-simulator` (no signing) and `ios-dev-build` (enterprise signing, manual)
- `android_yml/bitrise.yml` — `test` (lint + type-check) and `android-dev-build`

The `release` pipeline runs `ios-dev-build` + `android-dev-build` in parallel and triggers on PRs.

iOS builds use manual signing: enterprise distribution, team `4UT92WGGSF`, configured via the `withCustomSigning.js` Expo config plugin.
