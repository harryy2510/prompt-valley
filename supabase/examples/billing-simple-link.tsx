/**
 * Simple Billing Page Example - Using Direct Links
 *
 * This approach uses simple <a> links that redirect through your Edge Functions.
 * Much simpler than the server function approach!
 */

import { createFileRoute } from '@tanstack/react-router'
import { getSupabaseClient } from '~/lib/supabase'
import { useState, useEffect } from 'react'

// Define your Stripe price IDs (get these from Stripe Dashboard)
const STRIPE_PRICES = {
  monthly: 'price_xxxxx', // Replace with your monthly price ID
  yearly: 'price_yyyyy',  // Replace with your yearly price ID
} as const

export const Route = createFileRoute('/billing')({
  component: BillingPage,
})

function BillingPage() {
  const supabase = getSupabaseClient()
  const [session, setSession] = useState<any>(null)
  const [billingInfo, setBillingInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load session and billing info
    const loadData = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)

      if (session) {
        const { data } = await supabase.rpc('get_user_billing_info', {
          user_id_param: session.user.id,
        })
        setBillingInfo(data)
      }
      setLoading(false)
    }

    loadData()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!session) {
    return <div>Please log in to view billing</div>
  }

  // Construct the Edge Function URLs with auth token
  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
  const accessToken = session.access_token

  // Checkout URL with price ID and auth token
  const getCheckoutUrl = (priceId: string) => {
    return `${SUPABASE_URL}/functions/v1/create-checkout-session?priceId=${priceId}&apikey=${import.meta.env.VITE_SUPABASE_ANON_KEY}&Authorization=${encodeURIComponent(`Bearer ${accessToken}`)}`
  }

  // Portal URL with auth token
  const portalUrl = `${SUPABASE_URL}/functions/v1/create-portal-session?apikey=${import.meta.env.VITE_SUPABASE_ANON_KEY}&Authorization=${encodeURIComponent(`Bearer ${accessToken}`)}`

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Billing & Subscription</h1>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Current Plan</h2>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Tier:</span>
            <span className="font-medium capitalize">{billingInfo?.tier || 'free'}</span>
          </div>

          {billingInfo?.subscription_status && (
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
            </>
          )}
        </div>
      </div>

      {billingInfo?.tier === 'free' ? (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Upgrade to Pro</h2>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Monthly Plan */}
            <div className="border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">Monthly</h3>
              <p className="text-3xl font-bold mb-4">$10<span className="text-sm text-gray-600">/mo</span></p>
              <a
                href={getCheckoutUrl(STRIPE_PRICES.monthly)}
                className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center font-semibold py-3 px-6 rounded-lg"
              >
                Subscribe Monthly
              </a>
            </div>

            {/* Yearly Plan */}
            <div className="border-2 border-blue-500 rounded-lg p-6 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                Best Value
              </div>
              <h3 className="text-lg font-semibold mb-2">Yearly</h3>
              <p className="text-3xl font-bold mb-4">
                $100<span className="text-sm text-gray-600">/yr</span>
                <span className="text-sm text-green-600 ml-2">(Save 17%)</span>
              </p>
              <a
                href={getCheckoutUrl(STRIPE_PRICES.yearly)}
                className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center font-semibold py-3 px-6 rounded-lg"
              >
                Subscribe Yearly
              </a>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <a
            href={portalUrl}
            className="block w-full bg-gray-600 hover:bg-gray-700 text-white text-center font-semibold py-3 px-6 rounded-lg"
          >
            Manage Subscription
          </a>
          <p className="text-sm text-gray-500 text-center">
            Update payment method, view invoices, or cancel subscription
          </p>
        </div>
      )}
    </div>
  )
}

/**
 * ALTERNATIVE: Using buttons with window.location (if you prefer)
 */

function BillingPageWithButtons() {
  const handleCheckout = (priceId: string) => {
    const supabase = getSupabaseClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout-session?priceId=${priceId}`
        window.location.href = url
      }
    })
  }

  const handleManageSubscription = () => {
    const supabase = getSupabaseClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-portal-session`
        window.location.href = url
      }
    })
  }

  return (
    <div>
      <button onClick={() => handleCheckout(STRIPE_PRICES.monthly)}>
        Subscribe Monthly
      </button>
      <button onClick={handleManageSubscription}>
        Manage Subscription
      </button>
    </div>
  )
}
