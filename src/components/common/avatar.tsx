import React, { useState } from 'react'
import { View, Text } from 'react-native'
import { Image } from 'expo-image'

const AVATAR_COLORS = [
	'#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981',
	'#06b6d4', '#3b82f6', '#f97316', '#14b8a6', '#a855f7',
]

function nameToColorIndex(name: string): number {
	let hash = 0
	for (let i = 0; i < name.length; i++) {
		hash = name.charCodeAt(i) + ((hash << 5) - hash)
	}
	return Math.abs(hash) % AVATAR_COLORS.length
}

function getInitials(name: string): string {
	const words = name.trim().split(/\s+/)
	if (words.length >= 2) {
		return (words[0][0] + words[1][0]).toUpperCase()
	}
	return (words[0]?.[0] ?? '?').toUpperCase()
}

interface AvatarProps {
	uri?: string | null
	name?: string
	size?: number
	rounded?: boolean
}

export function Avatar({ uri, name = '?', size = 40, rounded = true }: AvatarProps) {
	const [imageError, setImageError] = useState(false)
	const bgColor = AVATAR_COLORS[nameToColorIndex(name)]
	const borderRadius = rounded ? size / 2 : size * 0.22

	if (uri && !imageError) {
		return (
			<Image
				source={{ uri }}
				onError={() => setImageError(true)}
				style={{
					width: size,
					height: size,
					borderRadius,
					borderCurve: 'continuous',
				}}
				accessible={false}
			/>
		)
	}

	return (
		<View
			accessible={false}
			style={{
				width: size,
				height: size,
				borderRadius,
				borderCurve: 'continuous',
				backgroundColor: bgColor,
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			<Text
				style={{
					color: '#ffffff',
					fontSize: size * 0.38,
					fontWeight: '600',
				}}
			>
				{getInitials(name)}
			</Text>
		</View>
	)
}
