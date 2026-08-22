import { NativeTabs } from 'expo-router/unstable-native-tabs'
import { useTheme } from '@/contexts/theme-context'

export default function TabLayout() {
	const { theme } = useTheme()

	// NativeTabs takes appearance props directly and its children are Triggers.
	// There is no NativeTabs.Screen and no screenOptions — the route for each tab
	// comes from the Trigger's `name`.
	return (
		<NativeTabs tintColor={theme.primary}>
			<NativeTabs.Trigger name="(listen)">
				<NativeTabs.Trigger.Icon sf="radio" />
				<NativeTabs.Trigger.Label>Listen</NativeTabs.Trigger.Label>
			</NativeTabs.Trigger>

			<NativeTabs.Trigger name="(schedule)">
				<NativeTabs.Trigger.Icon sf="calendar" />
				<NativeTabs.Trigger.Label>Schedule</NativeTabs.Trigger.Label>
			</NativeTabs.Trigger>

			<NativeTabs.Trigger name="(more)">
				<NativeTabs.Trigger.Icon sf="ellipsis" />
				<NativeTabs.Trigger.Label>More</NativeTabs.Trigger.Label>
			</NativeTabs.Trigger>
		</NativeTabs>
	)
}
