import React from 'react'
import { View, Text, Pressable, ActivityIndicator } from 'react-native'
import { Image } from 'expo-image'
import * as Haptics from 'expo-haptics'
import { useTheme } from '@/contexts/theme-context'
import { usePlayer } from '@/contexts/player-context'
import type { StationStream, NowPlaying } from '@techcake/broadcake-sdk'

interface MiniPlayerProps {
	streams: StationStream[]
	nowPlaying: NowPlaying | null | undefined
	onExpand: () => void
}

export function MiniPlayer({ streams, nowPlaying, onExpand }: MiniPlayerProps) {
	const { theme, colorScheme } = useTheme()
	const { isPlaying, isBuffering, playerReady, playerError, currentMetadata, play, pause } = usePlayer()

	if (streams.length === 0) return null

	const showName = nowPlaying?.now?.show_name ?? 'Live'
	const trackTitle = currentMetadata.title
		? currentMetadata.artist
			? `${currentMetadata.artist} – ${currentMetadata.title}`
			: currentMetadata.title
		: null

	const handlePlayPause = async () => {
		if (process.env.EXPO_OS === 'ios') {
			Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
		}
		if (isPlaying) {
			await pause()
		} else {
			await play(streams)
		}
	}

	return (
		<View style={{ gap: 6 }}>
			<Pressable
				onPress={onExpand}
				accessibilityRole="button"
				accessibilityLabel={`Now playing: ${showName}. ${trackTitle ?? ''} Tap to expand player`}
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					gap: 12,
					padding: 12,
					backgroundColor: theme.card,
					borderRadius: 12,
					borderCurve: 'continuous',
					borderWidth: 1,
					borderColor: theme.border,
					boxShadow: colorScheme === 'dark'
						? '0 2px 8px rgba(0,0,0,0.4)'
						: '0 2px 8px rgba(0,0,0,0.08)',
				}}
			>
				<Pressable
					onPress={(e) => {
						e.stopPropagation?.()
						handlePlayPause()
					}}
					disabled={!playerReady}
					accessibilityRole="button"
					accessibilityLabel={isPlaying ? 'Pause' : 'Play'}
					accessibilityState={{ disabled: !playerReady }}
					hitSlop={8}
					style={{
						width: 44,
						height: 44,
						borderRadius: 22,
						backgroundColor: playerReady ? theme.primary : theme.muted,
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					{isBuffering ? (
						<ActivityIndicator size="small" color={theme.primaryForeground} />
					) : (
						<Image
							source={isPlaying ? 'sf:pause.fill' : 'sf:play.fill'}
							style={{ width: 18, height: 18, tintColor: theme.primaryForeground }}
							accessible={false}
						/>
					)}
				</Pressable>

				<View style={{ flex: 1, gap: 2 }}>
					<Text
						numberOfLines={1}
						style={{ fontSize: 15, fontWeight: '600', color: theme.foreground }}
					>
						{showName}
					</Text>
					{trackTitle && (
						<Text
							numberOfLines={1}
							style={{ fontSize: 13, color: theme.mutedForeground }}
						>
							{trackTitle}
						</Text>
					)}
				</View>

				<Image
					source="sf:chevron.up"
					style={{ width: 14, height: 14, tintColor: theme.mutedForeground }}
					accessible={false}
				/>
			</Pressable>

			{playerError && (
				<Text
					style={{ fontSize: 13, color: theme.dangerText, paddingHorizontal: 4 }}
					accessibilityRole="alert"
				>
					{playerError}
				</Text>
			)}
		</View>
	)
}
