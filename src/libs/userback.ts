import Userback, { type UserbackWidget } from '@userback/widget'

// ============================================
// Userback Configuration
// ============================================

const USERBACK_TOKEN = import.meta.env.VITE_USERBACK_TOKEN

let userbackInstance: UserbackWidget | null = null

export async function initUserback() {
  if (typeof window === 'undefined' || userbackInstance || !USERBACK_TOKEN) {
    return
  }

  try {
    userbackInstance = await Userback(USERBACK_TOKEN)
  } catch (error) {
    console.error('[Userback] Failed to initialize:', error)
  }
}

// ============================================
// User Identification
// ============================================

export function identifyUserback(
  userId: string,
  userData: {
    name?: string
    email?: string
    tier?: string
    [key: string]: unknown
  },
) {
  if (!userbackInstance) return

  userbackInstance.identify(userId, {
    name: userData.name,
    email: userData.email,
    ...userData,
  })
}

export async function resetUserback() {
  if (!userbackInstance || !USERBACK_TOKEN) return

  // Destroy and reinitialize without user data
  userbackInstance.destroy()
  userbackInstance = await Userback(USERBACK_TOKEN)
}

// ============================================
// Feedback & Announcements
// ============================================

export function openFeedback() {
  if (!userbackInstance) return

  userbackInstance.open('general')
}

export function openBugReport() {
  if (!userbackInstance) return

  userbackInstance.open('bug')
}

export function openFeatureRequest() {
  if (!userbackInstance) return

  userbackInstance.open('feature_request')
}

export function openAnnouncements() {
  if (!userbackInstance) return

  // Show the widget for announcements
  userbackInstance.show()
}

export function showUserbackWidget() {
  if (!userbackInstance) return

  userbackInstance.show()
}

export function hideUserbackWidget() {
  if (!userbackInstance) return

  userbackInstance.hide()
}
