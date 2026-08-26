import React from 'react'
import { View, Text, ScrollView, Pressable } from 'react-native'
import * as WebBrowser from 'expo-web-browser'
import * as Haptics from 'expo-haptics'
import { Host, Icon, List, ListItem, Picker, Switch } from '@expo/ui'
import { useTheme } from '@/contexts/theme-context'
import { useStation } from '@/hooks/use-station'
import { usePlayer } from '@/contexts/player-context'
import { config } from '@/lib/config'
import { AppIcon, appIcon } from '@/components/common/app-icon'

/**
 * Settings, drawn by the platform.
 *
 * The controls here are `@expo/ui` — real SwiftUI rows on iOS and Jetpack
 * Compose on Android — rather than Views styled to look like them. A settings
 * screen is the case those components exist for, and two things came free with
 * the switch: the rows get the platform's own grouping, separators and press
 * behaviour, and stream quality stopped being a horizontal chip carousel that
 * clipped inside a padded card, which is not how any platform presents a choice
 * between three options.
 *
 * `List` is deliberate here and would be wrong on the schedule: it renders
 * native grouped rows and does not recycle them, so it suits a short fixed set
 * and not a day's worth of programmes.
 */
export default function MoreScreen() {
	const { theme, colorScheme, toggleTheme } = useTheme()
	const { data: station } = useStation()
	const { selectedStream, selectStream } = usePlayer()

	const streams = station?.streams ?? []

	return (
		<ScrollView
			style={{ flex: 1, backgroundColor: theme.background }}
			contentContainerStyle={{ paddingBottom: 48 }}
			contentInsetAdjustmentBehavior="automatic"
		>
			<Host matchContents>
				<List>
					<ListItem
						/* Icon, not AppIcon: this is already inside a Host, and AppIcon
						   brings its own — one Host must not nest in another. */
						leading={
							<Icon
								name={appIcon(colorScheme === 'dark' ? 'moon.fill' : 'sun.max.fill')}
								size={20}
								color={theme.foreground}
							/>
						}
						trailing={
							<Switch
								value={colorScheme === 'dark'}
								onValueChange={() => {
									if (process.env.EXPO_OS === 'ios') {
										Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
									}
									toggleTheme()
								}}
								label="Dark mode"
							/>
						}
					>
						Dark mode
					</ListItem>
				</List>
			</Host>

			{streams.length > 1 && (
				<>
					{/* Outside the Host: a Host wraps a native tree, and a React Native
					    Text is not part of one. Picker carries no label of its own, so
					    the section heading is ours to draw. */}
					<Text
						style={{
							fontSize: 13,
							fontWeight: '600',
							color: theme.mutedForeground,
							textTransform: 'uppercase',
							letterSpacing: 0.5,
							paddingHorizontal: 16,
							paddingBottom: 8,
						}}
						accessibilityRole="header"
					>
						Stream quality
					</Text>
					<Host matchContents>
					<Picker
						selectedValue={selectedStream?.url ?? streams[0].url}
						onValueChange={(url) => {
							const stream = streams.find((s) => s.url === url)
							if (!stream) return
							if (process.env.EXPO_OS === 'ios') {
								Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
							}
							selectStream(stream)
						}}
						appearance="menu"
					>
						{streams.map((stream, i) => (
							<Picker.Item
								// Position, not url: nothing constrains stream urls to be
								// unique, and two identical ones would collide as keys.
								key={i}
								label={
									stream.bitrate ? `${stream.name} (${stream.bitrate}kbps)` : stream.name
								}
								value={stream.url}
							/>
						))}
					</Picker>
					</Host>
				</>
			)}

			{/* Prose and a link rather than controls, so this stays plain React
			    Native — there is no native row type that says it better. */}
			<View style={{ padding: 16, gap: 12 }}>
				<Text
					style={{
						fontSize: 13,
						fontWeight: '600',
						color: theme.mutedForeground,
						textTransform: 'uppercase',
						letterSpacing: 0.5,
					}}
					accessibilityRole="header"
				>
					About
				</Text>
				<Text style={{ fontSize: 17, fontWeight: '600', color: theme.foreground }}>
					{config.name ?? station?.name ?? 'Station'}
				</Text>
				{config.tagline && (
					<Text style={{ fontSize: 14, color: theme.mutedForeground }}>{config.tagline}</Text>
				)}
				<Pressable
					onPress={() => WebBrowser.openBrowserAsync('https://broadcake.com')}
					accessibilityRole="link"
					accessibilityLabel="Powered by Broadcake"
					hitSlop={12}
					style={({ pressed }) => ({
						flexDirection: 'row',
						alignItems: 'center',
						gap: 6,
						marginTop: 4,
						minHeight: 44,
						opacity: pressed ? 0.6 : 1,
					})}
				>
					<Text style={{ fontSize: 13, color: theme.mutedForeground }}>
						Powered by Broadcake
					</Text>
					<AppIcon name="arrow.up.right" size={10} color={theme.mutedForeground} />
				</Pressable>
			</View>
		</ScrollView>
	)
}
