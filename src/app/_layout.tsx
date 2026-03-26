import { LogBox } from 'react-native'
import { Stack } from 'expo-router/stack'

LogBox.ignoreAllLogs()
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { queryClient, asyncStoragePersister } from '@/lib/query-client'
import { ThemeProvider } from '@/contexts/theme-context'
import { PlayerProvider } from '@/contexts/player-context'

export default function RootLayout() {
	return (
		<PersistQueryClientProvider
			client={queryClient}
			persistOptions={{ persister: asyncStoragePersister }}
		>
			<ThemeProvider>
				<PlayerProvider>
					<Stack>
						<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
						<Stack.Screen name="+not-found" />
					</Stack>
				</PlayerProvider>
			</ThemeProvider>
		</PersistQueryClientProvider>
	)
}
