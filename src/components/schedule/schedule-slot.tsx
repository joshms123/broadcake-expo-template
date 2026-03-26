import React from 'react'
import { View, Text, Pressable } from 'react-native'
import type { ScheduleSlot as ScheduleSlotType } from '@techcake/broadcake-sdk'
import { useTheme } from '@/contexts/theme-context'
import { formatTime, getPresenters } from '@/lib/format'
import { Avatar } from '@/components/common/avatar'
import { Badge } from '@/components/common/badge'

interface ScheduleSlotProps {
	slot: ScheduleSlotType
	isNowPlaying?: boolean
	onPress?: (slot: ScheduleSlotType) => void
}

export const ScheduleSlot = React.memo(function ScheduleSlot({ slot, isNowPlaying, onPress }: ScheduleSlotProps) {
	const { theme, colorScheme } = useTheme()

	const isAutomation = slot.source === 'automation'
	const isCancelled = slot.override_type === 'cancellation'

	const handlePress = () => {
		if (slot.show_slug && !isAutomation && onPress) {
			onPress(slot)
		}
	}

	return (
		<Pressable
			onPress={handlePress}
			disabled={isAutomation || !onPress}
			accessibilityRole={isAutomation ? undefined : 'button'}
			accessibilityLabel={`${slot.show_name ?? 'Automation'}, ${formatTime(slot.slot_start)} to ${formatTime(slot.slot_end)}${slot.presenters.length > 0 ? `, with ${getPresenters(slot.presenters)}` : ''}`}
			style={{
				backgroundColor: theme.card,
				borderRadius: 12,
				borderCurve: 'continuous',
				padding: 14,
				gap: 8,
				borderWidth: 1,
				borderColor: isNowPlaying ? theme.infoText : theme.border,
				borderStyle: isAutomation ? 'dashed' : 'solid',
				opacity: isCancelled ? 0.5 : 1,
				boxShadow: isNowPlaying
					? colorScheme === 'dark'
						? '0 0 12px rgba(99,102,241,0.3)'
						: '0 0 12px rgba(99,102,241,0.15)'
					: undefined,
			}}
		>
			{/* Header row: time + now playing indicator */}
			<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
				<Text style={{ fontSize: 13, color: theme.mutedForeground, fontVariant: ['tabular-nums'] }}>
					{formatTime(slot.slot_start)} – {formatTime(slot.slot_end)}
				</Text>
				{isNowPlaying && (
					<View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
						<View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#22c55e' }} />
						<Text style={{ fontSize: 11, fontWeight: '600', color: '#22c55e' }}>NOW</Text>
					</View>
				)}
			</View>

			{/* Show name */}
			<Text
				style={{
					fontSize: 17,
					fontWeight: '600',
					color: isAutomation ? theme.mutedForeground : theme.foreground,
				}}
				numberOfLines={1}
			>
				{slot.show_name ?? 'Automation'}
			</Text>

			{/* Presenters */}
			{slot.presenters.length > 0 && (
				<View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
					<View style={{ flexDirection: 'row' }}>
						{slot.presenters.slice(0, 3).map((p, i) => (
							<View key={p.name} style={{ marginLeft: i > 0 ? -8 : 0, zIndex: 3 - i }}>
								<Avatar name={p.name} size={24} />
							</View>
						))}
					</View>
					<Text style={{ fontSize: 13, color: theme.mutedForeground, flex: 1 }} numberOfLines={1}>
						{getPresenters(slot.presenters)}
					</Text>
				</View>
			)}

			{/* Badges row */}
			{(slot.genres.length > 0 || slot.is_repeat || isCancelled) && (
				<View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>
					{isCancelled && <Badge label="Cancelled" variant="destructive" />}
					{slot.is_repeat && slot.repeat_label && (
						<Badge label={slot.repeat_label} variant="muted" />
					)}
					{slot.genres.map((g) => (
						<Badge key={g.slug} label={g.name} />
					))}
				</View>
			)}
		</Pressable>
	)
})
