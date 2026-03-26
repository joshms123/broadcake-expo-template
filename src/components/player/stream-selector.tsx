import React from 'react'
import { View, Text, Pressable, ScrollView } from 'react-native'
import { useTheme } from '@/contexts/theme-context'
import { triggerHaptic } from '@/lib/format'
import type { StationStream } from '@techcake/broadcake-sdk'

interface StreamSelectorProps {
	streams: StationStream[]
	selectedUrl: string | null
	onSelect: (stream: StationStream) => void
}

export function StreamSelector({ streams, selectedUrl, onSelect }: StreamSelectorProps) {
	const { theme } = useTheme()

	if (streams.length <= 1) return null

	return (
		<View style={{ gap: 8 }}>
			<Text
				style={{ fontSize: 13, fontWeight: '600', color: theme.mutedForeground }}
				accessibilityRole="header"
			>
				Stream Quality
			</Text>
			<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
				{streams.map((stream) => {
					const isSelected = stream.url === selectedUrl
					const label = stream.bitrate
						? `${stream.name} (${stream.bitrate}kbps)`
						: stream.name

					return (
						<Pressable
							key={stream.url}
							onPress={() => {
								triggerHaptic()
								onSelect(stream)
							}}
							accessibilityRole="button"
							accessibilityLabel={`Select ${label} stream`}
							accessibilityState={{ selected: isSelected }}
							style={{
								paddingHorizontal: 14,
								paddingVertical: 8,
								borderRadius: 8,
								borderCurve: 'continuous',
								backgroundColor: isSelected ? theme.primary : theme.secondary,
								borderWidth: 1,
								borderColor: isSelected ? theme.primary : theme.border,
							}}
						>
							<Text
								style={{
									fontSize: 13,
									fontWeight: '500',
									color: isSelected ? theme.primaryForeground : theme.foreground,
								}}
							>
								{label}
							</Text>
						</Pressable>
					)
				})}
			</ScrollView>
		</View>
	)
}
