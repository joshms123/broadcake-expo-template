import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { useColorScheme as useSystemColorScheme, Appearance } from 'react-native'
import { ThemeProvider as NavThemeProvider, DefaultTheme, DarkTheme } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { lightTheme, darkTheme, type Theme } from '@/lib/theme'
import { THEME_STORAGE_KEY } from '@/lib/constants'

type ColorScheme = 'light' | 'dark'

interface ThemeContextValue {
	theme: Theme
	colorScheme: ColorScheme
	toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue>({
	theme: lightTheme,
	colorScheme: 'light',
	toggleTheme: () => {},
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const systemScheme = useSystemColorScheme()
	const [manualOverride, setManualOverride] = useState<ColorScheme | null>(null)
	const [loaded, setLoaded] = useState(false)

	useEffect(() => {
		AsyncStorage.getItem(THEME_STORAGE_KEY).then((stored) => {
			if (stored === 'light' || stored === 'dark') {
				setManualOverride(stored)
				Appearance.setColorScheme(stored)
			}
			setLoaded(true)
		})
	}, [])

	const colorScheme: ColorScheme =
		manualOverride ?? (systemScheme === 'dark' ? 'dark' : 'light')

	const theme = colorScheme === 'dark' ? darkTheme : lightTheme

	const toggleTheme = useCallback(() => {
		const next: ColorScheme = colorScheme === 'dark' ? 'light' : 'dark'
		setManualOverride(next)
		Appearance.setColorScheme(next)
		AsyncStorage.setItem(THEME_STORAGE_KEY, next)
	}, [colorScheme])

	const value = useMemo(
		() => ({ theme, colorScheme, toggleTheme }),
		[theme, colorScheme, toggleTheme]
	)

	const navTheme = colorScheme === 'dark' ? DarkTheme : DefaultTheme

	return (
		<ThemeContext value={value}>
			<NavThemeProvider value={navTheme}>
				{children}
			</NavThemeProvider>
		</ThemeContext>
	)
}

export function useTheme(): ThemeContextValue {
	return React.use(ThemeContext)
}
