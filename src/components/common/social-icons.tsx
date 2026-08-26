import React from 'react'
import { View } from 'react-native'
import * as WebBrowser from 'expo-web-browser'
import { Button, Host, Icon, Row, Text } from '@expo/ui'
import { useTheme } from '@/contexts/theme-context'
import { triggerHaptic } from '@/lib/format'
import type { StationSocialLink } from '@techcake/broadcake-sdk'
import { appIcon, type AppIconName } from '@/components/common/app-icon'

const PLATFORM_ICONS: Record<string, AppIconName> = {
	instagram: 'camera',
	facebook: 'hand.thumbsup',
	x: 'at',
	mastodon: 'bubble.left',
	tiktok: 'music.note',
	youtube: 'play.rectangle',
	bluesky: 'cloud',
	threads: 'at.circle',
	discord: 'bubble.left.and.bubble.right',
	linkedin: 'briefcase',
}

interface SocialIconsProps {
	links: StationSocialLink[]
}

/**
 * The station's social accounts, as native buttons.
 *
 * Three things changed together, and they depend on each other.
 *
 * These were `Pressable`s with `accessibilityRole="link"` — but they open an
 * in-app browser sheet rather than leaving the app, so button is the honest
 * trait, and `@expo/ui`'s `Button` is a real one: a SwiftUI button on iOS, a
 * Compose button on Android, with the platform's own press feedback.
 *
 * They are labelled now rather than icon-only, and that is what makes the
 * native button usable here. `@expo/ui` has no cross-platform
 * `accessibilityLabel` — on iOS an icon-only native button would have had no
 * name at all — so the name has to come from visible text. Which these wanted
 * anyway: the glyphs are generic SF Symbols, not brand marks, and nobody reads
 * a thumbs-up as Facebook or an @ as X.
 *
 * The label is the platform, not "Visit Instagram". A button already announces
 * that it is a button.
 */
export function SocialIcons({ links }: SocialIconsProps) {
	const { theme } = useTheme()

	if (links.length === 0) return null

	const handlePress = (url: string) => {
		try {
			const parsed = new URL(url)
			if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return
		} catch {
			return
		}
		triggerHaptic()
		WebBrowser.openBrowserAsync(url)
	}

	return (
		<View style={{ flexDirection: 'row', gap: 10, flexWrap: 'wrap' }}>
			{links.map((link, i) => {
				const icon = PLATFORM_ICONS[link.platform] ?? 'globe'
				const label = link.platform.charAt(0).toUpperCase() + link.platform.slice(1)

				return (
					// Position, not url: station_social_links has no unique constraint
					// on url, so two identical ones would collide as keys.
					// A Host each, so the row can still wrap -- @expo/ui's Row cannot.
					<Host matchContents key={i}>
						<Button variant="outlined" onPress={() => handlePress(link.url)}>
							<Row spacing={6} alignment="center">
								<Icon name={appIcon(icon)} size={16} color={theme.foreground} />
								<Text textStyle={{ fontSize: 14, fontWeight: '500', color: theme.foreground }}>
									{label}
								</Text>
							</Row>
						</Button>
					</Host>
				)
			})}
		</View>
	)
}
