import { Linking } from 'react-native'
import * as WebBrowser from 'expo-web-browser'

/**
 * Open a link the way the platform wants to.
 *
 * `Linking.openURL`, not `WebBrowser.openBrowserAsync`. The in-app browser is
 * an `SFSafariViewController`, and iOS deliberately does not follow universal
 * links out of one -- so tapping Instagram opened instagram.com in a web view
 * rather than the Instagram app, even with the app installed. Handing the URL
 * to the system lets the installed app claim it, on both platforms.
 *
 * Still the https URL rather than a per-platform scheme like
 * `instagram://user?username=`. Schemes mean parsing a profile URL for each
 * platform, declaring every one in `LSApplicationQueriesSchemes` before
 * `canOpenURL` will even answer, and revisiting all of it whenever a platform
 * changes its mind. A universal link needs none of that, and falls back to the
 * browser by itself when the app is not installed.
 *
 * This is for links a station or presenter supplied -- a profile, something in
 * a bio. The in-app browser is still right for a link this app owns, where
 * coming straight back matters more than handing off.
 */
export async function openLink(url: string | null | undefined): Promise<void> {
	if (!url) return

	// Anything the app opens came from station or presenter input, so the scheme
	// is checked rather than trusted.
	try {
		const { protocol } = new URL(url)
		if (protocol !== 'https:' && protocol !== 'http:') return
	} catch {
		return
	}

	try {
		await Linking.openURL(url)
	} catch {
		// Nothing registered for it, browser included -- rare, but a dead tap is
		// worse than the web view.
		await WebBrowser.openBrowserAsync(url).catch(() => {})
	}
}
