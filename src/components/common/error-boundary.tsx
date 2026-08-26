import React from 'react'
import { Appearance, View, Text, Pressable } from 'react-native'
import { lightTheme, darkTheme } from '@/lib/theme'
import { AppIcon } from '@/components/common/app-icon'

interface ErrorBoundaryProps {
	children: React.ReactNode
}

interface ErrorBoundaryState {
	hasError: boolean
	error: Error | null
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
	constructor(props: ErrorBoundaryProps) {
		super(props)
		this.state = { hasError: false, error: null }
	}

	static getDerivedStateFromError(error: Error): ErrorBoundaryState {
		return { hasError: true, error }
	}

	handleRetry = () => {
		this.setState({ hasError: false, error: null })
	}

	render() {
		// A class cannot call useTheme, and hardcoding the light palette left the
		// crash screen as near-black text on the dark window background — 1.05:1,
		// which is to say invisible, on the one screen where trust is already
		// spent. Read the scheme directly instead.
		const c = Appearance.getColorScheme() === 'dark' ? darkTheme : lightTheme

		if (this.state.hasError) {
			return (
				<View
					style={{
						flex: 1,
						alignItems: 'center',
						justifyContent: 'center',
						padding: 32,
						gap: 16,
						backgroundColor: c.background,
					}}
				>
					<AppIcon name="exclamationmark.triangle" size={48} color={c.mutedForeground} />
					<Text style={{ fontSize: 18, fontWeight: '600', color: c.foreground, textAlign: 'center' }}>
						Something went wrong
					</Text>
					<Text style={{ fontSize: 14, color: c.mutedForeground, textAlign: 'center' }}>
						{this.state.error?.message ?? 'An unexpected error occurred.'}
					</Text>
					<Pressable
						onPress={this.handleRetry}
						accessibilityRole="button"
						accessibilityLabel="Try again"
						style={{
							paddingHorizontal: 24,
							paddingVertical: 12,
							backgroundColor: c.primary,
							borderRadius: 8,
							borderCurve: 'continuous',
						}}
					>
						<Text style={{ color: c.primaryForeground, fontWeight: '500' }}>Try Again</Text>
					</Pressable>
				</View>
			)
		}

		return this.props.children
	}
}
