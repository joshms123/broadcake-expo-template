import { Host, Icon } from '@expo/ui'
import type { ColorValue } from 'react-native'

/**
 * One icon, on both platforms.
 *
 * Every glyph in this app was an `sf:` source handed to `expo-image`. That
 * scheme is iOS-only, so on Android the play button was an empty circle, the
 * social links were blank, and the empty states had a gap where their icon
 * should be — in an app template sold as shipping to both stores.
 *
 * `@expo/ui`'s Icon takes a pair: an SF Symbol for iOS and a Material XML
 * vector for Android. The pairs live here rather than at each call site so
 * there is one place to look and no chance of a site supplying half of one.
 * `Icon.select` is what `babel-preset-expo` rewrites into a `Platform.OS`
 * ternary, so each platform's bundle carries only its own asset.
 *
 * Keyed by the SF Symbol name the app already used, which keeps call sites
 * honest: `source="sf:play.fill"` becomes `name="play.fill"`.
 */
const ICONS = {
	'play.fill': Icon.select({
		ios: 'play.fill',
		android: require('@expo/material-symbols/play_arrow.xml'),
	}),
	'pause.fill': Icon.select({
		ios: 'pause.fill',
		android: require('@expo/material-symbols/pause.xml'),
	}),
	'play.rectangle': Icon.select({
		ios: 'play.rectangle',
		android: require('@expo/material-symbols/smart_display.xml'),
	}),
	'wifi.exclamationmark': Icon.select({
		ios: 'wifi.exclamationmark',
		android: require('@expo/material-symbols/wifi_off.xml'),
	}),
	'exclamationmark.triangle': Icon.select({
		ios: 'exclamationmark.triangle',
		android: require('@expo/material-symbols/warning.xml'),
	}),
	'calendar.badge.exclamationmark': Icon.select({
		ios: 'calendar.badge.exclamationmark',
		android: require('@expo/material-symbols/event_busy.xml'),
	}),
	envelope: Icon.select({
		ios: 'envelope',
		android: require('@expo/material-symbols/mail.xml'),
	}),
	globe: Icon.select({
		ios: 'globe',
		android: require('@expo/material-symbols/language.xml'),
	}),
	'bubble.left.and.bubble.right': Icon.select({
		ios: 'bubble.left.and.bubble.right',
		android: require('@expo/material-symbols/forum.xml'),
	}),
	'bubble.left': Icon.select({
		ios: 'bubble.left',
		android: require('@expo/material-symbols/chat.xml'),
	}),
	'hand.thumbsup': Icon.select({
		ios: 'hand.thumbsup',
		android: require('@expo/material-symbols/thumb_up.xml'),
	}),
	briefcase: Icon.select({
		ios: 'briefcase',
		android: require('@expo/material-symbols/work.xml'),
	}),
	'moon.fill': Icon.select({
		ios: 'moon.fill',
		android: require('@expo/material-symbols/dark_mode.xml'),
	}),
	'moon.stars': Icon.select({
		ios: 'moon.stars',
		android: require('@expo/material-symbols/bedtime.xml'),
	}),
	'sun.max.fill': Icon.select({
		ios: 'sun.max.fill',
		android: require('@expo/material-symbols/light_mode.xml'),
	}),
	'music.note': Icon.select({
		ios: 'music.note',
		android: require('@expo/material-symbols/music_note.xml'),
	}),
	cloud: Icon.select({
		ios: 'cloud',
		android: require('@expo/material-symbols/cloud.xml'),
	}),
	camera: Icon.select({
		ios: 'camera',
		android: require('@expo/material-symbols/photo_camera.xml'),
	}),
	at: Icon.select({
		ios: 'at',
		android: require('@expo/material-symbols/alternate_email.xml'),
	}),
	'at.circle': Icon.select({
		ios: 'at.circle',
		android: require('@expo/material-symbols/alternate_email.xml'),
	}),
	'arrow.up.right': Icon.select({
		ios: 'arrow.up.right',
		android: require('@expo/material-symbols/arrow_outward.xml'),
	}),
} as const

export type AppIconName = keyof typeof ICONS

/**
 * The icon's platform pair, for use *inside* an existing `@expo/ui` tree.
 *
 * `AppIcon` below brings its own `Host`, which is what a React Native screen
 * needs. Inside a Host that already exists — a `ListItem`'s leading slot, say —
 * that would nest one Host in another. Use this with `@expo/ui`'s own `Icon`
 * there instead.
 */
export function appIcon(name: AppIconName) {
	return ICONS[name]
}

interface AppIconProps {
	name: AppIconName
	size?: number
	color?: ColorValue
	/**
	 * Left off for a glyph that only decorates text already saying the same
	 * thing. Android maps this to `contentDescription`; iOS accessibility is not
	 * wired up in `@expo/ui` yet, so an icon carrying meaning on its own still
	 * needs a label on whatever contains it.
	 */
	accessibilityLabel?: string
}

export function AppIcon({ name, size = 20, color, accessibilityLabel }: AppIconProps) {
	return (
		<Host matchContents>
			<Icon
				name={ICONS[name]}
				size={size}
				color={color}
				accessibilityLabel={accessibilityLabel}
			/>
		</Host>
	)
}
