import { useQuery } from '@tanstack/react-query'
import { getClient } from '@/lib/sdk'
import { queryKeys } from '@/lib/query-keys'
import { REFERENCE_STALE_TIME } from '@/lib/constants'

export function usePresenter(slug: string | null) {
	return useQuery({
		queryKey: queryKeys.presenter(slug!),
		queryFn: () => getClient().presenter(slug!),
		staleTime: REFERENCE_STALE_TIME,
		enabled: !!slug,
	})
}
