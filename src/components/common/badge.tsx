import React from 'react'
import { View, Text, type ViewStyle } from 'react-native'
import { useTheme } from '@/contexts/theme-context'

type BadgeVariant = 'default' | 'success' | 'warning' | 'destructive' | 'muted'

interface BadgeProps {
	label: string
	variant?: BadgeVariant
	size?: 'sm' | 'md'
	style?: ViewStyle
}

export function Badge({ label, variant = 'default', size = 'sm', style }: BadgeProps) {
	const { theme } = useTheme()

	const bgColors: Record<BadgeVariant, string> = {
		default: theme.infoBg,
		success: theme.successBg,
		warning: theme.warningBg,
		destructive: theme.dangerBg,
		muted: theme.muted,
	}

	const textColors: Record<BadgeVariant, string> = {
		default: theme.infoText,
		success: theme.successText,
		warning: theme.warningText,
		destructive: theme.dangerText,
		muted: theme.mutedForeground,
	}

	const paddingH = size === 'sm' ? 8 : 10
	const fontSize = size === 'sm' ? 11 : 13

	return (
		<View
			style={[
				{
					backgroundColor: bgColors[variant],
					paddingHorizontal: paddingH,
					paddingVertical: 2,
					borderRadius: 6,
					borderCurve: 'continuous',
					alignSelf: 'flex-start',
				},
				style,
			]}
		>
			<Text style={{ color: textColors[variant], fontSize, fontWeight: '500' }}>
				{label}
			</Text>
		</View>
	)
}
