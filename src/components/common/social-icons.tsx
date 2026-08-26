import React from 'react'
import { View, Pressable, Text } from 'react-native'
import * as WebBrowser from 'expo-web-browser'
import { useTheme } from '@/contexts/theme-context'
import { triggerHaptic } from '@/lib/format'
import type { StationSocialLink } from '@techcake/broadcake-sdk'
import { AppIcon, type AppIconName } from '@/components/common/app-icon'

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
		<View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap' }}>
			{links.map((link, i) => {
				const icon = PLATFORM_ICONS[link.platform] ?? 'globe'
				const label = link.platform.charAt(0).toUpperCase() + link.platform.slice(1)

				return (
					<Pressable
						key={i}
						onPress={() => handlePress(link.url)}
						accessibilityRole="link"
						accessibilityLabel={`Visit ${label}`}
						style={{
							width: 44,
							height: 44,
							borderRadius: 22,
							backgroundColor: theme.secondary,
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<AppIcon name={icon} size={20} color={theme.foreground} />
					</Pressable>
				)
			})}
		</View>
	)
}
