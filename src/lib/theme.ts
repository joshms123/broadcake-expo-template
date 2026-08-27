import { config } from './config'

export interface Theme {
	background: string
	foreground: string
	card: string
	cardForeground: string
	primary: string
	primaryForeground: string
	secondary: string
	secondaryForeground: string
	muted: string
	mutedForeground: string
	accent: string
	accentForeground: string
	destructive: string
	destructiveForeground: string
	border: string
	input: string
	ring: string
	successBg: string
	successText: string
	warningBg: string
	warningText: string
	dangerBg: string
	dangerText: string
	infoBg: string
	infoText: string
	shadowColor: string
}

const baseLightTheme: Theme = {
	background: '#f8fafc',
	foreground: '#090911',
	card: '#ffffff',
	cardForeground: '#090911',
	primary: '#0f172b',
	primaryForeground: '#f8fafc',
	secondary: '#f1f5f9',
	secondaryForeground: '#0f172b',
	muted: '#f1f5f9',
	mutedForeground: '#6b7380',
	accent: '#f1f5f9',
	accentForeground: '#0f172b',
	destructive: '#e7000b',
	destructiveForeground: '#e7000b',
	border: '#e2e8f0',
	input: '#e2e8f0',
	ring: '#0f172b',
	successBg: 'rgba(34, 197, 94, 0.12)',
	successText: '#16a34a',
	warningBg: 'rgba(245, 158, 11, 0.12)',
	warningText: '#d97706',
	dangerBg: 'rgba(239, 68, 68, 0.12)',
	dangerText: '#dc2626',
	infoBg: 'rgba(99, 102, 241, 0.12)',
	infoText: '#4f46e5',
	shadowColor: 'rgba(0, 0, 0, 0.08)',
}

const baseDarkTheme: Theme = {
	background: '#090911',
	foreground: '#f8fafc',
	card: '#141726',
	cardForeground: '#f8fafc',
	primary: '#f8fafc',
	primaryForeground: '#0f172b',
	secondary: '#1b2532',
	secondaryForeground: '#f8fafc',
	muted: '#1b2532',
	mutedForeground: '#9aa0a9',
	accent: '#1b2532',
	accentForeground: '#f8fafc',
	destructive: '#82181a',
	destructiveForeground: '#fb2c36',
	border: '#1b2532',
	input: '#1b2532',
	ring: '#cfd3d7',
	successBg: 'rgba(34, 197, 94, 0.2)',
	successText: '#86efac',
	warningBg: 'rgba(245, 158, 11, 0.2)',
	warningText: '#fbbf24',
	dangerBg: 'rgba(239, 68, 68, 0.2)',
	dangerText: '#fca5a5',
	infoBg: 'rgba(99, 102, 241, 0.2)',
	infoText: '#a5b4fc',
	shadowColor: 'rgba(0, 0, 0, 0.4)',
}

/**
 * A theme colour at partial opacity, for glows and scrims.
 *
 * The alternative is a second hardcoded rgba() beside every token, which is how
 * the schedule ended up glowing indigo on a green station: the border followed
 * the theme and the glow behind it did not.
 */
export function withAlpha(hex: string, alpha: number): string {
	const m = /^#([0-9a-f]{6})$/i.exec(hex)
	if (!m) return hex
	const n = parseInt(m[1], 16)
	return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`
}

// Apply config theme overrides
export const lightTheme: Theme = {
	...baseLightTheme,
	...(config.theme?.light?.primary ? { primary: config.theme.light.primary } : {}),
}

export const darkTheme: Theme = {
	...baseDarkTheme,
	...(config.theme?.dark?.primary ? { primary: config.theme.dark.primary } : {}),
}
