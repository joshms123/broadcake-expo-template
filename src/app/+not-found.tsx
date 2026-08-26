import { Stack } from 'expo-router'
import { View, Text } from 'react-native'
import { useRouter } from 'expo-router'
import { useTheme } from '@/contexts/theme-context'
import { ActionButton } from '@/components/common/action-button'

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
				<ActionButton
					label="Go Home"
					onPress={() => router.replace('/(tabs)/(listen)')}
				/>
			</View>
		</>
	)
}
