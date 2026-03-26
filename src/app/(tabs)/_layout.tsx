import { NativeTabs } from 'expo-router/unstable-native-tabs'
import { useTheme } from '@/contexts/theme-context'

export default function TabLayout() {
	const { theme } = useTheme()

	return (
		<NativeTabs
			screenOptions={{
				headerShown: false,
				tabBarActiveTintColor: theme.primary,
			}}
		>
			<NativeTabs.Screen name="(listen)" />
			<NativeTabs.Trigger name="(listen)">
				<NativeTabs.Trigger.Icon sf="radio" />
				<NativeTabs.Trigger.Label>Listen</NativeTabs.Trigger.Label>
			</NativeTabs.Trigger>

			<NativeTabs.Screen name="(schedule)" />
			<NativeTabs.Trigger name="(schedule)">
				<NativeTabs.Trigger.Icon sf="calendar" />
				<NativeTabs.Trigger.Label>Schedule</NativeTabs.Trigger.Label>
			</NativeTabs.Trigger>

			<NativeTabs.Screen name="(more)" />
			<NativeTabs.Trigger name="(more)">
				<NativeTabs.Trigger.Icon sf="ellipsis" />
				<NativeTabs.Trigger.Label>More</NativeTabs.Trigger.Label>
			</NativeTabs.Trigger>
		</NativeTabs>
	)
}
