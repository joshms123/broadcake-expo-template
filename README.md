# Broadcake App Template

A cloneable Expo React Native app for radio station listeners. Customize with your station config and publish to the App Store and Google Play.

## Features

- Live audio streaming with background playback and lock screen controls
- Automatic track title detection from ICY stream metadata
- Now playing and up next display
- Weekly schedule browser with day navigation
- Show and presenter detail views
- Contact form for messaging the station
- Show notifications ("Notify me" reminders)
- Dark mode support
- Offline caching

## Prerequisites

- Node.js 18+
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [EAS CLI](https://docs.expo.dev/eas/) (for app store builds)
- Xcode (for iOS) / Android Studio (for Android)

> **Note:** This app requires a dev build (not Expo Go) due to `react-native-track-player`.

## Getting Started

1. **Clone or copy this directory**

2. **Configure your station** — edit `broadcake.config.ts`:
   ```ts
   const config: BroadcakeAppConfig = {
     stationSlug: 'your-station-slug',
     name: 'Your Station',
     tagline: 'Your tagline here',
   }
   ```

3. **Update `app.json`** with your app name, slug, bundle identifiers, and icons.

4. **Install dependencies** (from the monorepo root):
   ```bash
   npm install
   ```

5. **Build and run:**
   ```bash
   cd packages/app-template
   npx expo prebuild
   npx expo run:ios    # or run:android
   ```

## Configuration

All configuration is in `broadcake.config.ts`:

| Option | Type | Default | Description |
|---|---|---|---|
| `stationSlug` | `string` | — | **Required.** Your station slug from Broadcake |
| `baseUrl` | `string` | `https://app.broadcake.com` | API base URL |
| `name` | `string` | — | Display name on home screen |
| `tagline` | `string` | — | Subtitle below station name |
| `theme.light.primary` | `string` | `#0f172b` | Light theme accent color (hex) |
| `theme.dark.primary` | `string` | `#f8fafc` | Dark theme accent color (hex) |
| `features.notifications` | `boolean` | `true` | Enable "Notify me" on shows |
| `features.contactForm` | `boolean` | `true` | Show "Message the Station" button |
| `features.contactFormSlug` | `string` | — | Form slug for contact (from Broadcake dashboard) |
| `nowPlayingInterval` | `number` | `30000` | Now-playing poll interval (ms) |

## Building for App Stores

```bash
# Install EAS CLI
npm install -g eas-cli

# Configure (first time)
eas build:configure

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android

# Submit
eas submit --platform ios
eas submit --platform android
```

## Tech Stack

- Expo SDK 55 + React Native 0.83
- react-native-track-player (audio streaming + ICY metadata)
- @techcake/broadcake-sdk (v1 public API)
- React Query + AsyncStorage (offline caching)
- expo-notifications (local show reminders)
