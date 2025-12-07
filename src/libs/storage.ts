import { getSupabaseBrowserClient } from '@/libs/supabase/client'

/**
/**
 * Get the display URL for an image - handles both full URLs and bucket paths
 * @param value - Either a full URL or a path within the content-bucket
 * @returns The full public URL or null if value is empty
 */
export function getImageUrl(value: null | string | undefined): null | string {
	if (!value) return null

	// If it's already a full URL, return as-is
	if (isFullUrl(value)) {
		return value
	}

	// Use Supabase browser client to get public URL
	const supabase = getSupabaseBrowserClient()
	const { data } = supabase.storage.from('content-bucket').getPublicUrl(value)
	return data.publicUrl
}

/**
 * Check if a string is a full URL (http/https)
 */
export function isFullUrl(value: null | string | undefined): boolean {
	if (!value) return false
	return value.startsWith('http://') || value.startsWith('https://')
}

