import React from 'react'
import { View, Text, Pressable } from 'react-native'
import { Image } from 'expo-image'

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
		if (this.state.hasError) {
			return (
				<View
					style={{
						flex: 1,
						alignItems: 'center',
						justifyContent: 'center',
						padding: 32,
						gap: 16,
					}}
				>
					<Image
						source="sf:exclamationmark.triangle"
						style={{ width: 48, height: 48, tintColor: '#6b7380' }}
						accessible={false}
					/>
					<Text style={{ fontSize: 18, fontWeight: '600', color: '#090911', textAlign: 'center' }}>
						Something went wrong
					</Text>
					<Text style={{ fontSize: 14, color: '#6b7380', textAlign: 'center' }}>
						{this.state.error?.message ?? 'An unexpected error occurred.'}
					</Text>
					<Pressable
						onPress={this.handleRetry}
						accessibilityRole="button"
						accessibilityLabel="Try again"
						style={{
							paddingHorizontal: 24,
							paddingVertical: 12,
							backgroundColor: '#0f172b',
							borderRadius: 8,
							borderCurve: 'continuous',
						}}
					>
						<Text style={{ color: '#f8fafc', fontWeight: '500' }}>Try Again</Text>
					</Pressable>
				</View>
			)
		}

		return this.props.children
	}
}
