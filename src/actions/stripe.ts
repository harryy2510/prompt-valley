import { queryOptions, useQuery } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { getSupabaseServerClient } from '@/libs/supabase/server'
import type { Tables } from '@/types/database.types'

// ============================================
// Types
// ============================================

export type StripeProduct = Tables<'stripe_products'>
export type StripePrice = Tables<'stripe_prices'>
export type StripeCoupon = Tables<'stripe_coupons'>
export type StripePromotionCode = Tables<'stripe_promotion_codes'>

export type StripeProductWithPrices = StripeProduct & {
  prices: StripePrice[]
}

export type StripeProductWithPricesAndCoupon = StripeProductWithPrices & {
  coupon?: StripeCoupon | null
}

// ============================================
// Server Functions
// ============================================

export const fetchActiveProducts = createServerFn({ method: 'GET' }).handler(
  async () => {
    const supabase = getSupabaseServerClient()

    const { data, error } = await supabase
      .from('stripe_products')
      .select(`
        *,
        prices:stripe_prices(*)
      `)
      .eq('active', true)
      .order('display_order', { ascending: true, nullsFirst: false })

    if (error) throw error
    return data as StripeProductWithPrices[]
  },
)

export const fetchProductById = createServerFn({ method: 'GET' })
  .inputValidator((id: string) => id)
  .handler(async ({ data: id }) => {
    const supabase = getSupabaseServerClient()

    const { data, error } = await supabase
      .from('stripe_products')
      .select(`
        *,
        prices:stripe_prices(*)
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data as StripeProductWithPrices
  })

export const fetchPrimaryProduct = createServerFn({ method: 'GET' }).handler(
  async () => {
    const supabase = getSupabaseServerClient()

    // Fetch the first active product (ordered by display_order)
    const { data: product, error: productError } = await supabase
      .from('stripe_products')
      .select(`
        *,
        prices:stripe_prices(*)
      `)
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

export const fetchActiveCoupons = createServerFn({ method: 'GET' }).handler(
  async () => {
    const supabase = getSupabaseServerClient()

    const { data, error } = await supabase
      .from('stripe_coupons')
      .select('*')
      .eq('valid', true)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as StripeCoupon[]
  },
)

export const fetchCouponByCode = createServerFn({ method: 'GET' })
  .inputValidator((code: string) => code)
  .handler(async ({ data: code }) => {
    const supabase = getSupabaseServerClient()

    // Look up promotion code first
    const { data: promoCode, error: promoError } = await supabase
      .from('stripe_promotion_codes')
      .select(`
        *,
        coupon:stripe_coupons(*)
      `)
      .eq('code', code)
      .eq('active', true)
      .single()

    if (promoError) throw promoError

    return promoCode as StripePromotionCode & { coupon: StripeCoupon }
  })

export const fetchPricesByProductId = createServerFn({ method: 'GET' })
  .inputValidator((productId: string) => productId)
  .handler(async ({ data: productId }) => {
    const supabase = getSupabaseServerClient()

    const { data, error } = await supabase
      .from('stripe_prices')
      .select('*')
      .eq('product_id', productId)
      .eq('active', true)
      .order('unit_amount', { ascending: true })

    if (error) throw error
    return data as StripePrice[]
  })

// ============================================
// Query Keys
// ============================================

export const stripeKeys = {
  all: ['stripe'] as const,
  products: () => [...stripeKeys.all, 'products'] as const,
  product: (id: string) => [...stripeKeys.products(), id] as const,
  primaryProduct: () => [...stripeKeys.all, 'primary-product'] as const,
  prices: () => [...stripeKeys.all, 'prices'] as const,
  pricesByProduct: (productId: string) =>
    [...stripeKeys.prices(), productId] as const,
  coupons: () => [...stripeKeys.all, 'coupons'] as const,
  couponByCode: (code: string) => [...stripeKeys.coupons(), code] as const,
}

// ============================================
// Query Options (for loaders)
// ============================================

export function activeProductsQueryOptions() {
  return queryOptions({
    queryKey: stripeKeys.products(),
    queryFn: () => fetchActiveProducts(),
    staleTime: 1000 * 60 * 10, // 10 minutes - products don't change often
  })
}

export function productQueryOptions(id: string) {
  return queryOptions({
    queryKey: stripeKeys.product(id),
    queryFn: () => fetchProductById({ data: id }),
    staleTime: 1000 * 60 * 10,
  })
}

export function primaryProductQueryOptions() {
  return queryOptions({
    queryKey: stripeKeys.primaryProduct(),
    queryFn: () => fetchPrimaryProduct(),
    staleTime: 1000 * 60 * 10,
  })
}

export function activeCouponsQueryOptions() {
  return queryOptions({
    queryKey: stripeKeys.coupons(),
    queryFn: () => fetchActiveCoupons(),
    staleTime: 1000 * 60 * 10,
  })
}

export function couponByCodeQueryOptions(code: string) {
  return queryOptions({
    queryKey: stripeKeys.couponByCode(code),
    queryFn: () => fetchCouponByCode({ data: code }),
    staleTime: 1000 * 60 * 5,
  })
}

export function pricesByProductQueryOptions(productId: string) {
  return queryOptions({
    queryKey: stripeKeys.pricesByProduct(productId),
    queryFn: () => fetchPricesByProductId({ data: productId }),
    staleTime: 1000 * 60 * 10,
  })
}

// ============================================
// Hooks
// ============================================

export function useActiveProducts() {
  return useQuery(activeProductsQueryOptions())
}

export function useProduct(id: string) {
  return useQuery(productQueryOptions(id))
}

export function usePrimaryProduct() {
  return useQuery(primaryProductQueryOptions())
}

export function useActiveCoupons() {
  return useQuery(activeCouponsQueryOptions())
}

export function useCouponByCode(code: string) {
  return useQuery(couponByCodeQueryOptions(code))
}

export function usePricesByProduct(productId: string) {
  return useQuery(pricesByProductQueryOptions(productId))
}
