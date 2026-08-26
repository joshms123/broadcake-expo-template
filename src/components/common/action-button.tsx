import React from 'react'
import { Button, Host, Text } from '@expo/ui'
import { useTheme } from '@/contexts/theme-context'

interface ActionButtonProps {
	label: string
	onPress: () => void
}

/**
 * The app's one filled button, drawn by the platform.
 *
 * A native `Button` brings the press feedback and the accessibility traits that
 * a `Pressable` styled to look like a button only approximates — the visual
 * review's "no pressed states" was this.
 *
 * `variant="text"` rather than `"filled"` is deliberate. A filled button takes
 * the platform's accent, and a station's brand colour is configurable
 * (`theme.light.primary` in `broadcake.config.ts`), so the accent would quietly
 * throw it away. Tinting a prominent button needs SwiftUI's `tint`, which lives
 * in the iOS-only modifier package and would force a `.ios.tsx` / `.android.tsx`
 * split. A plain button with a background does the same job from one file:
 * `style.backgroundColor` maps to a background modifier on both platforms.
 *
 * The label doubles as the accessible name, so there is nothing to keep in sync.
 *
 * Not used by `ErrorBoundary`. That renders when something has already failed,
 * and the last fallback should not depend on the native layer.
 */
export function ActionButton({ label, onPress }: ActionButtonProps) {
	const { theme } = useTheme()

	return (
		<Host matchContents>
			<Button
				variant="text"
				onPress={onPress}
				style={{
					backgroundColor: theme.primary,
					borderRadius: 8,
					paddingHorizontal: 20,
					paddingVertical: 10,
				}}
			>
				<Text textStyle={{ color: theme.primaryForeground, fontWeight: '500' }}>
					{label}
				</Text>
			</Button>
		</Host>
	)
}
