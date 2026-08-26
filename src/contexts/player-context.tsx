import React, { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio'
import AsyncStorage from '@react-native-async-storage/async-storage'
import type { StationStream } from '@techcake/broadcake-sdk'
import {
	configureAudioSession,
	playStream,
	stopStream,
	updateLockScreenMetadata,
	type StreamMetadata,
} from '@/services/player'
import { useNowPlaying } from '@/hooks/use-now-playing'
import { STREAM_STORAGE_KEY } from '@/lib/constants'

interface PlayerContextValue {
	isPlaying: boolean
	isBuffering: boolean
	playerReady: boolean
	playerError: string | null
	currentMetadata: StreamMetadata
	selectedStream: StationStream | null
	play: (streams: StationStream[]) => void
	pause: () => void
	selectStream: (stream: StationStream) => void
}

const PlayerContext = createContext<PlayerContextValue>({
	isPlaying: false,
	isBuffering: false,
	playerReady: false,
	playerError: null,
	currentMetadata: {},
	selectedStream: null,
	play: () => {},
	pause: () => {},
	selectStream: () => {},
})

export function PlayerProvider({ children }: { children: React.ReactNode }) {
	// One player for the app's life. Sources are swapped with replace() rather
	// than by rebuilding it, so switching stream quality does not tear down the
	// lock-screen session.
	const player = useAudioPlayer(null)
	const status = useAudioPlayerStatus(player)

	const [selectedStream, setSelectedStream] = useState<StationStream | null>(null)
	const [playerReady, setPlayerReady] = useState(false)
	const [playerError, setPlayerError] = useState<string | null>(null)
	const [streamRestored, setStreamRestored] = useState(false)

	// What is actually on air, from the station's own schedule rather than from
	// tags in the stream. Every station has this; not every station's encoder
	// sends ICY.
	const { data: nowPlaying } = useNowPlaying()
	const currentMetadata = useMemo<StreamMetadata>(
		() => ({
			title: nowPlaying?.now?.show_name ?? selectedStream?.name,
			artist: nowPlaying?.now?.presenters?.map((p) => p.name).join(', ') || 'Live',
		}),
		[nowPlaying, selectedStream]
	)

	const isPlaying = status.playing
	const isBuffering = status.isBuffering

	useEffect(() => {
		configureAudioSession()
			.then(() => setPlayerReady(true))
			.catch((err) =>
				setPlayerError(err instanceof Error ? err.message : 'Could not start audio')
			)
	}, [])

	useEffect(() => {
		AsyncStorage.getItem(STREAM_STORAGE_KEY)
			.then((raw) => {
				if (raw) {
					try {
						setSelectedStream(JSON.parse(raw))
					} catch {
						// A stream that will not parse is one the user never picked.
					}
				}
			})
			.finally(() => setStreamRestored(true))
	}, [])

	// Keep the lock screen current as the schedule moves on, but only while
	// something is playing — there is no lock-screen session otherwise.
	const lastPushed = useRef<string>('')
	useEffect(() => {
		if (!isPlaying) return
		const key = `${currentMetadata.title}|${currentMetadata.artist}`
		if (key === lastPushed.current) return
		lastPushed.current = key
		updateLockScreenMetadata(player, currentMetadata)
	}, [isPlaying, currentMetadata, player])

	const play = useCallback(
		(streams: StationStream[]) => {
			if (!playerReady || !streamRestored || streams.length === 0) return

			const stream = selectedStream ?? streams.find((s) => s.is_default) ?? streams[0]
			setSelectedStream(stream)
			AsyncStorage.setItem(STREAM_STORAGE_KEY, JSON.stringify(stream)).catch(() => {})

			try {
				playStream(player, stream.url, currentMetadata)
				setPlayerError(null)
			} catch (err) {
				setPlayerError(err instanceof Error ? err.message : 'Could not play this stream')
			}
		},
		[player, playerReady, streamRestored, selectedStream, currentMetadata]
	)

	const pause = useCallback(() => {
		stopStream(player)
	}, [player])

	const selectStream = useCallback(
		(stream: StationStream) => {
			setSelectedStream(stream)
			AsyncStorage.setItem(STREAM_STORAGE_KEY, JSON.stringify(stream)).catch(() => {})

			if (!isPlaying && !isBuffering) return
			try {
				playStream(player, stream.url, currentMetadata)
				setPlayerError(null)
			} catch (err) {
				setPlayerError(err instanceof Error ? err.message : 'Could not switch stream')
			}
		},
		[player, isPlaying, isBuffering, currentMetadata]
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
		[
			isPlaying,
			isBuffering,
			playerReady,
			playerError,
			currentMetadata,
			selectedStream,
			play,
			pause,
			selectStream,
		]
	)

	return <PlayerContext value={value}>{children}</PlayerContext>
}

export function usePlayer(): PlayerContextValue {
	return React.use(PlayerContext)
}
