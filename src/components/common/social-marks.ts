import type { ImageSourcePropType } from 'react-native'

/**
 * The station's social accounts, as their own brand marks.
 *
 * These were SF Symbols standing in for logos -- a camera for Instagram, a
 * thumbs-up for Facebook, an @ for X. SF Symbols has no third-party brand
 * marks and never will, so the mapping was always a guess, and nobody reads a
 * thumbs-up as Facebook.
 *
 * The marks come from Simple Icons (CC0). Using a platform's own mark to link
 * to a profile on that platform is the use each of them publishes brand
 * guidelines for.
 *
 * Two tones rather than one tinted mark: `tintColor` on an SVG is one more
 * thing to be wrong on a device, and a black glyph is invisible on a dark chip.
 * Picking the file by colour scheme cannot fail that way.
 *
 * `require` paths must be literal for Metro to resolve them, so this file is
 * generated rather than looped. LinkedIn is absent deliberately -- Simple Icons
 * removed it after a trademark request, so it falls back to the generic glyph,
 * as does any platform a station types in that is not listed here.
 */
export interface BrandMark {
	light: ImageSourcePropType
	dark: ImageSourcePropType
}

export const BRAND_MARKS: Record<string, BrandMark> = {
	bluesky: {
		light: require('../../../assets/social/bluesky-light.svg'),
		dark: require('../../../assets/social/bluesky-dark.svg'),
	},
	discord: {
		light: require('../../../assets/social/discord-light.svg'),
		dark: require('../../../assets/social/discord-dark.svg'),
	},
	facebook: {
		light: require('../../../assets/social/facebook-light.svg'),
		dark: require('../../../assets/social/facebook-dark.svg'),
	},
	instagram: {
		light: require('../../../assets/social/instagram-light.svg'),
		dark: require('../../../assets/social/instagram-dark.svg'),
	},
	mastodon: {
		light: require('../../../assets/social/mastodon-light.svg'),
		dark: require('../../../assets/social/mastodon-dark.svg'),
	},
	mixcloud: {
		light: require('../../../assets/social/mixcloud-light.svg'),
		dark: require('../../../assets/social/mixcloud-dark.svg'),
	},
	soundcloud: {
		light: require('../../../assets/social/soundcloud-light.svg'),
		dark: require('../../../assets/social/soundcloud-dark.svg'),
	},
	spotify: {
		light: require('../../../assets/social/spotify-light.svg'),
		dark: require('../../../assets/social/spotify-dark.svg'),
	},
	telegram: {
		light: require('../../../assets/social/telegram-light.svg'),
		dark: require('../../../assets/social/telegram-dark.svg'),
	},
	threads: {
		light: require('../../../assets/social/threads-light.svg'),
		dark: require('../../../assets/social/threads-dark.svg'),
	},
	tiktok: {
		light: require('../../../assets/social/tiktok-light.svg'),
		dark: require('../../../assets/social/tiktok-dark.svg'),
	},
	twitch: {
		light: require('../../../assets/social/twitch-light.svg'),
		dark: require('../../../assets/social/twitch-dark.svg'),
	},
	x: {
		light: require('../../../assets/social/x-light.svg'),
		dark: require('../../../assets/social/x-dark.svg'),
	},
	youtube: {
		light: require('../../../assets/social/youtube-light.svg'),
		dark: require('../../../assets/social/youtube-dark.svg'),
	},
}
