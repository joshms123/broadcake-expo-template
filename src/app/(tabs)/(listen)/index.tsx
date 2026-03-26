import React, { useState } from 'react'
import { View, Text, ScrollView, Pressable, RefreshControl } from 'react-native'
import { Image } from 'expo-image'
import * as Haptics from 'expo-haptics'
import Animated, { FadeIn } from 'react-native-reanimated'
import { useTheme } from '@/contexts/theme-context'
import { useStation } from '@/hooks/use-station'
import { useNowPlaying } from '@/hooks/use-now-playing'
import { config } from '@/lib/config'
import { formatTime, getPresenters } from '@/lib/format'
import { MiniPlayer } from '@/components/player/mini-player'
import { FullPlayer } from '@/components/player/full-player'
import { SocialIcons } from '@/components/common/social-icons'
import { Avatar } from '@/components/common/avatar'
import { Badge } from '@/components/common/badge'
import { Skeleton } from '@/components/common/skeleton'
import { ContactForm } from '@/components/modals/contact-form'

export default function ListenScreen() {
	const { theme, colorScheme } = useTheme()
	const { data: station, isError: stationError, refetch: refetchStation } = useStation()
	const { data: nowPlaying, isError: nowPlayingError, refetch: refetchNowPlaying } = useNowPlaying()
	const [playerExpanded, setPlayerExpanded] = useState(false)
	const [contactFormVisible, setContactFormVisible] = useState(false)
	const [refreshing, setRefreshing] = useState(false)

	const stationName = config.name ?? station?.name ?? ''
	const streams = station?.streams ?? []
	const socialLinks = station?.social_links ?? []

	const onRefresh = async () => {
		setRefreshing(true)
		await Promise.all([refetchStation(), refetchNowPlaying()])
		setRefreshing(false)
	}

	return (
		<>
			<ScrollView
				style={{ flex: 1, backgroundColor: theme.background }}
				contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 32 }}
				contentInsetAdjustmentBehavior="automatic"
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
				}
			>
				{/* Station header */}
				{config.tagline && (
					<Text style={{ fontSize: 15, color: theme.mutedForeground }}>
						{config.tagline}
					</Text>
				)}

				{/* Error state */}
				{stationError && !station && (
					<View
						style={{
							backgroundColor: theme.dangerBg,
							padding: 14,
							borderRadius: 10,
							borderCurve: 'continuous',
							flexDirection: 'row',
							alignItems: 'center',
							gap: 10,
						}}
					>
						<Image
							source="sf:wifi.exclamationmark"
							style={{ width: 18, height: 18, tintColor: theme.dangerText }}
							accessible={false}
						/>
						<Text style={{ fontSize: 14, color: theme.dangerText, flex: 1 }}>
							Failed to load station data. Pull to refresh.
						</Text>
					</View>
				)}

				{/* Mini Player */}
				<MiniPlayer
					streams={streams}
					nowPlaying={nowPlaying ?? null}
					onExpand={() => setPlayerExpanded(true)}
				/>

				{/* Now Playing Card */}
				{nowPlaying?.now ? (
					<Animated.View
						entering={FadeIn.duration(300)}
						style={{
							backgroundColor: theme.card,
							borderRadius: 12,
							borderCurve: 'continuous',
							padding: 16,
							gap: 12,
							borderWidth: 1,
							borderColor: theme.infoText,
							boxShadow: colorScheme === 'dark'
								? '0 2px 8px rgba(0,0,0,0.4)'
								: '0 2px 8px rgba(0,0,0,0.08)',
						}}
						accessibilityRole="summary"
						accessibilityLabel={`Now playing: ${nowPlaying.now.show_name}`}
					>
						<View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
							<View
								style={{
									width: 8,
									height: 8,
									borderRadius: 4,
									backgroundColor: '#22c55e',
								}}
							/>
							<Text style={{ fontSize: 12, fontWeight: '600', color: theme.mutedForeground, textTransform: 'uppercase', letterSpacing: 0.5 }}>
								On Air Now
							</Text>
						</View>

						<Text style={{ fontSize: 20, fontWeight: '700', color: theme.foreground }}>
							{nowPlaying.now.show_name}
						</Text>

						{nowPlaying.now.presenters.length > 0 && (
							<View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
								<View style={{ flexDirection: 'row' }}>
									{nowPlaying.now.presenters.slice(0, 3).map((p, i) => (
										<View key={p.name} style={{ marginLeft: i > 0 ? -8 : 0, zIndex: 3 - i }}>
											<Avatar name={p.name} size={28} />
										</View>
									))}
								</View>
								<Text style={{ fontSize: 14, color: theme.mutedForeground }}>
									{getPresenters(nowPlaying.now.presenters)}
								</Text>
							</View>
						)}

						<Text style={{ fontSize: 13, color: theme.mutedForeground, fontVariant: ['tabular-nums'] }}>
							{formatTime(nowPlaying.now.slot_start)} – {formatTime(nowPlaying.now.slot_end)}
						</Text>

						{nowPlaying.now.genres.length > 0 && (
							<View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>
								{nowPlaying.now.genres.map((g) => (
									<Badge key={g.slug} label={g.name} />
								))}
							</View>
						)}
					</Animated.View>
				) : (
					<View
						style={{
							backgroundColor: theme.card,
							borderRadius: 12,
							borderCurve: 'continuous',
							padding: 16,
							borderWidth: 1,
							borderColor: theme.border,
							alignItems: 'center',
							gap: 8,
						}}
					>
						<Image
							source="sf:moon.stars"
							style={{ width: 32, height: 32, tintColor: theme.mutedForeground }}
							accessible={false}
						/>
						<Text style={{ fontSize: 16, fontWeight: '600', color: theme.foreground }}>
							Off Air
						</Text>
						{nowPlaying?.next && (
							<Text style={{ fontSize: 14, color: theme.mutedForeground, textAlign: 'center' }}>
								Up next: {nowPlaying.next.show_name} at {formatTime(nowPlaying.next.slot_start)}
							</Text>
						)}
					</View>
				)}

				{/* Up Next Card */}
				{nowPlaying?.now && nowPlaying?.next && (
					<View
						style={{
							backgroundColor: theme.card,
							borderRadius: 12,
							borderCurve: 'continuous',
							padding: 16,
							gap: 8,
							borderWidth: 1,
							borderColor: theme.border,
						}}
					>
						<Text style={{ fontSize: 12, fontWeight: '600', color: theme.mutedForeground, textTransform: 'uppercase', letterSpacing: 0.5 }}>
							Up Next
						</Text>
						<Text style={{ fontSize: 17, fontWeight: '600', color: theme.foreground }}>
							{nowPlaying.next.show_name}
						</Text>
						{nowPlaying.next.presenters.length > 0 && (
							<Text style={{ fontSize: 14, color: theme.mutedForeground }}>
								{getPresenters(nowPlaying.next.presenters)}
							</Text>
						)}
						<Text style={{ fontSize: 13, color: theme.mutedForeground, fontVariant: ['tabular-nums'] }}>
							{formatTime(nowPlaying.next.slot_start)} – {formatTime(nowPlaying.next.slot_end)}
						</Text>
					</View>
				)}

				{/* Social Links */}
				{socialLinks.length > 0 && (
					<View style={{ gap: 10 }}>
						<Text
							style={{ fontSize: 13, fontWeight: '600', color: theme.mutedForeground, textTransform: 'uppercase', letterSpacing: 0.5 }}
							accessibilityRole="header"
						>
							Follow Us
						</Text>
						<SocialIcons links={socialLinks} />
					</View>
				)}

				{/* Contact button */}
				{config.features?.contactForm && config.features?.contactFormSlug && (
					<Pressable
						onPress={() => {
							if (process.env.EXPO_OS === 'ios') {
								Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
							}
							setContactFormVisible(true)
						}}
						accessibilityRole="button"
						accessibilityLabel="Message the station"
						style={{
							flexDirection: 'row',
							alignItems: 'center',
							justifyContent: 'center',
							gap: 8,
							paddingVertical: 14,
							backgroundColor: theme.secondary,
							borderRadius: 12,
							borderCurve: 'continuous',
							borderWidth: 1,
							borderColor: theme.border,
						}}
					>
						<Image
							source="sf:envelope"
							style={{ width: 18, height: 18, tintColor: theme.foreground }}
							accessible={false}
						/>
						<Text style={{ fontSize: 15, fontWeight: '600', color: theme.foreground }}>
							Message the Station
						</Text>
					</Pressable>
				)}
			</ScrollView>

			{/* Full Player Modal */}
			<FullPlayer
				visible={playerExpanded}
				onClose={() => setPlayerExpanded(false)}
				streams={streams}
				nowPlaying={nowPlaying ?? null}
				stationName={stationName}
			/>

			{/* Contact Form Modal */}
			{config.features?.contactFormSlug && (
				<ContactForm
					visible={contactFormVisible}
					onClose={() => setContactFormVisible(false)}
					formSlug={config.features.contactFormSlug}
				/>
			)}
		</>
	)
}
