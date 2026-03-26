import TrackPlayer, {
	AppKilledPlaybackBehavior,
	Capability,
	Event,
} from 'react-native-track-player'

let isSetup = false

export async function setupPlayer(): Promise<void> {
	if (isSetup) return

	await TrackPlayer.setupPlayer()
	await TrackPlayer.updateOptions({
		capabilities: [Capability.Play, Capability.Pause, Capability.Stop],
		compactCapabilities: [Capability.Play, Capability.Pause],
		android: {
			appKilledPlaybackBehavior: AppKilledPlaybackBehavior.ContinuePlayback,
		},
	})

	isSetup = true
}

export async function playStream(
	url: string,
	metadata: { title: string; artist?: string; artwork?: string }
): Promise<void> {
	await TrackPlayer.reset()
	await TrackPlayer.add({
		url,
		title: metadata.title,
		artist: metadata.artist ?? '',
		artwork: metadata.artwork,
		isLiveStream: true,
	})
	await TrackPlayer.play()
}

export async function playbackService() {
	TrackPlayer.addEventListener(Event.RemotePlay, () => TrackPlayer.play())
	TrackPlayer.addEventListener(Event.RemotePause, () => TrackPlayer.pause())
	TrackPlayer.addEventListener(Event.RemoteStop, () => TrackPlayer.stop())
}
