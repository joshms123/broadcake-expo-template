# Broadcake App Template

> **Scope**: this file covers the cloneable Expo listener app. Cross-cutting conventions, the
> command reference and the traps list live in the **root `CLAUDE.md`** —
> read that first.

Cloneable Expo SDK 57 (React Native) listener app for radio stations. Station owners clone it, edit `broadcake.config.ts`, and publish to app stores. Uses the v1 public API via `@techcake/broadcake-sdk` — no auth required.

## Commands

```bash
# Dev (expo-audio is a native module, so a dev build — not Expo Go)
cd packages/app-template && npx expo prebuild
cd packages/app-template && npx expo run:ios
cd packages/app-template && npx expo run:android

# Install deps (run from repo root)
npm install
```

## Tech Stack

- **Expo SDK 57** with **React 19** and **React Native 0.86**
- **Expo Router** — file-based routing with `NativeTabs` (3 tabs: Listen, Schedule, More)
- **@expo/ui** — real SwiftUI on iOS and Jetpack Compose on Android. Its `Icon`
  is what makes glyphs render on both platforms: every icon in this app used to
  be an `sf:` source handed to `expo-image`, which is iOS-only, so on Android
  the play button was an empty circle and the social links were blank. Pairs
  live in `components/common/app-icon.tsx`, keyed by the SF Symbol name, so a
  call site cannot supply half of one. The tab bar uses expo-router's own
  `sf` + `md` props rather than `@expo/ui`, since NativeTabs draws its own icons.
  Settings are `List` / `ListItem` / `Switch` / `Picker` from it — see Native
  controls below
- **expo-audio** — live streaming, background playback and lock screen controls. First-party, so it supports the New Architecture that SDK 57 defaults to, and the lock screen drives the player natively — there is no playback service to register and no remote-command handlers to attach
- **@techcake/broadcake-sdk** — v1 public API client (zero auth)
- **React Query** (`@tanstack/react-query`) with AsyncStorage persister for offline cache
- **expo-image** — remote images (avatars, artwork). Icons go through `AppIcon`, not this
- **react-native-reanimated** — skeleton shimmer, fade-in animations
- **date-fns** — date formatting
- **expo-haptics** — iOS tactile feedback

## Project Structure

```
packages/app-template/
  broadcake.config.ts       Station config (owner edits this)
  app.json                  Expo config
  index.ts                  Entry point (expo-router only — nothing to register)
  src/
    app/                    Expo Router file-based routing
      _layout.tsx           Root layout (QueryClient → Theme → Player → Stack)
      (tabs)/
        _layout.tsx         3-tab NativeTabs (Listen, Schedule, More)
        (listen)/           Home: player, now playing, social links, contact form
        (schedule)/         Day picker + schedule list, show/presenter detail modals
        (more)/             Settings: theme, stream quality, about
    lib/
      config.ts             Load + merge broadcake.config.ts with defaults
      sdk.ts                Singleton Broadcake client
      theme.ts              Light/dark theme tokens
      query-client.ts       React Query + AsyncStorage persister
      query-keys.ts         Centralized query key factory
      constants.ts          Polling intervals, storage keys
      format.ts             formatTime, getPresenters
    services/
      player.ts             Audio session, stream loading, lock screen metadata
    hooks/                  React Query hooks (use-station, use-now-playing, use-schedule, etc.)
    contexts/
      theme-context.tsx     Light/dark + system preference + AsyncStorage
      player-context.tsx    Audio player state + stream selection
    components/
      player/               mini-player
      schedule/             day-picker, schedule-slot, schedule-list
      common/               action-button, app-icon, avatar, badge, skeleton, empty-state,
                            time-display, social-icons, error-boundary
      modals/               show-detail, presenter-detail, contact-form
```

## Key Conventions

### Code Style
- **kebab-case** for all filenames
- **Inline styles** — not `StyleSheet.create`, not Tailwind
- **`@/` imports** — path alias for `./src/*`
- **`process.env.EXPO_OS`** — not `Platform.OS`
- **`React.use()`** — not `React.useContext()`
- **`AppIcon`** for every glyph — never `expo-image` with an `sf:` source, which renders nothing on Android

### Data Flow
1. **SDK singleton** (`src/lib/sdk.ts`) — all data from v1 public API
2. **Hooks** (`src/hooks/`) — React Query wrappers calling SDK directly
3. **Screens** consume hooks, never call SDK directly

