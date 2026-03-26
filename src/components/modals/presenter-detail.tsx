import React from 'react'
import { View, Text, ScrollView, Modal, Pressable } from 'react-native'
import { useTheme } from '@/contexts/theme-context'
import { usePresenter } from '@/hooks/use-presenter'
import { Avatar } from '@/components/common/avatar'

interface PresenterDetailProps {
	visible: boolean
	onClose: () => void
	presenterSlug: string | null
}

export function PresenterDetail({ visible, onClose, presenterSlug }: PresenterDetailProps) {
	const { theme } = useTheme()
	const { data: presenter } = usePresenter(visible ? presenterSlug : null)

	return (
		<Modal
			visible={visible}
			animationType="slide"
			presentationStyle="formSheet"
			onRequestClose={onClose}
		>
			<View style={{ flex: 1, backgroundColor: theme.background }}>
				{/* Header */}
				<View
					style={{
						flexDirection: 'row',
						justifyContent: 'space-between',
						alignItems: 'center',
						padding: 16,
						borderBottomWidth: 1,
						borderBottomColor: theme.border,
					}}
				>
					<Text
						style={{ fontSize: 17, fontWeight: '600', color: theme.foreground }}
						numberOfLines={1}
					>
						{presenter?.display_name ?? 'Presenter'}
					</Text>
					<Pressable
						onPress={onClose}
						accessibilityRole="button"
						accessibilityLabel="Close"
						hitSlop={12}
					>
						<Text style={{ fontSize: 15, color: theme.primary, fontWeight: '500' }}>
							Done
						</Text>
					</Pressable>
				</View>

				<ScrollView contentContainerStyle={{ padding: 16, gap: 20, paddingBottom: 32 }}>
					{/* Avatar + name */}
					<View style={{ alignItems: 'center', gap: 12 }}>
						<Avatar
							uri={presenter?.avatar_url}
							name={presenter?.display_name ?? '?'}
							size={96}
						/>
						<View style={{ alignItems: 'center', gap: 4 }}>
							<Text style={{ fontSize: 22, fontWeight: '700', color: theme.foreground }}>
								{presenter?.display_name}
							</Text>
							{presenter?.pronouns && (
								<Text style={{ fontSize: 14, color: theme.mutedForeground }}>
									{presenter.pronouns}
								</Text>
							)}
						</View>
					</View>

					{/* Bio */}
					{presenter?.bio && (
						<Text style={{ fontSize: 15, color: theme.foreground, lineHeight: 22 }}>
							{presenter.bio}
						</Text>
					)}

					{/* Shows */}
					{presenter?.shows && presenter.shows.length > 0 && (
						<View style={{ gap: 10 }}>
							<Text
								style={{ fontSize: 13, fontWeight: '600', color: theme.mutedForeground, textTransform: 'uppercase', letterSpacing: 0.5 }}
								accessibilityRole="header"
							>
								Shows
							</Text>
							{presenter.shows.map((show) => (
								<View
									key={show.id}
									style={{
										padding: 12,
										backgroundColor: theme.secondary,
										borderRadius: 10,
										borderCurve: 'continuous',
										gap: 4,
									}}
								>
									<Text style={{ fontSize: 15, fontWeight: '500', color: theme.foreground }}>
										{show.name}
									</Text>
									{show.description && (
										<Text
											style={{ fontSize: 13, color: theme.mutedForeground }}
											numberOfLines={2}
										>
											{show.description}
										</Text>
									)}
								</View>
							))}
						</View>
					)}
				</ScrollView>
			</View>
		</Modal>
	)
}
