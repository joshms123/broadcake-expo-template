import TrackPlayer, { Event } from 'react-native-track-player'

export interface StreamMetadata {
	title?: string
	artist?: string
}

type MetadataCallback = (metadata: StreamMetadata) => void

let listener: ReturnType<typeof TrackPlayer.addEventListener> | null = null

/**
 * Start listening for ICY metadata from the audio stream.
 * Calls the callback with parsed title/artist whenever new metadata arrives.
 */
export function startMetadataListener(callback: MetadataCallback): void {
	stopMetadataListener()

	listener = TrackPlayer.addEventListener(
		Event.PlaybackMetadataReceived,
		(event) => {
			const raw = (event as Record<string, unknown>).title as string | undefined
			if (!raw) return

			// ICY StreamTitle is often "Artist - Title" or just a title
			const parts = raw.split(' - ')
			if (parts.length >= 2) {
				callback({
					artist: parts[0].trim(),
					title: parts.slice(1).join(' - ').trim(),
				})
			} else {
				callback({ title: raw.trim() })
			}
		}
	)
}

/**
 * Stop listening for ICY metadata.
 */
export function stopMetadataListener(): void {
	if (listener) {
		listener.remove()
		listener = null
	}
}

/**
 * Update the lock screen / notification center metadata.
 */
export async function updateLockScreenMetadata(meta: {
	title: string
	artist?: string
	artwork?: string
}): Promise<void> {
	await TrackPlayer.updateNowPlayingMetadata({
		title: meta.title,
		artist: meta.artist ?? '',
		artwork: meta.artwork,
	})
}
