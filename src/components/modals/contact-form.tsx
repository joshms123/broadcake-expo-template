import React, { useState } from 'react'
import {
	View,
	Text,
	TextInput,
	Pressable,
	ScrollView,
	Modal,
	ActivityIndicator,
	KeyboardAvoidingView,
} from 'react-native'
import * as Haptics from 'expo-haptics'
import { useTheme } from '@/contexts/theme-context'
import { useForm } from '@/hooks/use-form'
import { getClient } from '@/lib/sdk'
import type { FormField } from '@techcake/broadcake-sdk'

interface ContactFormProps {
	visible: boolean
	onClose: () => void
	formSlug: string
}

export function ContactForm({ visible, onClose, formSlug }: ContactFormProps) {
	const { theme } = useTheme()
	const { data: form, isLoading } = useForm(visible ? formSlug : null)
	const [values, setValues] = useState<Record<string, string>>({})
	const [errors, setErrors] = useState<Record<string, string>>({})
	const [generalError, setGeneralError] = useState<string | null>(null)
	const [submitting, setSubmitting] = useState(false)
	const [submitted, setSubmitted] = useState(false)

	const setValue = (fieldId: string, value: string) => {
		setValues((prev) => ({ ...prev, [fieldId]: value }))
		setErrors((prev) => {
			const next = { ...prev }
			delete next[fieldId]
			return next
		})
	}

	const handleSubmit = async () => {
		if (!form) return

		// Client-side required field validation
		const fieldErrors: Record<string, string> = {}
		for (const field of form.fields) {
			if (field.required && field.type !== 'hidden') {
				const val = values[field.id]?.trim()
				if (!val) {
					fieldErrors[field.id] = `${field.label} is required`
				}
			}
		}
		if (Object.keys(fieldErrors).length > 0) {
			setErrors(fieldErrors)
			return
		}

		setSubmitting(true)
		setGeneralError(null)
		setErrors({})

		try {
			const result = await getClient().submitForm(formSlug, values)
			if (result.success) {
				if (process.env.EXPO_OS === 'ios') {
					Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
				}
				setSubmitted(true)
			} else if (result.field_errors) {
				setErrors(result.field_errors)
			} else {
				setGeneralError(result.error ?? 'Something went wrong.')
			}
		} catch {
			setGeneralError('Failed to submit. Please try again.')
		} finally {
			setSubmitting(false)
		}
	}

	const handleClose = () => {
		setValues({})
		setErrors({})
		setGeneralError(null)
		setSubmitted(false)
		onClose()
	}

	const renderField = (field: FormField) => {
		const error = errors[field.id]

		if (field.type === 'hidden') return null

		return (
			<View key={field.id} style={{ gap: 6 }}>
				<Text style={{ fontSize: 14, fontWeight: '500', color: theme.foreground }}>
					{field.label}
					{field.required && <Text style={{ color: theme.destructiveForeground }}> *</Text>}
				</Text>
				{field.description && (
					<Text style={{ fontSize: 13, color: theme.mutedForeground }}>
						{field.description}
					</Text>
				)}

				{field.type === 'textarea' ? (
					<TextInput
						value={values[field.id] ?? ''}
						onChangeText={(text) => setValue(field.id, text)}
						placeholder={field.placeholder}
						placeholderTextColor={theme.mutedForeground}
						editable={!submitting}
						multiline
						numberOfLines={4}
						textAlignVertical="top"
						style={{
							borderWidth: 1,
							borderColor: error ? theme.destructiveForeground : theme.input,
							borderRadius: 8,
							borderCurve: 'continuous',
							padding: 12,
							fontSize: 15,
							color: theme.foreground,
							backgroundColor: theme.background,
							minHeight: 100,
						}}
						accessibilityLabel={field.label}
					/>
				) : (
					<TextInput
						value={values[field.id] ?? ''}
						onChangeText={(text) => setValue(field.id, text)}
						placeholder={field.placeholder}
						placeholderTextColor={theme.mutedForeground}
						editable={!submitting}
						keyboardType={
							field.type === 'email' ? 'email-address'
							: field.type === 'number' ? 'numeric'
							: field.type === 'phone' ? 'phone-pad'
							: field.type === 'url' ? 'url'
							: 'default'
						}
						autoCapitalize={field.type === 'email' || field.type === 'url' ? 'none' : 'sentences'}
						style={{
							borderWidth: 1,
							borderColor: error ? theme.destructiveForeground : theme.input,
							borderRadius: 8,
							borderCurve: 'continuous',
							padding: 12,
							fontSize: 15,
							color: theme.foreground,
							backgroundColor: theme.background,
						}}
						accessibilityLabel={field.label}
					/>
				)}

				{error && (
					<Text
						style={{ fontSize: 13, color: theme.destructiveForeground }}
						accessibilityRole="alert"
					>
						{error}
					</Text>
				)}
			</View>
		)
	}

	return (
		<Modal
			visible={visible}
			animationType="slide"
			presentationStyle="formSheet"
			onRequestClose={handleClose}
		>
			<KeyboardAvoidingView
				behavior="padding"
				style={{ flex: 1, backgroundColor: theme.background }}
			>
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
					<Text style={{ fontSize: 17, fontWeight: '600', color: theme.foreground }}>
						{form?.name ?? 'Contact'}
					</Text>
					<Pressable
						onPress={handleClose}
						accessibilityRole="button"
						accessibilityLabel="Close form"
						hitSlop={12}
					>
						<Text style={{ fontSize: 15, color: theme.primary, fontWeight: '500' }}>
							Close
						</Text>
					</Pressable>
				</View>

				<ScrollView
					contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 32 }}
					keyboardShouldPersistTaps="handled"
				>
					{isLoading ? (
						<ActivityIndicator size="large" color={theme.primary} style={{ marginTop: 32 }} />
					) : submitted ? (
						<View style={{ alignItems: 'center', gap: 12, paddingTop: 32 }}>
							<Text style={{ fontSize: 20, fontWeight: '600', color: theme.foreground }}>
								{form?.success_message ?? 'Thank you!'}
							</Text>
							<Text style={{ fontSize: 15, color: theme.mutedForeground, textAlign: 'center' }}>
								Your message has been sent.
							</Text>
							<Pressable
								onPress={handleClose}
								accessibilityRole="button"
								style={{
									paddingHorizontal: 24,
									paddingVertical: 12,
									backgroundColor: theme.primary,
									borderRadius: 8,
									borderCurve: 'continuous',
									marginTop: 8,
								}}
							>
								<Text style={{ color: theme.primaryForeground, fontWeight: '500' }}>
									Done
								</Text>
							</Pressable>
						</View>
					) : (
						<>
							{form?.description && (
								<Text style={{ fontSize: 14, color: theme.mutedForeground }}>
									{form.description}
								</Text>
							)}

							{generalError && (
								<View
									style={{
										backgroundColor: theme.dangerBg,
										padding: 12,
										borderRadius: 8,
										borderCurve: 'continuous',
									}}
								>
									<Text style={{ color: theme.dangerText }} accessibilityRole="alert">
										{generalError}
									</Text>
								</View>
							)}

							{form?.fields.map(renderField)}

							<Pressable
								onPress={handleSubmit}
								disabled={submitting}
								accessibilityRole="button"
								accessibilityLabel="Submit form"
								accessibilityState={{ disabled: submitting }}
								style={{
									paddingVertical: 14,
									backgroundColor: submitting ? theme.muted : theme.primary,
									borderRadius: 10,
									borderCurve: 'continuous',
									alignItems: 'center',
									marginTop: 8,
								}}
							>
								{submitting ? (
									<ActivityIndicator size="small" color={theme.primaryForeground} />
								) : (
									<Text style={{ fontSize: 16, fontWeight: '600', color: theme.primaryForeground }}>
										Send
									</Text>
								)}
							</Pressable>
						</>
					)}
				</ScrollView>
			</KeyboardAvoidingView>
		</Modal>
	)
}
