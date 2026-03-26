import { Stack } from 'expo-router'
import { View, Text, Pressable } from 'react-native'
import { useRouter } from 'expo-router'
import { useTheme } from '@/contexts/theme-context'

export default function NotFoundScreen() {
	const { theme } = useTheme()
	const router = useRouter()

	return (
		<>
			<Stack.Screen options={{ title: 'Not Found' }} />
			<View
				style={{
					flex: 1,
					alignItems: 'center',
					justifyContent: 'center',
					backgroundColor: theme.background,
					padding: 24,
				}}
			>
				<Text
					style={{
						fontSize: 20,
						fontWeight: '600',
						color: theme.foreground,
						marginBottom: 12,
					}}
				>
					Page not found
				</Text>
				<Pressable
					onPress={() => router.replace('/(tabs)/(listen)')}
					accessibilityRole="button"
					accessibilityLabel="Go to home screen"
					style={{
						paddingHorizontal: 20,
						paddingVertical: 10,
						backgroundColor: theme.primary,
						borderRadius: 8,
						borderCurve: 'continuous',
					}}
				>
					<Text style={{ color: theme.primaryForeground, fontWeight: '500' }}>
						Go Home
					</Text>
				</Pressable>
			</View>
		</>
	)
}
