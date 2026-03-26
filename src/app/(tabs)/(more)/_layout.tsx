import { Stack } from 'expo-router/stack'
import { ErrorBoundary } from '@/components/common/error-boundary'

export default function MoreLayout() {
	return (
		<ErrorBoundary>
			<Stack>
				<Stack.Screen
					name="index"
					options={{
						title: 'More',
						headerLargeTitle: true,
					}}
				/>
			</Stack>
		</ErrorBoundary>
	)
}
