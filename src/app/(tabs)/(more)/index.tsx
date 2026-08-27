import React from 'react'
import { Host, Icon, List, ListItem, Picker, Switch } from '@expo/ui'
import { useTheme } from '@/contexts/theme-context'
import { useStation } from '@/hooks/use-station'
import { usePlayer } from '@/contexts/player-context'
import { config } from '@/lib/config'
import { appIcon } from '@/components/common/app-icon'
import { openLink } from '@/lib/links'
import { triggerHaptic } from '@/lib/format'

/** `https://anchor.radio/listen` -> `anchor.radio`, for the row's subtitle. */
function hostOf(url: string): string {
	try {
		return new URL(url).host.replace(/^www\./, '')
	} catch {
		return url
	}
}

/**
 * Settings, drawn by the platform.
 *
 * The whole screen is one `List` inside one full-height `Host`, which is both
 * the idiomatic shape for a settings screen and the only one that renders.
 * `List` is SwiftUI's `List` — a scrolling container with no intrinsic height,
 * which fills whatever it is given. Inside `<Host matchContents>` it is given
 * nothing, so it collapsed to zero and this screen showed its About text and
 * nothing else: no theme switch, no website row. `FieldGroup` is SwiftUI's
 * `Form` and would have done the same.
 *
 * So the Host takes `flex: 1` and the List fills it. `Host` extends `ViewProps`,
 * so a real flex is allowed here, unlike the `UniversalStyle` the components
 * inside it accept. `useViewportSizeMeasurement` is the documented alternative
 * if a List ever needs to size itself without a definite parent.
 *
 * There is no `ScrollView`: the List scrolls itself, and nesting one inside the
 * other gives two scrollers fighting over the same gesture.
 */
export default function MoreScreen() {
	const { theme, colorScheme, toggleTheme } = useTheme()
	const { data: station } = useStation()
	const { selectedStream, selectStream } = usePlayer()

	const streams = station?.streams ?? []

	return (
		<Host style={{ flex: 1 }}>
			<List>
				<ListItem
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
								triggerHaptic()
								toggleTheme()
							}}
							label="Dark mode"
						/>
					}
				>
					Dark mode
				</ListItem>

				{/* One stream is not a choice, so the row only exists when there are more. */}
				{streams.length > 1 && (
					<ListItem
						leading={
							<Icon name={appIcon('waveform')} size={20} color={theme.foreground} />
						}
						trailing={
							<Picker
								selectedValue={selectedStream?.url ?? streams[0].url}
								onValueChange={(url) => {
									const stream = streams.find((s) => s.url === url)
									if (!stream) return
									triggerHaptic()
									selectStream(stream)
								}}
								appearance="menu"
							>
								{streams.map((stream, i) => (
									// Position, not url: nothing constrains stream urls to be
									// unique, and two identical ones would collide as keys.
									<Picker.Item
										key={i}
										label={
											stream.bitrate ? `${stream.name} (${stream.bitrate}kbps)` : stream.name
										}
										value={stream.url}
									/>
								))}
							</Picker>
						}
					>
						Stream quality
					</ListItem>
				)}

				{/*
				  The station's own site, where "Powered by Broadcake" used to be.

				  A template that stations clone and ship under their own name should
				  not make them carry someone else's on a screen their listeners see.
				  The address is the station's `listen_url` from the dashboard rather
				  than a field here, so there is one place to change it and it is one
				  they already own. No URL set, no row.
				*/}
				{station?.listen_url && (
					<ListItem
						leading={<Icon name={appIcon('globe')} size={20} color={theme.foreground} />}
						trailing={
							<Icon
								name={appIcon('arrow.up.right')}
								size={12}
								color={theme.mutedForeground}
							/>
						}
						supportingText={hostOf(station.listen_url)}
						onPress={() => openLink(station.listen_url)}
					>
						Website
					</ListItem>
				)}

				{/* The station, as the last row rather than prose above the list --
				    a settings screen ends with what it is about. */}
				<ListItem supportingText={config.tagline}>
					{config.name ?? station?.name ?? 'Station'}
				</ListItem>
			</List>
		</Host>
	)
}
