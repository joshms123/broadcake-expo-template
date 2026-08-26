import React from 'react'
import { Pressable, ActivityIndicator } from 'react-native'
import type { StationStream } from '@techcake/broadcake-sdk'
import { useTheme } from '@/contexts/theme-context'
import { usePlayer } from '@/contexts/player-context'
import { triggerHaptic } from '@/lib/format'
import { AppIcon } from '@/components/common/app-icon'

interface PlayButtonProps {
	streams: StationStream[]
	size?: number
}

/**
 * Play/pause, on its own.
 *
 * This was the left-hand side of a `MiniPlayer` card that also restated what
 * was on air — directly above a card that said the same thing again. The
 * control moved into that card; the duplicate text did not come with it.
 */
export function PlayButton({ streams, size = 44 }: PlayButtonProps) {
	const { theme } = useTheme()
	const { isPlaying, isBuffering, playerReady, play, pause } = usePlayer()

	if (streams.length === 0) return null

	return (
		<Pressable
			onPress={() => {
				triggerHaptic()
				if (isPlaying) pause()
				else play(streams)
			}}
			disabled={!playerReady}
			accessibilityRole="button"
			accessibilityLabel={isPlaying ? 'Pause' : 'Play'}
			accessibilityState={{ disabled: !playerReady, busy: isBuffering }}
			hitSlop={8}
			style={({ pressed }) => ({
				width: size,
				height: size,
				borderRadius: size / 2,
				backgroundColor: playerReady ? theme.primary : theme.muted,
				alignItems: 'center',
				justifyContent: 'center',
				opacity: pressed ? 0.75 : 1,
			})}
		>
			{isBuffering ? (
				<ActivityIndicator size="small" color={theme.primaryForeground} />
			) : (
				<AppIcon
					name={isPlaying ? 'pause.fill' : 'play.fill'}
					size={Math.round(size * 0.41)}
					color={theme.primaryForeground}
				/>
			)}
		</Pressable>
	)
}
