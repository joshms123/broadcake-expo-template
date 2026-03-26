import { QueryClient } from '@tanstack/react-query'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import { QUERY_CACHE_KEY } from './constants'

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60,
			gcTime: 1000 * 60 * 30,
			retry: 2,
			refetchOnWindowFocus: false,
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
