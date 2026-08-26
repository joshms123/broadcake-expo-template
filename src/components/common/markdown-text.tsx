import React from 'react'
import { View, Text, type TextStyle } from 'react-native'
import { openLink } from '@/lib/links'
import { useTheme } from '@/contexts/theme-context'
import { parseMarkdown, stripMarkdown, type Span } from '@/lib/markdown'

interface MarkdownTextProps {
	children: string | null | undefined
	/** Base size for body text. Headings and bullets scale from it. */
	fontSize?: number
	color?: string
}

/**
 * A show description or a presenter bio, with its formatting applied.
 *
 * Not an HTML renderer -- see `$lib/markdown` for why there is no HTML in the
 * middle. Blocks become `View`s and spans become nested `Text`, which is how
 * React Native does inline formatting: a `Text` inside a `Text` inherits and
 * overrides, so bold inside a paragraph needs no measuring.
 *
 * The whole thing is one accessibility element with the markers stripped, so a
 * screen reader reads the prose rather than stopping on each bold run.
 */
export function MarkdownText({ children, fontSize = 15, color }: MarkdownTextProps) {
	const { theme } = useTheme()
	const blocks = parseMarkdown(children)

	if (blocks.length === 0) return null

	const base = color ?? theme.foreground

	const renderSpans = (spans: Span[]) =>
		spans.map((span, i) => {
			const style: TextStyle = {}
			if (span.bold) style.fontWeight = '600'
			if (span.italic) style.fontStyle = 'italic'
			if (span.href) {
				style.color = theme.primary
				style.textDecorationLine = 'underline'
			}

			// Position: spans come from a single parse of one string, so index is
			// stable, and the text itself is not unique -- two bold runs can say
			// the same thing.
			return (
				<Text
					key={i}
					style={style}
					onPress={span.href ? () => openLink(span.href) : undefined}
				>
					{span.text}
				</Text>
			)
		})

	return (
		<View
			style={{ gap: 10 }}
			accessible
			accessibilityLabel={stripMarkdown(children)}
		>
			{blocks.map((block, i) => {
				if (block.type === 'heading') {
					return (
						<Text
							key={i}
							style={{
								fontSize: fontSize + (block.level <= 2 ? 4 : 2),
								fontWeight: '700',
								color: base,
								marginTop: i === 0 ? 0 : 4,
							}}
						>
							{renderSpans(block.spans)}
						</Text>
					)
				}

				if (block.type === 'bullet') {
					return (
						<View key={i} style={{ flexDirection: 'row', gap: 8, paddingLeft: 4 }}>
							<Text style={{ fontSize, lineHeight: fontSize * 1.5, color: base }}>
								{'•'}
							</Text>
							<Text style={{ fontSize, lineHeight: fontSize * 1.5, color: base, flex: 1 }}>
								{renderSpans(block.spans)}
							</Text>
						</View>
					)
				}

				return (
					<Text key={i} style={{ fontSize, lineHeight: fontSize * 1.5, color: base }}>
						{renderSpans(block.spans)}
					</Text>
				)
			})}
		</View>
	)
}
