// ============================================================================
// BILLING PAGE EXAMPLE
// Shows subscription status, renewal date, and manage subscription button
// ============================================================================

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface BillingInfo {
  tier: 'free' | 'pro'
  stripe_customer_id: string | null
  subscription_status: string | null
  current_period_start: string | null
  current_period_end: string | null
  cancel_at_period_end: boolean
  canceled_at: string | null
  is_active: boolean
  days_until_renewal: number | null
}

export default function BillingPage() {
  const [billingInfo, setBillingInfo] = useState<BillingInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBillingInfo()
  }, [])

  const fetchBillingInfo = async () => {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return

    // Call the database function to get billing info
    const { data, error } = await supabase.rpc('get_user_billing_info', {
      user_id_param: user.id
    })

    if (error) {
      console.error('Error fetching billing info:', error)
    } else {
      setBillingInfo(data)
    }

    setLoading(false)
  }

  const handleManageSubscription = async () => {
    // Call your backend to create a Stripe Customer Portal session
    const response = await fetch('/api/create-portal-session', {
      method: 'POST',
    })

    const { url } = await response.json()
    window.location.href = url
  }

  const handleUpgrade = async () => {
    // Call your backend to create a Stripe Checkout session
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
    })

    const { url } = await response.json()
    window.location.href = url
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (!billingInfo) {
    return <div>Error loading billing information</div>
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Billing</h1>

      {/* Current Plan */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Current Plan</h2>

        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-2xl font-bold capitalize">{billingInfo.tier}</p>
            {billingInfo.tier === 'free' && (
              <p className="text-gray-600">Limited access to prompts</p>
            )}
            {billingInfo.tier === 'pro' && (
              <p className="text-gray-600">Full access to all prompts</p>
            )}
          </div>

          {billingInfo.tier === 'free' ? (
            <button
              onClick={handleUpgrade}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Upgrade to Pro
            </button>
          ) : (
            <button
              onClick={handleManageSubscription}
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
            >
              Manage Subscription
            </button>
          )}
        </div>
      </div>

      {/* Subscription Details (only show for pro users) */}
      {billingInfo.tier === 'pro' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Subscription Details</h2>

          {/* Status */}
          <div className="mb-4">
            <p className="text-sm text-gray-600">Status</p>
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  billingInfo.is_active
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {billingInfo.subscription_status}
              </span>
              {billingInfo.cancel_at_period_end && (
                <span className="text-sm text-orange-600">
                  (Cancels at period end)
                </span>
              )}
            </div>
          </div>

          {/* Renewal Date */}
          {billingInfo.current_period_end && (
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                {billingInfo.cancel_at_period_end ? 'Access until' : 'Next billing date'}
              </p>
              <p className="text-lg font-medium">
                {new Date(billingInfo.current_period_end).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              {billingInfo.days_until_renewal !== null && (
                <p className="text-sm text-gray-600">
                  {billingInfo.cancel_at_period_end
                    ? `${billingInfo.days_until_renewal} days of access remaining`
                    : `${billingInfo.days_until_renewal} days until renewal`}
                </p>
              )}
            </div>
          )}

          {/* Canceled Info */}
          {billingInfo.canceled_at && (
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                Subscription canceled on{' '}
                {new Date(billingInfo.canceled_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          )}

          {/* Manage Subscription Note */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              To update your payment method, change your plan, or cancel your subscription,
              click "Manage Subscription" above. You'll be redirected to Stripe's secure portal.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
