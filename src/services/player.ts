import { setAudioModeAsync, type AudioMetadata, type AudioPlayer } from 'expo-audio'

/**
 * What the lock screen and the mini player are told about the stream.
 *
 * This used to be scraped out of the stream itself: react-native-track-player
 * emitted ICY tags and the app split "Artist - Title" out of them. expo-audio
 * has no equivalent, and losing it costs less than it sounds — the tags only
 * ever existed for stations whose encoder sends them, and they never reached
 * the lock screen anyway, which showed the stream's quality name instead. The
 * station's own schedule knows what is on, for every station, so that is where
 * this comes from now.
 */
export interface StreamMetadata {
	title?: string
	artist?: string
	artwork?: string
}

/**
 * Put the app in the mode a radio station needs.
 *
 * `shouldPlayInBackground` is what keeps audio alive behind the lock screen,
 * and `doNotMix` is required rather than preferred: expo-audio's own types say
 * the lock screen controls only work in that mode. It also means the app takes
 * audio focus properly, so starting another player stops this one instead of
 * both talking at once — which the previous setup never did, because it never
 * asked for focus at all.
 */
export async function configureAudioSession(): Promise<void> {
	await setAudioModeAsync({
		playsInSilentMode: true,
		shouldPlayInBackground: true,
		interruptionMode: 'doNotMix',
	})
}

/** Everything the lock screen shows, in the shape expo-audio wants. */
function toAudioMetadata(metadata: StreamMetadata): AudioMetadata {
	return {
		title: metadata.title,
		artist: metadata.artist,
		artworkUrl: metadata.artwork,
	}
}

/**
 * Point the player at a stream and start it.
 *
 * `replace` swaps the source outright, which is what rejoining a live broadcast
 * needs — resuming a paused live stream plays back the buffer it stopped on and
 * stays behind by however long the pause lasted.
 *
 * There is nothing to register and no handlers to attach. The lock screen,
 * notification, headset and car controls drive this player natively, which is
 * the whole reason for the move: the previous library needed a playback service
 * registered at the entry point, and when that registration was missing the
 * buttons still appeared and simply did nothing.
 */
export function playStream(
	player: AudioPlayer,
	url: string,
	metadata: StreamMetadata
): void {
	player.replace({ uri: url })
	player.setActiveForLockScreen(true, toAudioMetadata(metadata), {
		// Hides the duration and scrub bar and disables seeking. A live stream
		// has no length to scrub through, and offering it invites a control that
		// cannot work.
		isLiveStream: true,
	})
	player.play()
}

/** Update what the lock screen says without disturbing playback. */
export function updateLockScreenMetadata(
	player: AudioPlayer,
	metadata: StreamMetadata
): void {
	player.updateLockScreenMetadata(toAudioMetadata(metadata))
}

/** Stop, and take the app off the lock screen with it. */
export function stopStream(player: AudioPlayer): void {
	player.pause()
	player.setActiveForLockScreen(false)
}
