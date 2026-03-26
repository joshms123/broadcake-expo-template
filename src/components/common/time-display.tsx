import React from 'react'
import { Text, type TextStyle } from 'react-native'
import { useTheme } from '@/contexts/theme-context'
import { formatTime } from '@/lib/format'

interface TimeDisplayProps {
	startTime: string
	endTime: string
	style?: TextStyle
}

export function TimeDisplay({ startTime, endTime, style }: TimeDisplayProps) {
	const { theme } = useTheme()

	return (
		<Text
			style={[
				{
					fontSize: 13,
					color: theme.mutedForeground,
					fontVariant: ['tabular-nums'],
				},
				style,
			]}
		>
			{formatTime(startTime)} – {formatTime(endTime)}
		</Text>
	)
}
