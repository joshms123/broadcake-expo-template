export const queryKeys = {
	station: () => ['station'] as const,
	schedule: (date: string) => ['schedule', date] as const,
	nowPlaying: () => ['now-playing'] as const,
	show: (slug: string) => ['show', slug] as const,
	showSchedule: (slug: string) => ['show-schedule', slug] as const,
	presenter: (slug: string) => ['presenter', slug] as const,
	form: (slug: string) => ['form', slug] as const,
}
