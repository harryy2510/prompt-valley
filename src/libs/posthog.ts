import posthog from 'posthog-js'

// ============================================
// PostHog Configuration
// ============================================

const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY
const POSTHOG_HOST = import.meta.env.VITE_POSTHOG_HOST

let initialized = false

export function initPostHog() {
  if (typeof window === 'undefined' || initialized || !POSTHOG_KEY) {
    return
  }

  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    person_profiles: 'always',
    capture_pageview: true,
    capture_pageleave: true,
    autocapture: true,
    persistence: 'localStorage+cookie',
    disable_session_recording: false,
  })

  initialized = true
}

// ============================================
// User Identification
// ============================================

export function identifyUser(
  userId: string,
  properties?: {
    email?: string
    name?: string
    tier?: 'free' | 'pro'
    [key: string]: unknown
  },
) {
  if (typeof window === 'undefined') return

  posthog.identify(userId, properties)
}

export function resetUser() {
  if (typeof window === 'undefined') return

  posthog.reset()
}

export function setUserProperties(properties: Record<string, unknown>) {
  if (typeof window === 'undefined') return

  posthog.people.set(properties)
}

// ============================================
// Event Tracking
// ============================================

// Auth Events
export const trackSignUpStarted = (method: 'email') => {
  posthog.capture('sign_up_started', { method })
}

export const trackSignUpCompleted = (method: 'email') => {
  posthog.capture('sign_up_completed', { method })
}

export const trackSignInStarted = (method: 'email') => {
  posthog.capture('sign_in_started', { method })
}

export const trackSignInCompleted = (method: 'email') => {
  posthog.capture('sign_in_completed', { method })
}

export const trackSignOut = () => {
  posthog.capture('sign_out')
}

// Prompt Events
export const trackPromptViewed = (
  promptId: string,
  promptTitle: string,
  tier: string,
) => {
  posthog.capture('prompt_viewed', {
    prompt_id: promptId,
    prompt_title: promptTitle,
    tier,
  })
}

export const trackPromptCopied = (
  promptId: string,
  promptTitle: string,
  tier: string,
) => {
  posthog.capture('prompt_copied', {
    prompt_id: promptId,
    prompt_title: promptTitle,
    tier,
  })
}

export const trackPromptLiked = (promptId: string) => {
  posthog.capture('prompt_liked', { prompt_id: promptId })
}

export const trackPromptUnliked = (promptId: string) => {
  posthog.capture('prompt_unliked', { prompt_id: promptId })
}

export const trackPromptSaved = (promptId: string) => {
  posthog.capture('prompt_saved', { prompt_id: promptId })
}

export const trackPromptUnsaved = (promptId: string) => {
  posthog.capture('prompt_unsaved', { prompt_id: promptId })
}

// Search Events
export const trackSearch = (query: string, resultsCount: number) => {
  posthog.capture('search_performed', {
    query,
    results_count: resultsCount,
  })
}

// Category/Tag Events
export const trackCategoryViewed = (
  categoryId: string,
  categoryName: string,
) => {
  posthog.capture('category_viewed', {
    category_id: categoryId,
    category_name: categoryName,
  })
}

export const trackTagViewed = (tagId: string, tagName: string) => {
  posthog.capture('tag_viewed', {
    tag_id: tagId,
    tag_name: tagName,
  })
}

export const trackModelViewed = (modelId: string, modelName: string) => {
  posthog.capture('model_viewed', {
    model_id: modelId,
    model_name: modelName,
  })
}

// Pricing/Subscription Events
export const trackPricingViewed = () => {
  posthog.capture('pricing_viewed')
}

export const trackCheckoutStarted = (priceId: string, amount?: number) => {
  posthog.capture('checkout_started', {
    price_id: priceId,
    amount,
  })
}

export const trackCheckoutCompleted = (priceId: string, amount?: number) => {
  posthog.capture('checkout_completed', {
    price_id: priceId,
    amount,
  })
}

export const trackUpgradeModalOpened = (source: string) => {
  posthog.capture('upgrade_modal_opened', { source })
}

// Contact Events
export const trackContactFormSubmitted = () => {
  posthog.capture('contact_form_submitted')
}

// Generic capture for custom events
export const trackEvent = (
  eventName: string,
  properties?: Record<string, unknown>,
) => {
  posthog.capture(eventName, properties)
}

// ============================================
// Feature Flags
// ============================================

export const isFeatureEnabled = (flagKey: string): boolean => {
  if (typeof window === 'undefined') return false
  return posthog.isFeatureEnabled(flagKey) ?? false
}

export const getFeatureFlag = (
  flagKey: string,
): string | boolean | undefined => {
  if (typeof window === 'undefined') return undefined
  return posthog.getFeatureFlag(flagKey)
}

// Export the posthog instance for advanced usage
export { posthog }
