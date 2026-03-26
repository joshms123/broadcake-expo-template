import React, { useEffect } from 'react'
import { View, type ViewStyle } from 'react-native'
import Animated, {
	useAnimatedStyle,
	withRepeat,
	withTiming,
	useSharedValue,
	Easing,
} from 'react-native-reanimated'
import { useTheme } from '@/contexts/theme-context'

interface SkeletonProps {
	width: number | string
	height?: number
	borderRadius?: number
	style?: ViewStyle
}

export function Skeleton({ width, height = 14, borderRadius = 6, style }: SkeletonProps) {
	const { theme } = useTheme()
	const opacity = useSharedValue(0.3)

	useEffect(() => {
		opacity.value = withRepeat(
			withTiming(0.7, { duration: 800, easing: Easing.inOut(Easing.ease) }),
			-1,
			true
		)
	}, [opacity])

	const animatedStyle = useAnimatedStyle(() => ({
		opacity: opacity.value,
	}))

	return (
		<Animated.View
			style={[
				{
					width: width as number,
					height,
					borderRadius,
					borderCurve: 'continuous',
					backgroundColor: theme.muted,
				},
				animatedStyle,
				style,
			]}
		/>
	)
}

export function ScheduleSkeleton({ count = 5 }: { count?: number }) {
	const { theme } = useTheme()

	return (
		<View style={{ gap: 10, padding: 16 }}>
			{Array.from({ length: count }).map((_, i) => (
				<View
					key={i}
					style={{
						backgroundColor: theme.card,
						borderRadius: 12,
						borderCurve: 'continuous',
						padding: 16,
						gap: 10,
						borderWidth: 1,
						borderColor: theme.border,
					}}
				>
					<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
						<Skeleton width={100} height={12} />
						<Skeleton width={60} height={12} />
					</View>
					<Skeleton width="70%" height={18} />
					<Skeleton width="40%" height={12} />
				</View>
			))}
		</View>
	)
}