### Styling
- Theme tokens from `useTheme()` — `theme.foreground`, `theme.card`, `theme.primary`, etc.
- `borderCurve: 'continuous'` on rounded corners
- `boxShadow` CSS prop for shadows
- `contentInsetAdjustmentBehavior="automatic"` on ScrollView/FlatList

### Native controls
Reach for `@expo/ui` before styling a View to look like a control. The More tab
is the worked example: its rows are `List` / `ListItem` with a real `Switch`, and
stream quality is a `Picker` with `appearance="menu"` — which used to be a
horizontal carousel of chips, clipped inside a padded card, for a choice between
three things. The native components bring the platform's own grouping,
separators, press behaviour and accessibility rather than an approximation of
them.

Two rules the compiler will not catch:

- **A `Host` wraps a native tree, so nothing React Native goes inside one.** A
  `Text` heading belongs outside it, as a sibling.
- **A `Host` inside a `Host` is one too many.** `AppIcon` brings its own, which
  is what a React Native screen needs; inside a tree that already has one — a
  `ListItem`'s `leading` slot — use `@expo/ui`'s `Icon` with `appIcon(name)`.

`List` renders native grouped rows and does not recycle them, so it fits a short
fixed set and would be the wrong choice for the schedule.

`ActionButton` is the app's one filled button. It is `variant="text"` with a
background rather than `variant="filled"` on purpose: a filled button takes the
platform accent, and the station's brand colour is configurable, so the accent
would quietly discard it. Tinting a prominent button needs SwiftUI's `tint`,
which is in the iOS-only modifier package and would force a per-platform file
split; `style.backgroundColor` maps to a background modifier on both platforms
from one file. `ErrorBoundary` keeps a plain `Pressable` — it renders when
something has already failed, and the last fallback should not depend on the
native layer.

### Sheets
Show and presenter detail are `BottomSheet`, not React Native `Modal`. Two
things came of it. `presentationStyle="formSheet"` is an iOS-only prop, so on
Android both had been covering the whole screen; the sheet is a Compose
`ModalBottomSheet` there. And the presenter sheet now sits *inside* the show
sheet rather than beside it — as siblings they were two modals asking one view
controller to present, which iOS grants only the first of, so tapping a
presenter while the show was open did nothing.

Their bodies stay React Native inside `RNHostView`. Avatars are remote images
and the rest is text; hosting it keeps one layout instead of one per platform.

- **`BottomSheet` brings its own `Host` — do not wrap it in one.** The universal
  component renders `<Host style={{ position: 'absolute' }}>` internally on both
  platforms. (The `expo-ui` skill's example wraps it; the installed package is
  the authority, and it disagrees.)
- **Give it `snapPoints`.** Without them it sizes to its content, and a body that
  scrolls gives it no height to settle on.
- **`contentPadding={0}`** where the content draws its own insets, or they stack.

`contact-form` is deliberately still a `Modal`. Its `KeyboardAvoidingView`
measures the window rather than a natively-sized sheet, so moving it is a
keyboard-layout change that wants a device to confirm, and unlike the other two
it is not fixing anything.

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
- Nothing is registered at the entry point. The previous library needed a playback service registered there, and when that call was missing the lock screen, notification, headset and car buttons all appeared and silently did nothing — expo-audio's controls drive the player natively, so that failure has no equivalent
- What is on air comes from the station's schedule (`useNowPlaying`), not from tags in the stream. ICY tags only ever existed for stations whose encoder sends them, and they never reached the lock screen anyway — it showed the stream's quality name. `setActiveForLockScreen(..., { isLiveStream: true })` hides the scrub bar, since a live stream has no length to seek through
- `PlayerProvider` wraps app, exposes `usePlayer()` hook
- Stream selection persisted to AsyncStorage

### No show reminders
The template shipped a "Notify me" feature that nothing could reach: the hooks
and scheduling existed, no component ever called them, and the More tab told
people to "tap a show in the schedule to enable" a control that was never
built. Two latent bugs sat behind it too — reminders fired in the device's
timezone rather than the station's, and a lead time crossing midnight landed
about a day late. It has been removed rather than left advertised. Anything
reinstating it needs a real entry point on the show detail before the
scheduling is worth fixing.
