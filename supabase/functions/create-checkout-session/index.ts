import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@17.5.0?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') as string, {
  apiVersion: '2025-11-17.clover',
  httpClient: Stripe.createFetchHttpClient(),
})

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Support both GET (with query param) and POST (with body)
    const url = new URL(req.url)
    let priceId: string | null
    let couponId: string | null | undefined

    if (req.method === 'GET') {
      priceId = url.searchParams.get('priceId')
      couponId = url.searchParams.get('couponId')
    } else {
      const body = await req.json()
      priceId = body.priceId
      couponId = body.couponId
    }

    if (!priceId) {
      return new Response(JSON.stringify({ error: 'priceId is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Get user from auth header
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      },
    )

    let customerId = ''

    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    if (user) {
      // Get user's email and customer ID
      const supabaseAdmin = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      )

      const { data: userData } = await supabaseAdmin
        .from('users')
        .select('email, stripe_customer_id')
        .eq('id', user.id)
        .single()

      if (userData?.stripe_customer_id) {
        customerId = userData.stripe_customer_id
      } else {
        // Create Stripe customer if doesn't exist
        const customer = await stripe.customers.create({
          email: userData.email,
          metadata: {
            supabase_user_id: user.id,
          },
        })
        customerId = customer.id

        // Save customer ID to database
        await supabaseAdmin
          .from('users')
          .update({ stripe_customer_id: customerId })
          .eq('id', user.id)
      }
    }

    // Build checkout session params
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      ...(customerId ? { customer: customerId } : {}),
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${Deno.env.get('APP_URL')}/dashboard?checkout=success`,
      cancel_url: `${Deno.env.get('APP_URL')}/pricing?checkout=cancelled`,
      metadata: user
        ? {
            supabase_user_id: user.id,
          }
        : {},
    }

    // Apply coupon if provided
    if (couponId) {
      sessionParams.discounts = [{ coupon: couponId }]
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create(sessionParams)

    // If GET request, redirect directly to Stripe
    // If POST request, return JSON with URL
    if (req.method === 'GET') {
      return Response.redirect(session.url!, 303)
    } else {
      return new Response(JSON.stringify({ url: session.url }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
  } catch (error: any) {
    console.error('Error creating checkout session:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
