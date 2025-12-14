import { queryOptions, useQuery, useMutation } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { getSupabaseServerClient } from '@/libs/supabase/server'
import type { Tables } from '@/types/database.types'
import Stripe from 'stripe'
import { z } from 'zod'

// ============================================
// Types
// ============================================

export type StripeProduct = Tables<'stripe_products'>
export type StripePrice = Tables<'stripe_prices'>
export type StripeCoupon = Tables<'stripe_coupons'>

export type StripeProductWithPricesAndCoupon = StripeProduct & {
  prices: StripePrice[]
  coupon?: StripeCoupon | null
}

// ============================================
// Server Functions
// ============================================

export const fetchStripeProduct = createServerFn({ method: 'GET' }).handler(
  async () => {
    const supabase = getSupabaseServerClient()

    // Fetch the first active product (ordered by display_order)
    const { data: product, error: productError } = await supabase
      .from('stripe_products')
      .select(
        `
        *,
        prices:stripe_prices(*)
      `,
      )
      .eq('active', true)
      .order('display_order', { ascending: true, nullsFirst: false })
      .limit(1)
      .single()

    if (productError) throw productError

    // Fetch active coupon that applies to this product
    const { data: coupon } = await supabase
      .from('stripe_coupons')
      .select('*')
      .eq('valid', true)
      .or(`applies_to_products.cs.{${product.id}},applies_to_products.is.null`)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    return {
      ...product,
      coupon: coupon ?? null,
    } as StripeProductWithPricesAndCoupon
  },
)

// ============================================
// Query Keys
// ============================================

export const stripeKeys = {
  product: () => ['stripe', 'product'] as const,
}

// ============================================
// Query Options (for loaders)
// ============================================

export function stripeProductQueryOptions() {
  return queryOptions({
    queryKey: stripeKeys.product(),
    queryFn: () => fetchStripeProduct(),
  })
}

// ============================================
// Hooks
// ============================================

export function useStripeProduct() {
  return useQuery(stripeProductQueryOptions())
}

// ============================================
// Checkout Types
// ============================================

type CheckoutInput = {
  priceId: string
  couponId?: string
}

// ============================================
// Checkout Schema
// ============================================

const checkoutSchema = z.object({
  priceId: z.string(),
  couponId: z.string().optional(),
})

// ============================================
// Stripe Checkout Server Function
// ============================================

const getStripe = () =>
  new Stripe(process.env.STRIPE_SECRET_KEY!)

export const createCheckoutSession = createServerFn({ method: 'POST' })
  .inputValidator(checkoutSchema)
  .handler(async ({ data }) => {
    const stripe = getStripe()
    const supabase = getSupabaseServerClient()

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error('You must be logged in to subscribe')
    }

    // Build checkout session params
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: data.priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.SITE_URL}/dashboard?checkout=success`,
      cancel_url: `${process.env.SITE_URL}/pricing?checkout=cancelled`,
      customer_email: user.email,
      client_reference_id: user.id,
      metadata: {
        user_id: user.id,
      },
      subscription_data: {
        metadata: {
          user_id: user.id,
        },
      },
    }

    // Apply coupon if provided
    if (data.couponId) {
      sessionParams.discounts = [{ coupon: data.couponId }]
    }

    const session = await stripe.checkout.sessions.create(sessionParams)

    return { url: session.url }
  })

// ============================================
// Checkout Hook
// ============================================

export function useCreateCheckoutSession() {
  return useMutation({
    mutationFn: (input: CheckoutInput) =>
      createCheckoutSession({ data: input }),
    onSuccess: (result: { url: string | null }) => {
      if (result.url) {
        window.location.href = result.url
      }
    },
  })
}
