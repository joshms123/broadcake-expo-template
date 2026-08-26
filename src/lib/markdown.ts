/**
 * The little bit of markdown a show description actually contains.
 *
 * Descriptions are typed in the dashboard and the station website renders them
 * as markdown (snarkdown, then sanitised). The app rendered the source, so a
 * show whose description used bold read `**The Midway Extended Play** - a daily
 * classic 12" extended mix` on screen, asterisks and all.
 *
 * This does not go via HTML. snarkdown emits markup and React Native has none
 * to render, so parsing to blocks and spans that map onto `Text` is both
 * shorter and safer -- nothing here can produce a tag, so there is nothing to
 * sanitise. The subset is what people write in a description: paragraphs,
 * bullets, bold, italic and links.
 *
 * Anything unrecognised stays as literal text, which is the right failure: a
 * stray asterisk should look like a stray asterisk, not swallow the rest of the
 * paragraph.
 */

export interface Span {
	text: string
	bold?: boolean
	italic?: boolean
	href?: string
}

export type Block =
	| { type: 'paragraph'; spans: Span[] }
	| { type: 'bullet'; spans: Span[] }
	| { type: 'heading'; level: number; spans: Span[] }

/**
 * Inline markers, longest first so `**` is tried before `*`.
 *
 * Each is anchored to the start of the remaining string, so the scan below
 * moves left to right and never rescans -- which is what keeps an unmatched
 * marker literal instead of greedily pairing with one three paragraphs later.
 */
const LINK = /^\[([^\]]+)\]\(([^)\s]+)\)/
const BOLD = /^\*\*([^*]+)\*\*/
const BOLD_ALT = /^__([^_]+)__/
const ITALIC = /^\*([^*]+)\*/
const ITALIC_ALT = /^_([^_]+)_/

/**
 * Underscore emphasis only counts at a word boundary, which is what markdown
 * itself requires and what stops `file_name_here` becoming `file` *name*
 * `here`. Asterisks have no such rule, in markdown or here.
 */
function atWordBoundary(previous: string | undefined): boolean {
	return previous === undefined || !/[A-Za-z0-9]/.test(previous)
}

export function parseInline(text: string): Span[] {
	const spans: Span[] = []
	let plain = ''
	let rest = text
	let previous: string | undefined

	const flush = () => {
		if (plain) {
			spans.push({ text: plain })
			plain = ''
		}
	}

	while (rest.length > 0) {
		const link = LINK.exec(rest)
		if (link) {
			flush()
			// Only http(s). A description is user input, and a link is the one
			// place here that could carry a scheme worth refusing.
			const href = /^https?:\/\//i.test(link[2]) ? link[2] : undefined
			spans.push({ text: link[1], href })
			rest = rest.slice(link[0].length)
			previous = ')'
			continue
		}

		const boundary = atWordBoundary(previous)

		const bold = BOLD.exec(rest) ?? (boundary ? BOLD_ALT.exec(rest) : null)
		if (bold) {
			flush()
			spans.push({ text: bold[1], bold: true })
			rest = rest.slice(bold[0].length)
			previous = bold[0][bold[0].length - 1]
			continue
		}

		const italic = ITALIC.exec(rest) ?? (boundary ? ITALIC_ALT.exec(rest) : null)
		if (italic) {
			flush()
			spans.push({ text: italic[1], italic: true })
			rest = rest.slice(italic[0].length)
			previous = italic[0][italic[0].length - 1]
			continue
		}

		plain += rest[0]
		previous = rest[0]
		rest = rest.slice(1)
	}

	flush()
	return spans
}

const BULLET = /^\s*(?:[-*+•])\s+(.*)$/
const HEADING = /^\s*(#{1,6})\s+(.*)$/

export function parseMarkdown(source: string | null | undefined): Block[] {
	if (!source) return []

	const blocks: Block[] = []
	let paragraph: string[] = []

	const flushParagraph = () => {
		if (paragraph.length === 0) return
		blocks.push({ type: 'paragraph', spans: parseInline(paragraph.join(' ')) })
		paragraph = []
	}

	for (const raw of source.replace(/\r\n?/g, '\n').split('\n')) {
		const line = raw.trimEnd()

		if (line.trim() === '') {
			flushParagraph()
			continue
		}

		const heading = HEADING.exec(line)
		if (heading) {
			flushParagraph()
			blocks.push({
				type: 'heading',
				level: heading[1].length,
				spans: parseInline(heading[2]),
			})
			continue
		}

		const bullet = BULLET.exec(line)
		if (bullet) {
			flushParagraph()
			blocks.push({ type: 'bullet', spans: parseInline(bullet[1]) })
			continue
		}

		paragraph.push(line.trim())
	}

	flushParagraph()
	return blocks
}

/**
 * The same text with its markers removed, for somewhere that cannot show
 * formatting -- a two-line preview, or an accessibility label.
 */
export function stripMarkdown(source: string | null | undefined): string {
	return parseMarkdown(source)
		.map((b) => b.spans.map((s) => s.text).join(''))
		.join(' ')
		.trim()
}
