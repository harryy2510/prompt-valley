// ============================================================================
// BACKEND API ROUTES FOR STRIPE
// These create Checkout sessions and Customer Portal sessions
// ============================================================================

import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role for backend
)

// ============================================================================
// 1. CREATE CHECKOUT SESSION (for new subscriptions)
// ============================================================================

export async function createCheckoutSession(userId: string) {
  // Get user to check if they already have a customer ID
  const { data: user } = await supabase
    .from('users')
    .select('email, stripe_customer_id')
    .eq('id', userId)
    .single()

  if (!user) {
    throw new Error('User not found')
  }

  let customerId = user.stripe_customer_id

  // Create Stripe customer if doesn't exist
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: {
        supabase_user_id: userId,
      },
    })
    customerId = customer.id

    // Save customer ID to database
    await supabase
      .from('users')
      .update({ stripe_customer_id: customerId })
      .eq('id', userId)
  }

  // Create checkout session
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    line_items: [
      {
        price: process.env.STRIPE_PRICE_ID!, // Your Stripe Price ID (e.g., price_xxx)
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing?canceled=true`,
    metadata: {
      supabase_user_id: userId,
    },
  })

  return { url: session.url }
}

// ============================================================================
// 2. CREATE CUSTOMER PORTAL SESSION (for managing existing subscriptions)
// ============================================================================

export async function createPortalSession(userId: string) {
  // Get user's Stripe customer ID
  const { data: user } = await supabase
    .from('users')
    .select('stripe_customer_id')
    .eq('id', userId)
    .single()

  if (!user?.stripe_customer_id) {
    throw new Error('No active subscription found')
  }

  // Create portal session
  const session = await stripe.billingPortal.sessions.create({
    customer: user.stripe_customer_id,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing`,
  })

  return { url: session.url }
}

// ============================================================================
// EXAMPLE: Next.js API Routes
// ============================================================================

// app/api/create-checkout-session/route.ts
export async function POST_checkout(request: Request) {
  try {
    const { data: { user } } = await supabase.auth.getUser(
      request.headers.get('Authorization')?.replace('Bearer ', '') || ''
    )

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { url } = await createCheckoutSession(user.id)

    return Response.json({ url })
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}

// app/api/create-portal-session/route.ts
export async function POST_portal(request: Request) {
  try {
    const { data: { user } } = await supabase.auth.getUser(
      request.headers.get('Authorization')?.replace('Bearer ', '') || ''
    )

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { url } = await createPortalSession(user.id)

    return Response.json({ url })
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}

// ============================================================================
// EXAMPLE: Express.js Routes (if using Express)
// ============================================================================

/*
import express from 'express'

const router = express.Router()

router.post('/create-checkout-session', async (req, res) => {
  try {
    const userId = req.user.id // Assuming you have auth middleware
    const { url } = await createCheckoutSession(userId)
    res.json({ url })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post('/create-portal-session', async (req, res) => {
  try {
    const userId = req.user.id
    const { url } = await createPortalSession(userId)
    res.json({ url })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
*/
