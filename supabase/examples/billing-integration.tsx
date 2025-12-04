/**
 * TanStack Start Billing Integration Example
 *
 * This example shows how to integrate Stripe Checkout and Customer Portal
 * into your TanStack Start application.
 */

import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/start'
import { getSupabaseClient } from '~/lib/supabase' // Adjust path as needed
import { useState } from 'react'

// ============================================================================
// SERVER FUNCTIONS
// ============================================================================

/**
 * Create a Stripe Checkout session
 * This runs on the server to keep your Supabase function URL secure
 */
const createCheckoutSession = createServerFn({ method: 'POST' })
  .validator((data: { priceId: string }) => data)
  .handler(async ({ data }) => {
    const supabase = getSupabaseClient()

    // Get current user session
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      throw new Error('Unauthorized')
    }

    // Call your Supabase Edge Function with the price ID
    const response = await fetch(
      `${process.env.SUPABASE_URL}/functions/v1/create-checkout-session`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId: data.priceId }),
      }
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to create checkout session')
    }

    const data = await response.json()
    return data.url
  })

/**
 * Create a Stripe Customer Portal session
 * This runs on the server to keep your Supabase function URL secure
 */
const createPortalSession = createServerFn({ method: 'POST' })
  .handler(async () => {
    const supabase = getSupabaseClient()

    // Get current user session
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      throw new Error('Unauthorized')
    }

    // Call your Supabase Edge Function
    const response = await fetch(
      `${process.env.SUPABASE_URL}/functions/v1/create-portal-session`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to create portal session')
    }

    const data = await response.json()
    return data.url
  })

/**
 * Get user's billing information
 */
const getBillingInfo = createServerFn({ method: 'GET' })
  .handler(async () => {
    const supabase = getSupabaseClient()

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      throw new Error('Unauthorized')
    }

    // Call the get_user_billing_info function
    const { data, error } = await supabase
      .rpc('get_user_billing_info', { user_id_param: user.id })

    if (error) {
      throw new Error(error.message)
    }

    return data
  })

// ============================================================================
// ROUTE DEFINITION
// ============================================================================

export const Route = createFileRoute('/billing')({
  component: BillingPage,
  loader: async () => {
    // Load billing info on page load
    const billingInfo = await getBillingInfo()
    return { billingInfo }
  },
})

// ============================================================================
// COMPONENT
// ============================================================================

// Define your Stripe price IDs (get these from Stripe Dashboard)
const STRIPE_PRICES = {
  monthly: 'price_xxxxx', // Replace with your monthly price ID
  yearly: 'price_yyyyy',  // Replace with your yearly price ID
} as const

function BillingPage() {
  const { billingInfo } = Route.useLoaderData()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedPrice, setSelectedPrice] = useState<'monthly' | 'yearly'>('monthly')

  /**
   * Handle upgrade to Pro
   */
  const handleUpgrade = async (priceId: string) => {
    try {
      setLoading(true)
      setError(null)

      // Create checkout session and get redirect URL
      const checkoutUrl = await createCheckoutSession({ data: { priceId } })

      // Redirect to Stripe Checkout
      window.location.href = checkoutUrl
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start checkout')
      setLoading(false)
    }
  }

  /**
   * Handle manage subscription (opens Customer Portal)
   */
  const handleManageSubscription = async () => {
    try {
      setLoading(true)
      setError(null)

      // Create portal session and get redirect URL
      const portalUrl = await createPortalSession()

      // Redirect to Stripe Customer Portal
      window.location.href = portalUrl
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to open portal')
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Billing & Subscription</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Current Plan</h2>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Tier:</span>
            <span className="font-medium capitalize">{billingInfo.tier}</span>
          </div>

          {billingInfo.subscription_status && (
            <>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="font-medium capitalize">
                  {billingInfo.subscription_status}
                </span>
              </div>

              {billingInfo.current_period_end && (
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {billingInfo.cancel_at_period_end ? 'Expires on:' : 'Renews on:'}
                  </span>
                  <span className="font-medium">
                    {new Date(billingInfo.current_period_end).toLocaleDateString()}
                  </span>
                </div>
              )}

              {billingInfo.days_until_renewal !== null && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Days remaining:</span>
                  <span className="font-medium">{billingInfo.days_until_renewal}</span>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {billingInfo.tier === 'free' ? (
          <button
            onClick={handleUpgrade}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : 'Upgrade to Pro'}
          </button>
        ) : (
          <button
            onClick={handleManageSubscription}
            disabled={loading}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : 'Manage Subscription'}
          </button>
        )}
      </div>

      <div className="mt-6 text-sm text-gray-500">
        <p>
          {billingInfo.tier === 'free' ? (
            <>
              Upgrade to Pro to unlock unlimited access to all prompts and features.
            </>
          ) : (
            <>
              You can update your payment method, view invoices, or cancel your subscription
              in the Customer Portal.
            </>
          )}
        </p>
      </div>
    </div>
  )
}

// ============================================================================
// ALTERNATIVE: CLIENT-SIDE ONLY APPROACH (if you prefer)
// ============================================================================

/**
 * If you prefer to call the Supabase functions directly from the client,
 * you can use this approach instead. Note that your function URLs will be
 * visible in the browser network tab.
 */

export function BillingPageClientSide() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleUpgradeClientSide = async () => {
    try {
      setLoading(true)
      setError(null)

      const supabase = getSupabaseClient()
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        throw new Error('You must be logged in')
      }

      const response = await fetch(
        `${process.env.SUPABASE_URL}/functions/v1/create-checkout-session`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error('Failed to create checkout session')
      }

      const { url } = await response.json()
      window.location.href = url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setLoading(false)
    }
  }

  const handleManageSubscriptionClientSide = async () => {
    try {
      setLoading(true)
      setError(null)

      const supabase = getSupabaseClient()
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        throw new Error('You must be logged in')
      }

      const response = await fetch(
        `${process.env.SUPABASE_URL}/functions/v1/create-portal-session`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error('Failed to create portal session')
      }

      const { url } = await response.json()
      window.location.href = url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setLoading(false)
    }
  }

  // ... rest of component
}
