import * as Haptics from 'expo-haptics'
import type { SlotPresenter } from '@techcake/broadcake-sdk'

/**
 * Format a HH:MM:SS or HH:MM time string to 12-hour format (e.g. "7:00 AM").
 */
export function formatTime(time: string): string {
	const parts = time.split(':')
	let hours = parseInt(parts[0], 10)
	const minutes = parts[1] ?? '00'
	const period = hours >= 12 ? 'PM' : 'AM'
	if (hours === 0) hours = 12
	else if (hours > 12) hours -= 12
	return `${hours}:${minutes} ${period}`
}

/**
 * Format a list of presenters into a comma-separated string.
 */
export function getPresenters(presenters: SlotPresenter[]): string {
	return presenters
		.map((p) => p.name)
		.filter(Boolean)
		.join(', ')
}

/**
 * Trigger haptic feedback on iOS only.
 */
export function triggerHaptic(
	style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Light
): void {
	if (process.env.EXPO_OS === 'ios') {
		Haptics.impactAsync(style)
	}
}
