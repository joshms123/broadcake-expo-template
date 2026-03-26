import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import TrackPlayer, { State, usePlaybackState } from 'react-native-track-player'
import AsyncStorage from '@react-native-async-storage/async-storage'
import type { StationStream } from '@techcake/broadcake-sdk'
import { setupPlayer, playStream } from '@/services/player'
import {
	startMetadataListener,
	stopMetadataListener,
	updateLockScreenMetadata,
	type StreamMetadata,
} from '@/services/metadata'
import { STREAM_STORAGE_KEY } from '@/lib/constants'

interface PlayerContextValue {
	isPlaying: boolean
	isBuffering: boolean
	playerReady: boolean
	playerError: string | null
	currentMetadata: StreamMetadata
	selectedStream: StationStream | null
	play: (streams: StationStream[]) => Promise<void>
	pause: () => Promise<void>
	selectStream: (stream: StationStream, streams: StationStream[]) => Promise<void>
}

const PlayerContext = createContext<PlayerContextValue>({
	isPlaying: false,
	isBuffering: false,
	playerReady: false,
	playerError: null,
	currentMetadata: {},
	selectedStream: null,
	play: async () => {},
	pause: async () => {},
	selectStream: async () => {},
})

export function PlayerProvider({ children }: { children: React.ReactNode }) {
	const playbackState = usePlaybackState()
	const [selectedStream, setSelectedStream] = useState<StationStream | null>(null)
	const [currentMetadata, setCurrentMetadata] = useState<StreamMetadata>({})
	const [playerReady, setPlayerReady] = useState(false)
	const [playerError, setPlayerError] = useState<string | null>(null)
	const [streamRestored, setStreamRestored] = useState(false)

	// Setup player with error handling
	useEffect(() => {
		setupPlayer()
			.then(() => setPlayerReady(true))
			.catch((err) => {
				setPlayerError(err instanceof Error ? err.message : 'Failed to initialize audio player')
			})
	}, [])

	// Listen for ICY metadata
	useEffect(() => {
		if (!playerReady) return

		startMetadataListener((meta) => {
			setCurrentMetadata(meta)
			updateLockScreenMetadata({
				title: meta.title ?? 'Live',
				artist: meta.artist,
			})
		})

		return () => stopMetadataListener()
	}, [playerReady])

	// Restore saved stream preference (before play can be called)
	useEffect(() => {
		AsyncStorage.getItem(STREAM_STORAGE_KEY)
			.then((saved) => {
				if (saved) {
					try {
						setSelectedStream(JSON.parse(saved))
					} catch {}
				}
			})
			.finally(() => setStreamRestored(true))
	}, [])

	const isPlaying = playbackState.state === State.Playing
	const isBuffering =
		playbackState.state === State.Buffering ||
		playbackState.state === State.Loading

	const play = useCallback(
		async (streams: StationStream[]) => {
			if (!playerReady || !streamRestored || streams.length === 0) return

			const stream =
				selectedStream ??
				streams.find((s) => s.is_default) ??
				streams[0]

			setSelectedStream(stream)
			AsyncStorage.setItem(STREAM_STORAGE_KEY, JSON.stringify(stream))

			try {
				await playStream(stream.url, {
					title: stream.name,
					artist: 'Live',
				})
				setPlayerError(null)
			} catch (err) {
				setPlayerError(err instanceof Error ? err.message : 'Failed to play stream')
			}
		},
		[playerReady, streamRestored, selectedStream]
	)

	const pause = useCallback(async () => {
		await TrackPlayer.pause()
	}, [])

	const selectStream = useCallback(
		async (stream: StationStream, streams: StationStream[]) => {
			setSelectedStream(stream)
			AsyncStorage.setItem(STREAM_STORAGE_KEY, JSON.stringify(stream))

			if (isPlaying || isBuffering) {
				try {
					await playStream(stream.url, {
						title: stream.name,
						artist: 'Live',
					})
					setPlayerError(null)
				} catch (err) {
					setPlayerError(err instanceof Error ? err.message : 'Failed to switch stream')
				}
			}
		},
		[isPlaying, isBuffering]
	)

	const value = useMemo(
		() => ({
			isPlaying,
			isBuffering,
			playerReady,
			playerError,
			currentMetadata,
			selectedStream,
			play,
			pause,
			selectStream,
		}),
		[isPlaying, isBuffering, playerReady, playerError, currentMetadata, selectedStream, play, pause, selectStream]
	)

	return (
		<PlayerContext value={value}>
			{children}
		</PlayerContext>
	)
}

export function usePlayer(): PlayerContextValue {
	return React.use(PlayerContext)
}
