import * as Notifications from 'expo-notifications'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { NOTIFICATION_STORAGE_KEY, NOTIFICATION_LEAD_TIME_KEY, PUSH_TOKEN_KEY } from './constants'

export interface ShowNotificationPref {
	showSlug: string
	showName: string
	dayOfWeek: number
	startTime: string
	enabled: boolean
}

type NotificationPrefs = Record<string, ShowNotificationPref>

// ── Permissions ─────────────────────────────────────────────────────────────

export async function requestNotificationPermissions(): Promise<boolean> {
	const { status: existingStatus } = await Notifications.getPermissionsAsync()
	if (existingStatus === 'granted') return true

	const { status } = await Notifications.requestPermissionsAsync()
	return status === 'granted'
}

// ── Preferences (AsyncStorage) ──────────────────────────────────────────────

function prefKey(showSlug: string, dayOfWeek: number, startTime: string): string {
	return `${showSlug}-${dayOfWeek}-${startTime}`
}

export async function getNotificationPreferences(): Promise<NotificationPrefs> {
	const raw = await AsyncStorage.getItem(NOTIFICATION_STORAGE_KEY)
	if (!raw) return {}
	try {
		return JSON.parse(raw) as NotificationPrefs
	} catch {
		return {}
	}
}

export async function saveNotificationPreference(
	pref: ShowNotificationPref
): Promise<void> {
	const prefs = await getNotificationPreferences()
	const key = prefKey(pref.showSlug, pref.dayOfWeek, pref.startTime)
	prefs[key] = pref
	await AsyncStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(prefs))
}

export async function removeNotificationPreference(
	showSlug: string,
	dayOfWeek: number,
	startTime: string
): Promise<void> {
	const prefs = await getNotificationPreferences()
	delete prefs[prefKey(showSlug, dayOfWeek, startTime)]
	await AsyncStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(prefs))
}

// ── Lead Time ───────────────────────────────────────────────────────────────

export async function getLeadTimeMinutes(): Promise<number> {
	const raw = await AsyncStorage.getItem(NOTIFICATION_LEAD_TIME_KEY)
	return raw ? parseInt(raw, 10) : 15
}

export async function setLeadTimeMinutes(minutes: number): Promise<void> {
	await AsyncStorage.setItem(NOTIFICATION_LEAD_TIME_KEY, String(minutes))
}

// ── Schedule Local Notification ─────────────────────────────────────────────

export async function scheduleShowNotification(
	showSlug: string,
	showName: string,
	dayOfWeek: number,
	startTime: string,
	leadMinutes: number
): Promise<void> {
	const [hours, minutes] = startTime.split(':').map(Number)
	const notifMinute = (hours * 60 + minutes - leadMinutes + 1440) % 1440

	const identifier = prefKey(showSlug, dayOfWeek, startTime)

	// Cancel any existing notification for this slot
	await Notifications.cancelScheduledNotificationAsync(identifier).catch(() => {})

	await Notifications.scheduleNotificationAsync({
		identifier,
		content: {
			title: `${showName} starts in ${leadMinutes} minutes`,
			body: `Tune in now!`,
			sound: 'default',
		},
		trigger: {
			type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
			weekday: dayOfWeek === 7 ? 1 : dayOfWeek + 1, // ISO → JS weekday (1=Sun in expo)
			hour: Math.floor(notifMinute / 60),
			minute: notifMinute % 60,
		},
	})
}

export async function cancelShowNotification(
	showSlug: string,
	dayOfWeek: number,
	startTime: string
): Promise<void> {
	const identifier = prefKey(showSlug, dayOfWeek, startTime)
	await Notifications.cancelScheduledNotificationAsync(identifier).catch(() => {})
}

// ── Push Token (future) ─────────────────────────────────────────────────────

export async function registerForPushNotifications(): Promise<string | null> {
	const granted = await requestNotificationPermissions()
	if (!granted) return null

	try {
		const { data: token } = await Notifications.getExpoPushTokenAsync()
		await AsyncStorage.setItem(PUSH_TOKEN_KEY, token)
		return token
	} catch {
		return null
	}
}

export async function getStoredPushToken(): Promise<string | null> {
	return AsyncStorage.getItem(PUSH_TOKEN_KEY)
}
