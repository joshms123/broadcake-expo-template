import { QueryClient } from '@tanstack/react-query'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import { QUERY_CACHE_KEY } from './constants'

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60,
			// At least as long as the persister's 24h maxAge. At 30 minutes a query
			// that lost its observer was garbage-collected and dropped from the
			// persisted snapshot too, so yesterday's schedule and every closed
			// modal's data vanished from the offline cache it was meant to fill.
			gcTime: 1000 * 60 * 60 * 24,
			retry: 2,
		},
		mutations: {
			retry: 0,
		},
	},
})

export const asyncStoragePersister = createAsyncStoragePersister({
	storage: AsyncStorage,
	key: QUERY_CACHE_KEY,
})
