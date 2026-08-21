export interface BroadcakeAppConfig {
	/** Station slug from Broadcake (required). */
	stationSlug: string

	/** API base URL. Defaults to https://app.broadcake.com */
	baseUrl?: string

	/** Display name shown on the home screen. */
	name?: string

	/** Subtitle shown below the station name. */
	tagline?: string

	/** Theme color overrides (hex values). */
	theme?: {
		light?: { primary: string }
		dark?: { primary: string }
	}

	/** Feature toggles. */
	features?: {
		/** Show "Notify me" on schedule slots. Default: true */
		notifications?: boolean
		/** Show "Message the Station" button on home. Default: true */
		contactForm?: boolean
		/** Form slug to use for contact (required if contactForm is true). */
		contactFormSlug?: string
	}

	/** Now-playing polling interval in ms. Default: 30000 */
	nowPlayingInterval?: number
}

const config: BroadcakeAppConfig = {
	stationSlug: 'anchor-radio',
	// Leave unset to use the SDK default (https://app.broadcake.com).
	// Point this at your own deployment only if you self-host Broadcake.
	// baseUrl: 'https://app.broadcake.com',
}

export default config
