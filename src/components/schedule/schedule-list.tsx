import React from 'react'
import { FlatList, RefreshControl } from 'react-native'
import type { ScheduleSlot as ScheduleSlotType } from '@techcake/broadcake-sdk'
import { ScheduleSlot } from './schedule-slot'
import { ScheduleSkeleton } from '@/components/common/skeleton'
import { EmptyState } from '@/components/common/empty-state'

interface ScheduleListProps {
	slots: ScheduleSlotType[] | undefined
	isLoading: boolean
	isError?: boolean
	nowPlayingSlotStart?: string | null
	onSlotPress?: (slot: ScheduleSlotType) => void
	onRefresh?: () => void
	isRefreshing?: boolean
	header?: React.ReactNode
}

export function ScheduleList({
	slots,
	isLoading,
	isError,
	nowPlayingSlotStart,
	onSlotPress,
	onRefresh,
	isRefreshing = false,
	header,
}: ScheduleListProps) {
	if (isLoading && !slots) {
		return (
			<FlatList
				data={[]}
				renderItem={() => null}
				ListHeaderComponent={header ? <>{header}</> : undefined}
				ListEmptyComponent={<ScheduleSkeleton count={6} />}
				contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32, gap: 10 }}
				contentInsetAdjustmentBehavior="automatic"
			/>
		)
	}

	if (isError && !slots) {
		return (
			<FlatList
				data={[]}
				renderItem={() => null}
				ListHeaderComponent={header ? <>{header}</> : undefined}
				ListEmptyComponent={
					<EmptyState
						icon="sf:wifi.exclamationmark"
						title="Failed to load schedule"
						message="Check your connection and try again."
						actionLabel="Retry"
						onAction={onRefresh}
					/>
				}
				contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32, gap: 10 }}
				contentInsetAdjustmentBehavior="automatic"
			/>
		)
	}

	return (
		<FlatList
			data={slots ?? []}
			keyExtractor={(item, index) => `${item.slot_start}-${item.show_slug ?? 'auto'}-${index}`}
			contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32, gap: 10 }}
			contentInsetAdjustmentBehavior="automatic"
			initialNumToRender={8}
			maxToRenderPerBatch={10}
			ListHeaderComponent={header ? <>{header}</> : undefined}
			renderItem={({ item }) => (
				<ScheduleSlot
					slot={item}
					isNowPlaying={item.slot_start === nowPlayingSlotStart}
					onPress={onSlotPress}
				/>
			)}
			ListEmptyComponent={
				<EmptyState
					icon="sf:calendar.badge.exclamationmark"
					title="No shows scheduled"
					message="Check back later for upcoming shows."
				/>
			}
			refreshControl={
				onRefresh ? (
					<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
				) : undefined
			}
		/>
	)
}
