import React, { useState } from 'react'
import { format } from 'date-fns'
import type { ScheduleSlot } from '@techcake/broadcake-sdk'
import { useSchedule } from '@/hooks/use-schedule'
import { useNowPlaying } from '@/hooks/use-now-playing'
import { DayPicker } from '@/components/schedule/day-picker'
import { ScheduleList } from '@/components/schedule/schedule-list'
import { ShowDetail } from '@/components/modals/show-detail'

export default function ScheduleScreen() {
	const [selectedDate, setSelectedDate] = useState(new Date())
	const dateStr = format(selectedDate, 'yyyy-MM-dd')

	const { data: slots, isLoading, isError, refetch } = useSchedule(dateStr)
	const { data: nowPlaying } = useNowPlaying()
	const [refreshing, setRefreshing] = useState(false)

	const [selectedSlot, setSelectedSlot] = useState<ScheduleSlot | null>(null)

	const handleRefresh = async () => {
		setRefreshing(true)
		await refetch()
		setRefreshing(false)
	}

	return (
		<>
			<ScheduleList
				slots={slots}
				isLoading={isLoading}
				isError={isError}
				nowPlayingSlotStart={nowPlaying?.now?.slot_start}
				onSlotPress={(slot) => setSelectedSlot(slot)}
				onRefresh={handleRefresh}
				isRefreshing={refreshing}
				header={<DayPicker selectedDate={selectedDate} onSelect={setSelectedDate} />}
			/>

			<ShowDetail
				visible={!!selectedSlot}
				onClose={() => setSelectedSlot(null)}
				showSlug={selectedSlot?.show_slug ?? null}
				showName={selectedSlot?.show_name ?? undefined}
			/>
		</>
	)
}
