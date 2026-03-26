import { config } from './config'

export const NOW_PLAYING_INTERVAL = config.nowPlayingInterval ?? 30_000
export const SCHEDULE_STALE_TIME = 30_000
export const REFERENCE_STALE_TIME = 300_000

export const NOTIFICATION_STORAGE_KEY = 'app-template-notifications'
export const NOTIFICATION_LEAD_TIME_KEY = 'app-template-notification-lead-time'
export const STREAM_STORAGE_KEY = 'app-template-selected-stream'
export const THEME_STORAGE_KEY = 'app-template-color-scheme'
export const QUERY_CACHE_KEY = 'app-template-query-cache'
export const PUSH_TOKEN_KEY = 'app-template-push-token'
