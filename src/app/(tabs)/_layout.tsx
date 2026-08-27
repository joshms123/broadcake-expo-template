import { NativeTabs } from 'expo-router/unstable-native-tabs'
import { useTheme } from '@/contexts/theme-context'

export default function TabLayout() {
	const { theme } = useTheme()

	// Both `sf` and `md` on every icon. `sf` is iOS-only, and giving it alone
	// left the Android tab bar with labels and no icons at all — the same gap
	// that leaves 20-odd `sf:` glyphs blank elsewhere in the app. `md` names a
	// Material glyph and needs no asset file.
	//
	// NativeTabs takes appearance props directly and its children are Triggers.
	// There is no NativeTabs.Screen and no screenOptions — the route for each tab
	// comes from the Trigger's `name`.
	return (
		<NativeTabs tintColor={theme.primary}>
			{/* The Listen tab manages its own bottom inset. It pins the social row
			    to the bottom of the screen, and that only works if the safe area is
			    a view boundary rather than a scroll inset -- see the SafeAreaView
			    in the screen itself. */}
			<NativeTabs.Trigger name="(listen)" disableAutomaticContentInsets>
				<NativeTabs.Trigger.Icon sf="radio" md="radio" />
				<NativeTabs.Trigger.Label>Listen</NativeTabs.Trigger.Label>
			</NativeTabs.Trigger>

			<NativeTabs.Trigger name="(schedule)">
				<NativeTabs.Trigger.Icon sf="calendar" md="calendar_month" />
				<NativeTabs.Trigger.Label>Schedule</NativeTabs.Trigger.Label>
			</NativeTabs.Trigger>

			<NativeTabs.Trigger name="(more)">
				<NativeTabs.Trigger.Icon sf="ellipsis" md="more_horiz" />
				<NativeTabs.Trigger.Label>More</NativeTabs.Trigger.Label>
			</NativeTabs.Trigger>
		</NativeTabs>
	)
}
