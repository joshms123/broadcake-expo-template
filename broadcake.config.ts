import type { ImageSourcePropType } from 'react-native'

export interface BroadcakeAppConfig {
	/** Station slug from Broadcake (required). */
	stationSlug: string

	/** API base URL. Defaults to https://app.broadcake.com */
	baseUrl?: string

	/** Display name shown on the home screen. */
	name?: string

	/** Subtitle shown below the station name. */
	tagline?: string

	/**
	 * Artwork shown on the on-air and up-next cards.
	 *
	 * Defaults to the app icon, which you have replaced with your own logo
	 * anyway -- so leaving this unset is already correct, and there is no
	 * placeholder here to forget about and ship someone else's brand with.
	 *
	 * Set it when in-app artwork should differ from the launcher icon: a
	 * launcher icon is drawn at about 60pt and often has bleed and corner rules
	 * of its own, and it decodes at full size (1024px) to fill an 88pt tile.
	 * A wordmark, or simply a smaller file, is often the better image here.
	 *
	 *   logo: require('./assets/images/logo.png')
	 */
	logo?: ImageSourcePropType

	/** Theme color overrides (hex values). */
	theme?: {
		light?: { primary: string }
		dark?: { primary: string }
	}

	/** Feature toggles. */
	features?: {
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
