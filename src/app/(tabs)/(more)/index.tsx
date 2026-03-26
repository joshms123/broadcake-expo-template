import React from 'react'
import { View, Text, ScrollView, Pressable, Switch } from 'react-native'
import { Image } from 'expo-image'
import * as WebBrowser from 'expo-web-browser'
import * as Haptics from 'expo-haptics'
import { useTheme } from '@/contexts/theme-context'
import { useStation } from '@/hooks/use-station'
import { useNotifications } from '@/hooks/use-notifications'
import { usePlayer } from '@/contexts/player-context'
import { config } from '@/lib/config'
import { StreamSelector } from '@/components/player/stream-selector'

const LEAD_TIME_OPTIONS = [15, 30, 60]

export default function MoreScreen() {
	const { theme, colorScheme, toggleTheme } = useTheme()
	const { data: station } = useStation()
	const { preferences, leadTimeMinutes, setLeadTime } = useNotifications()
	const { selectedStream, selectStream } = usePlayer()

	const streams = station?.streams ?? []
	const activeNotifications = Object.values(preferences).filter((p) => p.enabled)

	return (
		<ScrollView
			style={{ flex: 1, backgroundColor: theme.background }}
			contentContainerStyle={{ padding: 16, gap: 24, paddingBottom: 48 }}
			contentInsetAdjustmentBehavior="automatic"
		>
			{/* Appearance */}
			<Section title="Appearance">
				<View
					style={{
						flexDirection: 'row',
						justifyContent: 'space-between',
						alignItems: 'center',
					}}
				>
					<View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
						<Image
							source={colorScheme === 'dark' ? 'sf:moon.fill' : 'sf:sun.max.fill'}
							style={{ width: 20, height: 20, tintColor: theme.foreground }}
							accessible={false}
						/>
						<Text style={{ fontSize: 15, color: theme.foreground }}>
							{colorScheme === 'dark' ? 'Dark Mode' : 'Light Mode'}
						</Text>
					</View>
					<Switch
						value={colorScheme === 'dark'}
						onValueChange={() => {
							if (process.env.EXPO_OS === 'ios') {
								Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
							}
							toggleTheme()
						}}
						accessibilityLabel="Toggle dark mode"
					/>
				</View>
			</Section>

			{/* Audio */}
			{streams.length > 1 && (
				<Section title="Audio">
					<StreamSelector
						streams={streams}
						selectedUrl={selectedStream?.url ?? null}
						onSelect={(stream) => selectStream(stream, streams)}
					/>
				</Section>
			)}

			{/* Notifications */}
			{config.features?.notifications !== false && (
				<Section title="Notifications">
					<View style={{ gap: 16 }}>
						{/* Lead time */}
						<View style={{ gap: 8 }}>
							<Text style={{ fontSize: 14, color: theme.mutedForeground }}>
								Notify me before a show starts
							</Text>
							<View style={{ flexDirection: 'row', gap: 8 }}>
								{LEAD_TIME_OPTIONS.map((mins) => (
									<Pressable
										key={mins}
										onPress={() => {
											if (process.env.EXPO_OS === 'ios') {
												Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
											}
											setLeadTime(mins)
										}}
										accessibilityRole="button"
										accessibilityLabel={`${mins} minutes before`}
										accessibilityState={{ selected: leadTimeMinutes === mins }}
										style={{
											flex: 1,
											paddingVertical: 10,
											borderRadius: 8,
											borderCurve: 'continuous',
											backgroundColor: leadTimeMinutes === mins ? theme.primary : theme.secondary,
											borderWidth: 1,
											borderColor: leadTimeMinutes === mins ? theme.primary : theme.border,
											alignItems: 'center',
										}}
									>
										<Text
											style={{
												fontSize: 14,
												fontWeight: '500',
												color: leadTimeMinutes === mins ? theme.primaryForeground : theme.foreground,
											}}
										>
											{mins}m
										</Text>
									</Pressable>
								))}
							</View>
						</View>

						{/* Active notifications */}
						{activeNotifications.length > 0 && (
							<View style={{ gap: 8 }}>
								<Text style={{ fontSize: 13, fontWeight: '600', color: theme.mutedForeground, textTransform: 'uppercase', letterSpacing: 0.5 }}>
									Active ({activeNotifications.length})
								</Text>
								{activeNotifications.map((pref) => (
									<View
										key={`${pref.showSlug}-${pref.dayOfWeek}-${pref.startTime}`}
										style={{
											flexDirection: 'row',
											alignItems: 'center',
											gap: 10,
											padding: 10,
											backgroundColor: theme.secondary,
											borderRadius: 8,
											borderCurve: 'continuous',
										}}
									>
										<Image
											source="sf:bell.fill"
											style={{ width: 16, height: 16, tintColor: theme.primary }}
											accessible={false}
										/>
										<Text style={{ fontSize: 14, color: theme.foreground, flex: 1 }}>
											{pref.showName}
										</Text>
									</View>
								))}
							</View>
						)}

						{activeNotifications.length === 0 && (
							<Text style={{ fontSize: 14, color: theme.mutedForeground }}>
								No show notifications set. Tap a show in the schedule to enable.
							</Text>
						)}
					</View>
				</Section>
			)}

			{/* About */}
			<Section title="About">
				<View style={{ gap: 12 }}>
					<Text style={{ fontSize: 17, fontWeight: '600', color: theme.foreground }}>
						{config.name ?? station?.name ?? 'Station'}
					</Text>
					{config.tagline && (
						<Text style={{ fontSize: 14, color: theme.mutedForeground }}>
							{config.tagline}
						</Text>
					)}
					<Pressable
						onPress={() => WebBrowser.openBrowserAsync('https://broadcake.com')}
						accessibilityRole="link"
						accessibilityLabel="Powered by Broadcake"
						style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}
					>
						<Text style={{ fontSize: 13, color: theme.mutedForeground }}>
							Powered by Broadcake
						</Text>
						<Image
							source="sf:arrow.up.right"
							style={{ width: 10, height: 10, tintColor: theme.mutedForeground }}
							accessible={false}
						/>
					</Pressable>
				</View>
			</Section>
		</ScrollView>
	)
}

function Section({
	title,
	children,
}: {
	title: string
	children: React.ReactNode
}) {
	const { theme } = useTheme()
	return (
		<View style={{ gap: 12 }}>
			<Text
				style={{
					fontSize: 13,
					fontWeight: '600',
					color: theme.foreground,
					textTransform: 'uppercase',
					letterSpacing: 0.5,
				}}
				accessibilityRole="header"
			>
				{title}
			</Text>
			<View
				style={{
					backgroundColor: theme.card,
					borderRadius: 12,
					borderCurve: 'continuous',
					padding: 16,
					borderWidth: 1,
					borderColor: theme.border,
				}}
			>
				{children}
			</View>
		</View>
	)
}
