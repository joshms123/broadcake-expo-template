import React from 'react'
import { View, Text } from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'
import { useTheme } from '@/contexts/theme-context'
import { AppIcon, type AppIconName } from '@/components/common/app-icon'
import { ActionButton } from '@/components/common/action-button'

interface EmptyStateProps {
	icon?: AppIconName
	title: string
	message?: string
	actionLabel?: string
	onAction?: () => void
}

export function EmptyState({ icon, title, message, actionLabel, onAction }: EmptyStateProps) {
	const { theme } = useTheme()

	return (
		<Animated.View
			entering={FadeIn.duration(300)}
			style={{
				alignItems: 'center',
				justifyContent: 'center',
				padding: 32,
				gap: 12,
			}}
		>
			{icon && <AppIcon name={icon} size={48} color={theme.mutedForeground} />}
			<Text
				style={{
					fontSize: 16,
					fontWeight: '600',
					color: theme.foreground,
					textAlign: 'center',
				}}
				accessibilityRole="header"
			>
				{title}
			</Text>
			{message && (
				<Text
					style={{
						fontSize: 14,
						color: theme.mutedForeground,
						textAlign: 'center',
					}}
				>
					{message}
				</Text>
			)}
			{actionLabel && onAction && (
				<View style={{ marginTop: 4 }}>
					<ActionButton label={actionLabel} onPress={onAction} />
				</View>
			)}
		</Animated.View>
	)
}
