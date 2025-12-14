import { queryOptions, useQuery, useMutation } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { getSupabaseServerClient } from '@/libs/supabase/server'
import { supabaseInvoke } from '@/libs/supabase/client'
import type { Tables } from '@/types/database.types'

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

    // Fetch active coupon that applies to this product (or all products)
    // Coupon applies if: contains this product ID, is null, or is empty array
    const { data: coupon } = await supabase
      .from('stripe_coupons')
      .select('*')
      .eq('valid', true)
      .or(
        `applies_to_products.cs.{${product.id}},applies_to_products.is.null,applies_to_products.eq.{}`,
      )
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
// Checkout Hook (calls Edge Function)
// ============================================

export function useCreateCheckoutSession() {
  return useMutation({
    mutationFn: async (input: CheckoutInput) => {
      return supabaseInvoke<{ url: string }>('create-checkout-session', {
        priceId: input.priceId,
        couponId: input.couponId,
      })
    },
    onSuccess: (result) => {
      if (result?.url) {
        window.location.href = result.url
      }
    },
  })
}
