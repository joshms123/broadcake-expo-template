# Broadcake App Template

Cloneable Expo SDK 55 (React Native) listener app for radio stations. Station owners clone it, edit `broadcake.config.ts`, and publish to app stores. Uses the v1 public API via `@techcake/broadcake-sdk` — no auth required.

## Commands

```bash
# Dev (requires dev build — no Expo Go due to react-native-track-player)
cd packages/app-template && npx expo prebuild
cd packages/app-template && npx expo run:ios
cd packages/app-template && npx expo run:android

# Install deps (run from repo root)
npm install
```

## Tech Stack

- **Expo SDK 55** with **React 19** and **React Native 0.83**
- **Expo Router** — file-based routing with `NativeTabs` (3 tabs: Listen, Schedule, More)
- **react-native-track-player** — live audio streaming with ICY metadata, background playback, lock screen controls
- **@techcake/broadcake-sdk** — v1 public API client (zero auth)
- **React Query** (`@tanstack/react-query`) with AsyncStorage persister for offline cache
- **expo-notifications** — local show reminders (structured for future push support)
- **expo-image** — all images including SF Symbols via `source="sf:name"`
- **react-native-reanimated** — skeleton shimmer, fade-in animations
- **date-fns** + **date-fns-tz** — date formatting
- **expo-haptics** — iOS tactile feedback

## Project Structure

```
packages/app-template/
  broadcake.config.ts       Station config (owner edits this)
  app.json                  Expo config
  index.ts                  Custom entry point (track-player registration)
  src/
    app/                    Expo Router file-based routing
      _layout.tsx           Root layout (QueryClient → Theme → Player → Stack)
      (tabs)/
        _layout.tsx         3-tab NativeTabs (Listen, Schedule, More)
        (listen)/           Home: player, now playing, social links, contact form
        (schedule)/         Day picker + schedule list, show/presenter detail modals
        (more)/             Settings: theme, stream quality, notifications, about
    lib/
      config.ts             Load + merge broadcake.config.ts with defaults
      sdk.ts                Singleton Broadcake client
      theme.ts              Light/dark theme tokens
      query-client.ts       React Query + AsyncStorage persister
      query-keys.ts         Centralized query key factory
      constants.ts          Polling intervals, storage keys
      notifications.ts      Local notification scheduling + push token storage (future)
      format.ts             formatTime, getPresenters
    services/
      player.ts             react-native-track-player setup + playback service
      metadata.ts           ICY metadata parsing + lock screen updates
    hooks/                  React Query hooks (use-station, use-now-playing, use-schedule, etc.)
    contexts/
      theme-context.tsx     Light/dark + system preference + AsyncStorage
      player-context.tsx    Audio player state + stream selection
    components/
      player/               mini-player, stream-selector
      schedule/             day-picker, schedule-slot, schedule-list
      common/               avatar, badge, skeleton, empty-state, time-display, social-icons
      modals/               show-detail, presenter-detail, contact-form
```

## Key Conventions

### Code Style
- **kebab-case** for all filenames
- **Inline styles** — not `StyleSheet.create`, not Tailwind
- **`@/` imports** — path alias for `./src/*`
- **`process.env.EXPO_OS`** — not `Platform.OS`
- **`React.use()`** — not `React.useContext()`
- **`expo-image`** with `source="sf:name"` for SF Symbols

### Data Flow
1. **SDK singleton** (`src/lib/sdk.ts`) — all data from v1 public API
2. **Hooks** (`src/hooks/`) — React Query wrappers calling SDK directly
3. **Screens** consume hooks, never call SDK directly

### Styling
- Theme tokens from `useTheme()` — `theme.foreground`, `theme.card`, `theme.primary`, etc.
- `borderCurve: 'continuous'` on rounded corners
- `boxShadow` CSS prop for shadows
- `contentInsetAdjustmentBehavior="automatic"` on ScrollView/FlatList

### Haptics (iOS only)
```tsx
if (process.env.EXPO_OS === 'ios') {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
}
```

### Accessibility
- `accessibilityRole` on all interactive elements
- `accessibilityLabel` on icon-only buttons
- `accessibilityState={{ selected, disabled }}` where appropriate
- 44pt minimum touch targets

### Audio Player
- `react-native-track-player` registered in `index.ts` before app loads
- ICY metadata from `Event.PlaybackMetadataReceived` → parsed into title/artist → lock screen update
- `PlayerProvider` wraps app, exposes `usePlayer()` hook
- Stream selection persisted to AsyncStorage

### Notifications
- Local notifications via `expo-notifications` with weekly triggers
- Preferences stored in AsyncStorage (show slug + day + time → enabled)
- Lead time configurable (15/30/60 min) in More tab
- Push token stored locally via `registerForPushNotifications()` — not sent to server yet
