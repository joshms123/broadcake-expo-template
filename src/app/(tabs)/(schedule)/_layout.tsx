import { Stack } from 'expo-router/stack'
import { ErrorBoundary } from '@/components/common/error-boundary'

export default function ScheduleLayout() {
	return (
		<ErrorBoundary>
			<Stack>
				<Stack.Screen
					name="index"
					options={{
						title: 'Schedule',
						headerLargeTitle: true,
					}}
				/>
			</Stack>
		</ErrorBoundary>
	)
}
