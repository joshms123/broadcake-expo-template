import React from 'react'
import { View, Pressable, Text } from 'react-native'
import { Image } from 'expo-image'
import * as WebBrowser from 'expo-web-browser'
import { useTheme } from '@/contexts/theme-context'
import { triggerHaptic } from '@/lib/format'
import type { StationSocialLink } from '@techcake/broadcake-sdk'

const PLATFORM_ICONS: Record<string, string> = {
	instagram: 'sf:camera',
	facebook: 'sf:hand.thumbsup',
	x: 'sf:at',
	mastodon: 'sf:bubble.left',
	tiktok: 'sf:music.note',
	youtube: 'sf:play.rectangle',
	bluesky: 'sf:cloud',
	threads: 'sf:at.circle',
	discord: 'sf:bubble.left.and.bubble.right',
	linkedin: 'sf:briefcase',
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
			{links.map((link) => {
				const icon = PLATFORM_ICONS[link.platform] ?? 'sf:globe'
				const label = link.platform.charAt(0).toUpperCase() + link.platform.slice(1)

				return (
					<Pressable
						key={link.platform}
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
						<Image
							source={icon}
							style={{
								width: 20,
								height: 20,
								tintColor: theme.foreground,
							}}
							accessible={false}
						/>
					</Pressable>
				)
			})}
		</View>
	)
}
