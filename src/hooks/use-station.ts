import { useQuery } from '@tanstack/react-query'
import { getClient } from '@/lib/sdk'
import { queryKeys } from '@/lib/query-keys'
import { REFERENCE_STALE_TIME } from '@/lib/constants'

export function useStation() {
	return useQuery({
		queryKey: queryKeys.station(),
		queryFn: () => getClient().station(),
		staleTime: REFERENCE_STALE_TIME,
	})
}
