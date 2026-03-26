import { useQuery } from '@tanstack/react-query'
import { getClient } from '@/lib/sdk'
import { queryKeys } from '@/lib/query-keys'
import { NOW_PLAYING_INTERVAL } from '@/lib/constants'

export function useNowPlaying() {
	return useQuery({
		queryKey: queryKeys.nowPlaying(),
		queryFn: () => getClient().nowPlaying(),
		refetchInterval: NOW_PLAYING_INTERVAL,
		placeholderData: (prev) => prev,
	})
}
