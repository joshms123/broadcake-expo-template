import { useQuery } from '@tanstack/react-query'
import { getClient } from '@/lib/sdk'
import { queryKeys } from '@/lib/query-keys'
import { REFERENCE_STALE_TIME } from '@/lib/constants'

export function useShow(slug: string | null) {
	return useQuery({
		queryKey: queryKeys.show(slug!),
		queryFn: () => getClient().show(slug!),
		staleTime: REFERENCE_STALE_TIME,
		enabled: !!slug,
	})
}
