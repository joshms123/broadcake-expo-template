import React, { useRef, useEffect, useMemo } from 'react'
import { View, Text, Pressable, FlatList } from 'react-native'
import { format, addDays, isSameDay } from 'date-fns'
import { useTheme } from '@/contexts/theme-context'
import { triggerHaptic } from '@/lib/format'

interface DayPickerProps {
	selectedDate: Date
	onSelect: (date: Date) => void
}

const DAYS_RANGE = 7

export function DayPicker({ selectedDate, onSelect }: DayPickerProps) {
	const { theme } = useTheme()
	const listRef = useRef<FlatList>(null)
	const today = useMemo(() => new Date(), [])

	const days = useMemo(
		() => Array.from({ length: DAYS_RANGE }, (_, i) => addDays(today, i)),
		[today]
	)

	const selectedIndex = useMemo(
		() => days.findIndex((d) => isSameDay(d, selectedDate)),
		[days, selectedDate]
	)

	useEffect(() => {
		if (selectedIndex >= 0 && listRef.current) {
			setTimeout(() => {
				listRef.current?.scrollToIndex({ index: selectedIndex, animated: false, viewPosition: 0.3 })
			}, 100)
		}
	}, [selectedIndex])

	return (
		<FlatList
			ref={listRef}
			horizontal
			showsHorizontalScrollIndicator={false}
			data={days}
			keyExtractor={(item) => item.toISOString()}
			contentContainerStyle={{ paddingHorizontal: 16, gap: 8, paddingVertical: 8 }}
			onScrollToIndexFailed={() => {}}
			renderItem={({ item }) => {
				const isSelected = isSameDay(item, selectedDate)
				const isToday = isSameDay(item, today)

				return (
					<Pressable
						onPress={() => {
							triggerHaptic()
							onSelect(item)
						}}
						accessibilityRole="button"
						accessibilityLabel={`${format(item, 'EEEE, MMMM d')}${isToday ? ' (today)' : ''}`}
						accessibilityState={{ selected: isSelected }}
						style={{
							alignItems: 'center',
							paddingHorizontal: 14,
							paddingVertical: 10,
							borderRadius: 12,
							borderCurve: 'continuous',
							backgroundColor: isSelected ? theme.primary : 'transparent',
							minWidth: 52,
						}}
					>
						<Text
							style={{
								fontSize: 12,
								fontWeight: '500',
								color: isSelected ? theme.primaryForeground : theme.mutedForeground,
								textTransform: 'uppercase',
							}}
						>
							{format(item, 'EEE')}
						</Text>
						<Text
							style={{
								fontSize: 18,
								fontWeight: '700',
								color: isSelected ? theme.primaryForeground : theme.foreground,
							}}
						>
							{format(item, 'd')}
						</Text>
						{isToday && !isSelected && (
							<View
								style={{
									width: 5,
									height: 5,
									borderRadius: 3,
									backgroundColor: theme.primary,
									marginTop: 2,
								}}
							/>
						)}
					</Pressable>
				)
			}}
		/>
	)
}
