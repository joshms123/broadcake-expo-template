import React from 'react'
import { View, Pressable } from 'react-native'
import { Image } from 'expo-image'
import { useTheme } from '@/contexts/theme-context'
import { triggerHaptic } from '@/lib/format'
import { openLink } from '@/lib/links'
import type { StationSocialLink } from '@techcake/broadcake-sdk'
import { AppIcon, type AppIconName } from '@/components/common/app-icon'
import { BRAND_MARKS } from '@/components/common/social-marks'

/**
 * For platforms with no CC0 brand mark. `platform` is free text in the
 * database, so a station can type anything, and these are the best a system
 * symbol can do -- which is not very well, hence the marks.
 */
const FALLBACK_ICONS: Record<string, AppIconName> = {
	linkedin: 'briefcase',
}

interface SocialIconsProps {
	links: StationSocialLink[]
}

/**
 * The station's social accounts.
 *
 * Icon-only circular buttons, which is what apps do with a "Follow us" row --
 * but that only works with real brand marks, and it did not have any. See
 * `social-marks.ts` for where they came from and why there are two tones.
 *
 * `Pressable` rather than `@expo/ui`'s `Button`, and that is not a compromise:
 * neither platform has a circular-icon-button primitive for a native button to
 * be, and `@expo/ui` has no cross-platform `accessibilityLabel`, so a native
 * icon-only button would have had no name at all under VoiceOver. The native
 * button argument applies to buttons with text.
 *
 * The label is the platform, not "Visit Instagram" -- a button already
 * announces that it is a button.
 */
export function SocialIcons({ links }: SocialIconsProps) {
	const { theme, colorScheme } = useTheme()

	if (links.length === 0) return null

	const handlePress = (url: string) => {
		triggerHaptic()
		openLink(url)
	}

	return (
		<View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap' }}>
			{links.map((link, i) => {
				const mark = BRAND_MARKS[link.platform]
				const label = link.platform.charAt(0).toUpperCase() + link.platform.slice(1)

				return (
					// Position, not url: station_social_links has no unique constraint
					// on url, so two identical ones would collide as keys.
					<Pressable
						key={i}
						onPress={() => handlePress(link.url)}
						accessibilityRole="button"
						accessibilityLabel={label}
						style={({ pressed }) => ({
							width: 44,
							height: 44,
							borderRadius: 22,
							backgroundColor: theme.secondary,
							alignItems: 'center',
							justifyContent: 'center',
							opacity: pressed ? 0.6 : 1,
						})}
					>
						{mark ? (
							<Image
								source={colorScheme === 'dark' ? mark.dark : mark.light}
								style={{ width: 20, height: 20 }}
								contentFit="contain"
								// The button carries the name; the glyph inside it must not
								// repeat it.
								accessible={false}
							/>
						) : (
							<AppIcon
								name={FALLBACK_ICONS[link.platform] ?? 'globe'}
								size={20}
								color={theme.foreground}
							/>
						)}
					</Pressable>
				)
			})}
		</View>
	)
}
