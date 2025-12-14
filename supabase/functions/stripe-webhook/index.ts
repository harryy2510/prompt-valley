import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@17.5.0?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') as string, {
  apiVersion: '2025-11-17.clover',
  httpClient: Stripe.createFetchHttpClient(),
})

const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!

// Map event types to their handler functions
const eventHandlers: Record<string, string> = {
  // Subscription events
  'customer.subscription.created': 'handle_stripe_webhook',
  'customer.subscription.updated': 'handle_stripe_webhook',
  'customer.subscription.deleted': 'handle_stripe_webhook',
  // Product events
  'product.created': 'handle_stripe_product_webhook',
  'product.updated': 'handle_stripe_product_webhook',
  'product.deleted': 'handle_stripe_product_webhook',
  // Price events
  'price.created': 'handle_stripe_price_webhook',
  'price.updated': 'handle_stripe_price_webhook',
  'price.deleted': 'handle_stripe_price_webhook',
  // Coupon events
  'coupon.created': 'handle_stripe_coupon_webhook',
  'coupon.updated': 'handle_stripe_coupon_webhook',
  'coupon.deleted': 'handle_stripe_coupon_webhook',
  // Promotion code events
  'promotion_code.created': 'handle_stripe_promotion_code_webhook',
  'promotion_code.updated': 'handle_stripe_promotion_code_webhook',
}

// Helper to enrich coupon data with full details from Stripe API
async function enrichCouponEvent(event: Stripe.Event): Promise<Stripe.Event> {
  if (!event.type.startsWith('coupon.') || event.type === 'coupon.deleted') {
    return event
  }

  const couponFromWebhook = event.data.object as Stripe.Coupon
  console.log('Fetching full coupon details for:', couponFromWebhook.id)

  try {
    // Fetch full coupon details from Stripe API with applies_to expanded
    const fullCoupon = await stripe.coupons.retrieve(couponFromWebhook.id, {
      expand: ['applies_to'],
    })
    console.log('Full coupon data:', JSON.stringify(fullCoupon))

    // Replace webhook data with full API response
    return {
      ...event,
      data: {
        ...event.data,
        object: fullCoupon,
      },
    }
  } catch (err) {
    console.error('Failed to fetch coupon details:', err)
    return event
  }
}

serve(async (req) => {
  const signature = req.headers.get('stripe-signature')

  if (!signature) {
    return new Response('No signature', { status: 400 })
  }

  try {
    const body = await req.text()

    // Verify the webhook signature (use async version for Deno)
    let event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      webhookSecret,
    )

    console.log('Stripe webhook received:', event.type)

    // Check if we have a handler for this event type
    const handlerFunction = eventHandlers[event.type]

    if (handlerFunction) {
      // For coupon events, fetch full details from API
      if (event.type.startsWith('coupon.')) {
        event = await enrichCouponEvent(event)
      }

      const supabaseAdmin = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      )

      // Call the appropriate database function to handle the webhook
      const { error } = await supabaseAdmin.rpc(handlerFunction, {
        payload: event as any,
      })

      if (error) {
        console.error(`Error calling ${handlerFunction}:`, error)
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        })
      }

      console.log('Successfully processed webhook:', event.type)
    } else {
      console.log('No handler for event type:', event.type)
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('Webhook error:', err.message)
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
