import { Stack } from 'expo-router/stack'
import { ErrorBoundary } from '@/components/common/error-boundary'

export default function ListenLayout() {
	return (
		<ErrorBoundary>
			<Stack>
				<Stack.Screen
					name="index"
					options={{
						title: 'Listen',
						headerLargeTitle: true,
					}}
				/>
			</Stack>
		</ErrorBoundary>
	)
}
