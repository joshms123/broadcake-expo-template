import { Broadcake } from '@techcake/broadcake-sdk'
import { config } from './config'

let client: Broadcake | undefined

export function getClient(): Broadcake {
	if (!client) {
		client = new Broadcake(config.stationSlug, { baseUrl: config.baseUrl })
	}
	return client
}
