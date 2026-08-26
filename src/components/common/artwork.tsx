import React from 'react'
import { View, type ImageStyle } from 'react-native'
import { Image } from 'expo-image'
import { useTheme } from '@/contexts/theme-context'
import { config } from '@/lib/config'

/**
 * The station's own icon, standing in until there is artwork to show.
 *
 * A station clones this template and replaces `icon.png` with its logo, so the
 * app icon is the one image every station is guaranteed to have. Nothing else
 * is: the v1 station endpoint returns no logo, and while shows carry a
 * `cover_url`, `ScheduleSlot` does not — so what is on air cannot be drawn with
 * its own art today without a second request per slot.
 *
 * That is the point of the `uri` prop. When the now-playing payload starts
 * carrying the show's cover, this becomes one prop at the call site and no
 * layout changes at all.
 *
 * A station wanting in-app artwork that is not its launcher icon sets `logo` in
 * `broadcake.config.ts`. The default is the icon rather than a placeholder
 * image on purpose: a placeholder that nobody remembers to replace ships
 * somebody else's branding to the App Store, whereas the icon has necessarily
 * already been replaced.
 */
const STATION_ICON = require('../../../assets/images/icon.png')

/** Config first, then the app icon. */
const FALLBACK = config.logo ?? STATION_ICON

interface ArtworkProps {
	/** Show cover art. Falls back to the station icon when absent. */
	uri?: string | null
	size?: number
	radius?: number
	style?: ImageStyle
}

export function Artwork({ uri, size = 88, radius = 10, style }: ArtworkProps) {
	const { theme } = useTheme()

	return (
		<Image
			source={uri ? { uri } : FALLBACK}
			style={[
				{
					width: size,
					height: size,
					borderRadius: radius,
					backgroundColor: theme.secondary,
				},
				style,
			]}
			contentFit="cover"
			transition={200}
			// Decorative: the card's own label already says what is on air, and a
			// station logo repeated on every card is noise to listen to.
			accessible={false}
		/>
	)
}

/**
 * Artwork with a control sitting on it — the arrangement a radio app uses for
 * what is playing now.
 *
 * The scrim is not decoration. The button has to stay legible over artwork
 * nobody here has seen, which for a station-supplied image means assuming the
 * worst about its brightness.
 */
export function ArtworkWithOverlay({
	uri,
	size = 88,
	radius = 10,
	children,
}: ArtworkProps & { children: React.ReactNode }) {
	return (
		<View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
			<Artwork uri={uri} size={size} radius={radius} style={{ position: 'absolute' }} />
			<View
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					borderRadius: radius,
					borderCurve: 'continuous',
					backgroundColor: 'rgba(0,0,0,0.28)',
				}}
			/>
			{children}
		</View>
	)
}
