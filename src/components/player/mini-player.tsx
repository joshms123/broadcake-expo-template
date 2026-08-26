import React from 'react'
import { View, Text, Pressable, ActivityIndicator } from 'react-native'
import * as Haptics from 'expo-haptics'
import { useTheme } from '@/contexts/theme-context'
import { usePlayer } from '@/contexts/player-context'
import type { StationStream, NowPlaying } from '@techcake/broadcake-sdk'
import { AppIcon } from '@/components/common/app-icon'

interface MiniPlayerProps {
	streams: StationStream[]
	nowPlaying: NowPlaying | null | undefined
}

export function MiniPlayer({ streams, nowPlaying }: MiniPlayerProps) {
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
			<View
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
					onPress={handlePlayPause}
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
						<AppIcon
							name={isPlaying ? 'pause.fill' : 'play.fill'}
							size={18}
							color={theme.primaryForeground}
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
			</View>

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
