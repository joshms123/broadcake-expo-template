import { useState, useEffect, useCallback } from 'react'
import {
	getNotificationPreferences,
	saveNotificationPreference,
	removeNotificationPreference,
	scheduleShowNotification,
	cancelShowNotification,
	getLeadTimeMinutes,
	setLeadTimeMinutes as persistLeadTime,
	requestNotificationPermissions,
	type ShowNotificationPref,
} from '@/lib/notifications'

export function useNotifications() {
	const [preferences, setPreferences] = useState<Record<string, ShowNotificationPref>>({})
	const [leadTimeMinutes, setLeadTimeState] = useState(15)
	const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null)

	useEffect(() => {
		getNotificationPreferences().then(setPreferences)
		getLeadTimeMinutes().then(setLeadTimeState)
	}, [])

	const isShowNotified = useCallback(
		(showSlug: string, dayOfWeek: number, startTime: string): boolean => {
			const key = `${showSlug}-${dayOfWeek}-${startTime}`
			return preferences[key]?.enabled ?? false
		},
		[preferences]
	)

	const toggleShowNotification = useCallback(
		async (showSlug: string, showName: string, dayOfWeek: number, startTime: string) => {
			const key = `${showSlug}-${dayOfWeek}-${startTime}`
			const current = preferences[key]

			if (current?.enabled) {
				// Disable
				await removeNotificationPreference(showSlug, dayOfWeek, startTime)
				await cancelShowNotification(showSlug, dayOfWeek, startTime)
				setPreferences((prev) => {
					const next = { ...prev }
					delete next[key]
					return next
				})
			} else {
				// Enable — request permission first
				const granted = await requestNotificationPermissions()
				setPermissionGranted(granted)
				if (!granted) return

				const pref: ShowNotificationPref = {
					showSlug,
					showName,
					dayOfWeek,
					startTime,
					enabled: true,
				}
				await saveNotificationPreference(pref)
				await scheduleShowNotification(showSlug, showName, dayOfWeek, startTime, leadTimeMinutes)
				setPreferences((prev) => ({ ...prev, [key]: pref }))
			}
		},
		[preferences, leadTimeMinutes]
	)

	const setLeadTime = useCallback(async (minutes: number) => {
		setLeadTimeState(minutes)
		await persistLeadTime(minutes)

		// Reschedule all active notifications with new lead time
		const prefs = await getNotificationPreferences()
		await Promise.all(
			Object.values(prefs)
				.filter((pref) => pref.enabled)
				.map((pref) =>
					scheduleShowNotification(pref.showSlug, pref.showName, pref.dayOfWeek, pref.startTime, minutes)
				)
		)
	}, [])

	return {
		preferences,
		permissionGranted,
		leadTimeMinutes,
		isShowNotified,
		toggleShowNotification,
		setLeadTime,
	}
}
