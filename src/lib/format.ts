import * as Haptics from 'expo-haptics'
import type { ScheduleSlot, SlotPresenter } from '@techcake/broadcake-sdk'

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
 * Reads a slot out as one sentence, for a screen reader.
 *
 * A card shows these facts on four lines, which is right to look at and wrong
 * to listen to: VoiceOver stops on each one, so hearing what is on air took
 * four swipes -- "On Air Now", the show, the presenters, the times. Spoken it
 * is one thing, so the card is one accessibility element and this is what it
 * says.
 *
 * Two details worth keeping:
 *
 * - "to" rather than the en dash the card draws. A dash between two times is
 *   read out as a dash.
 * - `show_name` is nullable. An automation slot has no show, and concatenating
 *   it announced the word "null".
 */
export function slotSentence(slot: ScheduleSlot, lead?: string): string {
	const presenters = spokenList(slot.presenters.map((p) => p.name).filter(Boolean))
	const genres = slot.genres.map((g) => g.name).join(', ')

	return [
		lead && lead + ': ',
		slot.show_name ?? 'Automation',
		presenters && ' with ' + presenters,
		// A full stop, not a comma. Read aloud, "with Dave, Sam, 7:00 AM" is one
		// undifferentiated list -- a screen reader pauses the same length for
		// every comma, so the times sound like another presenter.
		'. ' + formatTime(slot.slot_start) + ' to ' + formatTime(slot.slot_end),
		genres && '. ' + genres,
	]
		.filter(Boolean)
		.join('')
}

/**
 * Joins names the way a person would say them: "Dave and Sam", "Dave, Sam and
 * Ali". For speech only -- `getPresenters` stays comma-separated, because that
 * is what the card should show.
 */
function spokenList(names: string[]): string {
	if (names.length <= 1) return names[0] ?? ''
	return names.slice(0, -1).join(', ') + ' and ' + names[names.length - 1]
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
