import React from 'react'
import { View, Text, Pressable, ActivityIndicator, Modal } from 'react-native'
import { Image } from 'expo-image'
import * as Haptics from 'expo-haptics'
import { useTheme } from '@/contexts/theme-context'
import { usePlayer } from '@/contexts/player-context'
import { StreamSelector } from './stream-selector'
import { getPresenters } from '@/lib/format'
import type { StationStream, NowPlaying } from '@techcake/broadcake-sdk'

interface FullPlayerProps {
	visible: boolean
	onClose: () => void
	streams: StationStream[]
	nowPlaying: NowPlaying | null | undefined
	stationName: string
}

export function FullPlayer({
	visible,
	onClose,
	streams,
	nowPlaying,
	stationName,
}: FullPlayerProps) {
	const { theme, colorScheme } = useTheme()
	const { isPlaying, isBuffering, currentMetadata, selectedStream, play, pause, selectStream } =
		usePlayer()

	const showName = nowPlaying?.now?.show_name ?? 'Live'
	const presenters = nowPlaying?.now?.presenters
		? getPresenters(nowPlaying.now.presenters)
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
		<Modal
			visible={visible}
			animationType="slide"
			presentationStyle="formSheet"
			onRequestClose={onClose}
		>
			<View
				style={{
					flex: 1,
					backgroundColor: theme.background,
					padding: 24,
					paddingTop: 16,
				}}
			>
				{/* Grab handle */}
				<View style={{ alignItems: 'center', paddingBottom: 24 }}>
					<Pressable
						onPress={onClose}
						accessibilityRole="button"
						accessibilityLabel="Close player"
						hitSlop={12}
					>
						<View
							style={{
								width: 36,
								height: 5,
								borderRadius: 3,
								backgroundColor: theme.muted,
							}}
						/>
					</Pressable>
				</View>

				{/* Station name */}
				<Text
					style={{
						fontSize: 13,
						fontWeight: '500',
						color: theme.mutedForeground,
						textAlign: 'center',
						textTransform: 'uppercase',
						letterSpacing: 1,
						marginBottom: 24,
					}}
				>
					{stationName}
				</Text>

				{/* Show info */}
				<View style={{ alignItems: 'center', gap: 8, marginBottom: 32 }}>
					<Text
						style={{
							fontSize: 24,
							fontWeight: '700',
							color: theme.foreground,
							textAlign: 'center',
						}}
					>
						{showName}
					</Text>
					{presenters && (
						<Text
							style={{
								fontSize: 16,
								color: theme.mutedForeground,
								textAlign: 'center',
							}}
						>
							{presenters}
						</Text>
					)}
				</View>

				{/* Track metadata from ICY */}
				{currentMetadata.title && (
					<View
						style={{
							alignItems: 'center',
							gap: 4,
							marginBottom: 32,
							paddingHorizontal: 16,
							paddingVertical: 12,
							backgroundColor: theme.secondary,
							borderRadius: 12,
							borderCurve: 'continuous',
						}}
					>
						<Image
							source="sf:music.note"
							style={{ width: 14, height: 14, tintColor: theme.mutedForeground }}
							accessible={false}
						/>
						<Text
							style={{
								fontSize: 14,
								fontWeight: '500',
								color: theme.foreground,
								textAlign: 'center',
							}}
							numberOfLines={2}
						>
							{currentMetadata.artist
								? `${currentMetadata.artist} – ${currentMetadata.title}`
								: currentMetadata.title}
						</Text>
					</View>
				)}

				{/* Play/Pause button */}
				<View style={{ alignItems: 'center', marginBottom: 32 }}>
					<Pressable
						onPress={handlePlayPause}
						accessibilityRole="button"
						accessibilityLabel={isPlaying ? 'Pause' : 'Play'}
						style={{
							width: 72,
							height: 72,
							borderRadius: 36,
							backgroundColor: theme.primary,
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						{isBuffering ? (
							<ActivityIndicator size="large" color={theme.primaryForeground} />
						) : (
							<Image
								source={isPlaying ? 'sf:pause.fill' : 'sf:play.fill'}
								style={{
									width: 28,
									height: 28,
									tintColor: theme.primaryForeground,
								}}
								accessible={false}
							/>
						)}
					</Pressable>
				</View>

				{/* Stream selector */}
				<StreamSelector
					streams={streams}
					selectedUrl={selectedStream?.url ?? null}
					onSelect={(stream) => selectStream(stream, streams)}
				/>
			</View>
		</Modal>
	)
}
