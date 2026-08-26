import rawConfig from '../../broadcake.config'
import type { BroadcakeAppConfig } from '../../broadcake.config'

export type { BroadcakeAppConfig }

export const config: BroadcakeAppConfig = {
	baseUrl: 'https://app.broadcake.com',
	nowPlayingInterval: 30_000,
	...rawConfig,
	features: {
		contactForm: true,
		...rawConfig.features,
	},
}
