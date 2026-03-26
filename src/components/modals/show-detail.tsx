import React, { useState } from 'react'
import { View, Text, ScrollView, Modal, Pressable } from 'react-native'
import { useTheme } from '@/contexts/theme-context'
import { useShow } from '@/hooks/use-show'
import { useShowSchedule } from '@/hooks/use-show-schedule'
import { formatTime } from '@/lib/format'
import { Avatar } from '@/components/common/avatar'
import { Badge } from '@/components/common/badge'
import { PresenterDetail } from './presenter-detail'

const DAY_NAMES = ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

interface ShowDetailProps {
	visible: boolean
	onClose: () => void
	showSlug: string | null
	showName?: string
}

export function ShowDetail({ visible, onClose, showSlug, showName }: ShowDetailProps) {
	const { theme } = useTheme()
	const { data: show } = useShow(visible ? showSlug : null)
	const { data: schedule } = useShowSchedule(visible ? showSlug : null)
	const [presenterSlug, setPresenterSlug] = useState<string | null>(null)

	return (
		<>
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
							style={{ fontSize: 17, fontWeight: '600', color: theme.foreground, flex: 1 }}
							numberOfLines={1}
						>
							{show?.name ?? showName ?? 'Show'}
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

					<ScrollView
						contentContainerStyle={{ padding: 16, gap: 20, paddingBottom: 32 }}
					>
						{/* Description */}
						{show?.description && (
							<Text style={{ fontSize: 15, color: theme.foreground, lineHeight: 22 }}>
								{show.description}
							</Text>
						)}

						{/* Presenters */}
						{show?.presenters && show.presenters.length > 0 && (
							<View style={{ gap: 10 }}>
								<Text
									style={{ fontSize: 13, fontWeight: '600', color: theme.mutedForeground, textTransform: 'uppercase', letterSpacing: 0.5 }}
									accessibilityRole="header"
								>
									Presenters
								</Text>
								{show.presenters.map((p) => (
									<Pressable
										key={p.id}
										onPress={() => setPresenterSlug(p.slug)}
										accessibilityRole="button"
										accessibilityLabel={`View ${p.display_name}'s profile`}
										style={{
											flexDirection: 'row',
											alignItems: 'center',
											gap: 12,
											padding: 12,
											backgroundColor: theme.secondary,
											borderRadius: 10,
											borderCurve: 'continuous',
										}}
									>
										<Avatar uri={p.avatar_url} name={p.display_name} size={40} />
										<View style={{ flex: 1 }}>
											<Text style={{ fontSize: 15, fontWeight: '500', color: theme.foreground }}>
												{p.display_name}
											</Text>
											{p.pronouns && (
												<Text style={{ fontSize: 13, color: theme.mutedForeground }}>
													{p.pronouns}
												</Text>
											)}
										</View>
										<Text style={{ fontSize: 12, color: theme.mutedForeground }}>
											{p.role === 'host' ? 'Host' : 'Co-host'}
										</Text>
									</Pressable>
								))}
							</View>
						)}

						{/* Genres */}
						{show?.genres && show.genres.length > 0 && (
							<View style={{ gap: 10 }}>
								<Text
									style={{ fontSize: 13, fontWeight: '600', color: theme.mutedForeground, textTransform: 'uppercase', letterSpacing: 0.5 }}
									accessibilityRole="header"
								>
									Genres
								</Text>
								<View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>
									{show.genres.map((g) => (
										<Badge key={g.id} label={g.name} size="md" />
									))}
								</View>
							</View>
						)}

						{/* Recurring Schedule */}
						{schedule?.slots && schedule.slots.length > 0 && (
							<View style={{ gap: 10 }}>
								<Text
									style={{ fontSize: 13, fontWeight: '600', color: theme.mutedForeground, textTransform: 'uppercase', letterSpacing: 0.5 }}
									accessibilityRole="header"
								>
									On Air
								</Text>
								{schedule.slots.map((s) => (
									<View
										key={`${s.day_of_week}-${s.start_time}`}
										style={{
											flexDirection: 'row',
											justifyContent: 'space-between',
											alignItems: 'center',
											padding: 12,
											backgroundColor: theme.secondary,
											borderRadius: 10,
											borderCurve: 'continuous',
										}}
									>
										<Text style={{ fontSize: 15, fontWeight: '500', color: theme.foreground }}>
											{DAY_NAMES[s.day_of_week] ?? s.day_name ?? `Day ${s.day_of_week}`}
										</Text>
										<Text style={{ fontSize: 14, color: theme.mutedForeground, fontVariant: ['tabular-nums'] }}>
											{formatTime(s.start_time)} – {formatTime(s.end_time)}
										</Text>
									</View>
								))}
							</View>
						)}
					</ScrollView>
				</View>
			</Modal>

			{/* Nested presenter detail */}
			<PresenterDetail
				visible={!!presenterSlug}
				onClose={() => setPresenterSlug(null)}
				presenterSlug={presenterSlug}
			/>
		</>
	)
}
