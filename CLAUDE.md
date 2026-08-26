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
- **expo-image** — remote images (avatars, artwork) and the social brand marks,
  which are local SVGs (it decodes SVG on iOS, Android and web). System symbols
  go through `AppIcon`, not this
- **Simple Icons** — the social brand marks, CC0, committed under `assets/social/`
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
      format.ts             formatTime, getPresenters, slotSentence, triggerHaptic
      markdown.ts           parse descriptions/bios to blocks + spans (no HTML)
      links.ts              openLink -- hand a URL to the installed app
    services/
      player.ts             Audio session, stream loading, lock screen metadata
    hooks/                  React Query hooks (use-station, use-now-playing, use-schedule, etc.)
    contexts/
      theme-context.tsx     Light/dark + system preference + AsyncStorage
      player-context.tsx    Audio player state + stream selection
    components/
      player/               play-button
      schedule/             day-picker, schedule-slot, schedule-list
      common/               action-button, app-icon, artwork, avatar, badge, markdown-text, skeleton,
                            empty-state, time-display, social-icons, social-marks,
                            error-boundary
  assets/
    social/                 brand marks, two tones each (generated -- see below)
      modals/               show-detail, presenter-detail, contact-form
```

## Key Conventions

### Code Style
- **kebab-case** for all filenames
- **Inline styles** — not `StyleSheet.create`, not Tailwind
- **`@/` imports** — path alias for `./src/*`
- **`process.env.EXPO_OS`** — not `Platform.OS`
- **`React.use()`** — not `React.useContext()`
- **`AppIcon`** for every *system* glyph — never `expo-image` with an `sf:` source, which renders nothing on Android. Brand marks are not system glyphs; see Social marks below

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

### Descriptions are markdown
Show descriptions and presenter bios are written in the dashboard and the
station website renders them as markdown. The app rendered the source, so a
description reading `**The Midway Extended Play** - a daily classic 12"
extended mix` appeared on screen with the asterisks in it.

`MarkdownText` renders them. It does **not** go through HTML the way
`packages/site-template` does — React Native has no HTML to render, so
`$lib/markdown` parses straight to blocks and spans that map onto `Text`.
That is shorter and it removes the sanitising problem entirely: nothing in
there can produce a tag. A link whose scheme is not http(s) keeps its text and
loses its target.

Anything unrecognised stays literal, which is the right failure — a stray
asterisk in `12" mix * see below` should look like a stray asterisk rather than
swallowing the rest of the paragraph. Underscores only mark emphasis at a word
boundary, so `file_name_here` and a URL with underscores in it survive intact.

Where there is no room to format — a two-line preview, an accessibility label —
use `stripMarkdown()`. Never render the raw source.

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
- **`contentInsetAdjustmentBehavior="never"` on a `ScrollView` inside one.** The
  iOS default is `automatic`, which exists for a scroll view under a navigation
  bar; inside a sheet there is none to inset for, and left on it offset the
  content — the top of the description was simply not on screen.

`contact-form` is deliberately still a `Modal`. Its `KeyboardAvoidingView`
measures the window rather than a natively-sized sheet, so moving it is a
keyboard-layout change that wants a device to confirm, and unlike the other two
it is not fixing anything.

### Artwork
The on-air and up-next cards carry a square tile, and it is the station's app
icon. That is deliberate rather than a placeholder left in: a station clones
this template and replaces `icon.png` with its own logo, so it is the one image
every station is guaranteed to have. Nothing else is — the v1 station endpoint
returns no logo at all, and while a `Show` carries `cover_url`, `ScheduleSlot`
does not, so what is on air cannot be drawn with its own art today without a
second request per slot.

`Artwork` takes a `uri` for exactly that. When now-playing starts carrying the
show's cover, it is one prop at the call site and no layout change.

A station wanting in-app artwork that is not its launcher icon sets `logo` in
`broadcake.config.ts`. There is deliberately **no** placeholder image shipped as
the visible default: a placeholder nobody remembers to replace puts Broadcake's
branding in someone else's App Store listing, whereas the icon has necessarily
already been replaced to ship at all. The two failure modes are not symmetric,
and the discoverability problem a placeholder would solve is better solved by a
typed field in the file a station is already editing.

The play control sits *on* the tile (`ArtworkWithOverlay`) rather than beside
it — side by side, an 88pt tile and a 56pt button left the show name about
140pt to wrap in. The scrim under the button is not decoration: it has to stay
legible over station-supplied artwork nobody has seen.

### No forced attribution
The More tab linked to broadcake.com under "Powered by Broadcake". A template
that stations clone and ship under their own name should not make them carry
someone else's on a screen their listeners see, so it is a link to the station's
own site instead.

The address is `station.listen_url` from the API, not a config field — the
station already sets it in the dashboard, and a second place to set it is a
second place for it to be wrong. No URL set, no row.

If attribution is ever wanted back it should be opt-in, and the store listing or
the README is the better place for it than a listener-facing screen.

### Opening links
`openLink()` from `$lib/links` for anything a station or presenter supplied — a
social profile, a link in a bio or description. It uses `Linking.openURL`, which
lets the installed app claim the URL.

**Not `WebBrowser.openBrowserAsync`.** The in-app browser is an
`SFSafariViewController`, and iOS deliberately does not follow universal links
out of one — so tapping Instagram opened instagram.com in a web view rather than
the Instagram app, with the app installed. A bio linking to a profile had the
same problem, which is why both go through the one helper.

It stays an https URL rather than a per-platform scheme like
`instagram://user?username=`. Schemes mean parsing a profile URL per platform,
declaring each in `LSApplicationQueriesSchemes` before `canOpenURL` will even
answer, and revisiting all of it when a platform changes its mind; a universal
link needs none of that and falls back to a browser by itself.

`WebBrowser` is still right for a link the app owns — "Powered by Broadcake" on
the More tab — where coming straight back matters more than handing off.

### Social marks
Social links are icon-only circular buttons, which is what a "Follow us" row is
everywhere — but that only works with real brand marks, and this had SF Symbols
standing in for logos: a camera for Instagram, a thumbs-up for Facebook, an @
for X. SF Symbols carries no third-party brand marks and never will, so the
mapping was a guess, and it failed sighted users before it failed anyone else.

The marks are Simple Icons (CC0), committed under `assets/social/` and mapped in
`social-marks.ts`. Points worth keeping:

- **Two tones per brand, not one tinted mark.** `tintColor` on an SVG is one
  more thing to be wrong on a device, and a black glyph is invisible on a dark
  chip. Picking the file by colour scheme cannot fail that way.
- **`require` paths must be literal** for Metro to resolve them, so that file is
  generated rather than looped. Regenerate it if you add a brand.
- **Metro treats `.svg` as an asset** (it is in `assetExts`, not `sourceExts`).
  Adding `react-native-svg-transformer` would move it to `sourceExts` and break
  every one of these requires.
- **`platform` is free text in the database**, so anything unmapped falls back to
  a system glyph. LinkedIn is one: Simple Icons removed it after a trademark
  request.
- **`Pressable`, not `@expo/ui`'s `Button`.** Neither platform has a
  circular-icon-button primitive, and `@expo/ui` has no cross-platform
  `accessibilityLabel` — a native icon-only button would have had no name under
  VoiceOver. The native-button argument applies to buttons with text.

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
- **A card is one stop, not four.** What is on air is one fact shown on four
  lines, and without `accessible` on the container a screen reader stops at each
  one — "On Air Now", the show, the presenters, the times. Collapse the card and
  give it `slotSentence()` from `$lib/format`: `On air: Breakfast Show with Dave
  and Sam. 7:00 AM to 9:00 AM. Indie, Rock`. Anything the collapse swallows
  (genre badges) has to be in the sentence.

  Note `accessibilityLabel` alone does nothing on a `View` — iOS only reads it
  when `accessible` is set, so a label without it is dead code and the children
  are still announced one by one. That is what this was.
- **Say it, do not punctuate it.** `slotSentence` writes "to" rather than the en
  dash the card draws, separates the times with a full stop rather than a comma
  so they do not sound like another presenter, and joins names with "and".
- **`@expo/ui` has no cross-platform `accessibilityLabel`.** iOS accessibility is
  not wired up in it yet, so an icon-only native control has no name there. A
  native button needs visible text — which is why the social buttons are
  labelled rather than bare glyphs.

### Audio Player
- Nothing is registered at the entry point. The previous library needed a playback service registered there, and when that call was missing the lock screen, notification, headset and car buttons all appeared and silently did nothing — expo-audio's controls drive the player natively, so that failure has no equivalent
- What is on air comes from the station's schedule (`useNowPlaying`), not from tags in the stream. ICY tags only ever existed for stations whose encoder sends them, and they never reached the lock screen anyway — it showed the stream's quality name. `setActiveForLockScreen(..., { isLiveStream: true })` hides the scrub bar, since a live stream has no length to seek through
- `PlayerProvider` wraps app, exposes `usePlayer()` hook
- Stream selection persisted to AsyncStorage
- The play control lives *in* the on-air card, and there is no separate player
  card. There used to be one, and between them the show name appeared three
  times: the player card printed it, then printed `currentMetadata` beneath it
  as "artist – title" — which since the expo-audio move is the presenters and
  the show, not stream tags — and then the on-air card printed it again

### No show reminders
The template shipped a "Notify me" feature that nothing could reach: the hooks
and scheduling existed, no component ever called them, and the More tab told
people to "tap a show in the schedule to enable" a control that was never
built. Two latent bugs sat behind it too — reminders fired in the device's
timezone rather than the station's, and a lead time crossing midnight landed
about a day late. It has been removed rather than left advertised. Anything
reinstating it needs a real entry point on the show detail before the
scheduling is worth fixing.
