import { useQuery } from '@tanstack/react-query'
import { getClient } from '@/lib/sdk'
import { queryKeys } from '@/lib/query-keys'
import { REFERENCE_STALE_TIME } from '@/lib/constants'

export function useForm(slug: string | null | undefined) {
	return useQuery({
		queryKey: queryKeys.form(slug!),
		queryFn: () => getClient().form(slug!),
		staleTime: REFERENCE_STALE_TIME,
		enabled: !!slug,
	})
}
