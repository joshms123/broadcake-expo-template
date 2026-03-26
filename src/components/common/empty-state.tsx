import React from 'react'
import { View, Text, Pressable } from 'react-native'
import { Image } from 'expo-image'
import Animated, { FadeIn } from 'react-native-reanimated'
import { useTheme } from '@/contexts/theme-context'

interface EmptyStateProps {
	icon?: string
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
			{icon && (
				<Image
					source={icon}
					style={{ width: 48, height: 48, tintColor: theme.mutedForeground }}
					accessible={false}
				/>
			)}
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
				<Pressable
					onPress={onAction}
					accessibilityRole="button"
					accessibilityLabel={actionLabel}
					style={{
						paddingHorizontal: 20,
						paddingVertical: 10,
						backgroundColor: theme.primary,
						borderRadius: 8,
						borderCurve: 'continuous',
						marginTop: 4,
					}}
				>
					<Text style={{ color: theme.primaryForeground, fontWeight: '500' }}>
						{actionLabel}
					</Text>
				</Pressable>
			)}
		</Animated.View>
	)
}
