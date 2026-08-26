import React, { useState } from 'react'
import { View, Text, ScrollView, Pressable, RefreshControl } from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'
import { useTheme } from '@/contexts/theme-context'
import { useStation } from '@/hooks/use-station'
import { useNowPlaying } from '@/hooks/use-now-playing'
import { usePlayer } from '@/contexts/player-context'
import { config } from '@/lib/config'
import { formatTime, getPresenters, slotSentence, triggerHaptic } from '@/lib/format'
import { PlayButton } from '@/components/player/play-button'
import { SocialIcons } from '@/components/common/social-icons'
import { Avatar } from '@/components/common/avatar'
import { Artwork, ArtworkWithOverlay } from '@/components/common/artwork'
import { Badge } from '@/components/common/badge'
import { ContactForm } from '@/components/modals/contact-form'
import { AppIcon } from '@/components/common/app-icon'

export default function ListenScreen() {
	const { theme, colorScheme } = useTheme()
	const { data: station, isError: stationError, refetch: refetchStation } = useStation()
	const { data: nowPlaying, refetch: refetchNowPlaying } = useNowPlaying()
	const { playerError } = usePlayer()
	const [contactFormVisible, setContactFormVisible] = useState(false)
	const [refreshing, setRefreshing] = useState(false)

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
				// flexGrow so the content area fills the screen even when it is
				// shorter than one, which is what lets the social row sit at the
				// bottom rather than trailing the cards with a void beneath it.
				contentContainerStyle={{ padding: 16, gap: 20, paddingBottom: 48, flexGrow: 1 }}
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
						<AppIcon name="wifi.exclamationmark" size={18} color={theme.dangerText} />
						<Text style={{ fontSize: 14, color: theme.dangerText, flex: 1 }}>
							Failed to load station data. Pull to refresh.
						</Text>
					</View>
				)}

				{/*
				  On air — one card, with the player in it.

				  It used to be two: a player card naming the show, then this card
				  naming it again. The player card managed to say it twice on its own,
				  because its second line was written for ICY stream tags and now reads
				  from the schedule, so "artist – title" came out as the presenters and
				  the show. Three statements of one fact, stacked.
				*/}
				{nowPlaying?.now ? (
					<Animated.View
						entering={FadeIn.duration(300)}
						style={{
							backgroundColor: theme.card,
							borderRadius: 12,
							borderCurve: 'continuous',
							padding: 16,
							borderWidth: 1,
							borderColor: theme.infoText,
							gap: 12,
							boxShadow: colorScheme === 'dark'
								? '0 2px 8px rgba(0,0,0,0.4)'
								: '0 2px 8px rgba(0,0,0,0.08)',
						}}
					>
						{/* Across the top of the card, not indented past the play button.
						    Hidden from accessibility: the sentence below already opens
						    with "On air", so announcing this too would repeat it. */}
						<View
							style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
							accessibilityElementsHidden
							importantForAccessibility="no-hide-descendants"
						>
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

						<View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
						{/* The play control sits on the artwork rather than beside it.
						    Beside it, the artwork and a 56pt button together left the
						    show name about 140pt to wrap in. */}
						<ArtworkWithOverlay size={88}>
							<PlayButton streams={streams} size={52} />
						</ArtworkWithOverlay>

						{/* One element, one sentence — see slotSentence above. */}
						<View
							style={{ flex: 1, gap: 8 }}
							accessible
							accessibilityRole="summary"
							accessibilityLabel={slotSentence(nowPlaying.now, 'On air')}
						>
							<Text style={{ fontSize: 20, fontWeight: '700', color: theme.foreground }}>
								{nowPlaying.now.show_name}
							</Text>

							{nowPlaying.now.presenters.length > 0 && (
								<View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
									<View style={{ flexDirection: 'row' }}>
										{nowPlaying.now.presenters.slice(0, 3).map((p, i) => (
											<View key={i} style={{ marginLeft: i > 0 ? -8 : 0, zIndex: 3 - i }}>
												<Avatar name={p.name} size={28} />
											</View>
										))}
									</View>
									<Text style={{ fontSize: 14, color: theme.mutedForeground, flex: 1 }}>
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
						</View>
						</View>
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
							flexDirection: 'row',
							alignItems: 'center',
							gap: 14,
						}}
					>
						{/* Off air is not off stream — automation is still playing. */}
						<ArtworkWithOverlay size={88}>
							<PlayButton streams={streams} size={52} />
						</ArtworkWithOverlay>

						<View
							style={{ flex: 1, gap: 6 }}
							accessible
							accessibilityRole="summary"
							accessibilityLabel={
								nowPlaying?.next
									? 'Off air. ' + slotSentence(nowPlaying.next, 'Up next')
									: 'Off air'
							}
						>
							<View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
								<AppIcon name="moon.stars" size={20} color={theme.mutedForeground} />
								<Text style={{ fontSize: 16, fontWeight: '600', color: theme.foreground }}>
									Off Air
								</Text>
							</View>
							{nowPlaying?.next && (
								<Text style={{ fontSize: 14, color: theme.mutedForeground }}>
									Up next: {nowPlaying.next.show_name} at {formatTime(nowPlaying.next.slot_start)}
								</Text>
							)}
						</View>
					</View>
				)}

				{playerError && (
					<Text
						style={{ fontSize: 13, color: theme.dangerText, paddingHorizontal: 4 }}
						accessibilityRole="alert"
					>
						{playerError}
					</Text>
				)}

				{/* Up Next */}
				{nowPlaying?.now && nowPlaying?.next && (
					<View
						style={{
							backgroundColor: theme.card,
							borderRadius: 12,
							borderCurve: 'continuous',
							padding: 16,
							gap: 12,
							borderWidth: 1,
							borderColor: theme.border,
							flexDirection: 'row',
							alignItems: 'center',
						}}
						accessible
						accessibilityRole="summary"
						accessibilityLabel={slotSentence(nowPlaying.next, 'Up next')}
					>
						<Artwork size={56} radius={8} />
						<View style={{ flex: 1, gap: 8 }}>
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
					</View>
				)}

				{/* Pushed to the bottom by the auto margin, which absorbs whatever
				    space is left over. When the cards are tall enough to fill the
				    screen there is none, and this just follows them. */}
				<View style={{ marginTop: 'auto', gap: 20 }}>
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
							triggerHaptic()
							setContactFormVisible(true)
						}}
						accessibilityRole="button"
						accessibilityLabel="Message the station"
						style={({ pressed }) => ({
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
							opacity: pressed ? 0.75 : 1,
						})}
					>
						<AppIcon name="envelope" size={18} color={theme.foreground} />
						<Text style={{ fontSize: 15, fontWeight: '600', color: theme.foreground }}>
							Message the Station
						</Text>
					</Pressable>
				)}
				</View>
			</ScrollView>

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
