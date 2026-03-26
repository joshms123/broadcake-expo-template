import { useQuery } from '@tanstack/react-query'
import { getClient } from '@/lib/sdk'
import { queryKeys } from '@/lib/query-keys'
import { SCHEDULE_STALE_TIME } from '@/lib/constants'

export function useSchedule(date: string) {
	return useQuery({
		queryKey: queryKeys.schedule(date),
		queryFn: () => getClient().schedule(date),
		staleTime: SCHEDULE_STALE_TIME,
		enabled: !!date,
	})
}
