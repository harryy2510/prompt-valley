# Stripe Integration Setup Guide

## Overview

This setup uses **ONE webhook** that syncs subscription data to your `users` table. All Stripe interactions (checkout, payment, cancellation, card updates) happen on Stripe's hosted pages.

## What Gets Synced

The webhook syncs these fields to your `users` table:

- `tier` - 'free' or 'pro' (used by RLS policies)
- `stripe_customer_id` - Stripe customer ID
- `stripe_subscription_id` - Stripe subscription ID
- `stripe_subscription_status` - 'active', 'canceled', 'past_due', etc.
- `stripe_current_period_start` - Billing period start date
- `stripe_current_period_end` - Billing period end date (renewal date)
- `stripe_cancel_at_period_end` - Whether subscription cancels at period end
- `stripe_canceled_at` - When subscription was canceled

## Setup Steps

### 1. Run Database Migrations

```bash
cd supabase
supabase db reset
```

This creates:
- Updated `users` table with Stripe fields
- `handle_stripe_webhook()` function
- `get_user_billing_info()` function for frontend

### 2. Deploy Edge Function

```bash
# Deploy the webhook handler
supabase functions deploy stripe-webhook

# Set environment secrets
supabase secrets set STRIPE_SECRET_KEY=sk_test_xxxxx
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

### 3. Configure Stripe Webhook

1. Go to [Stripe Dashboard → Developers → Webhooks](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. Endpoint URL: `https://YOUR_PROJECT.supabase.co/functions/v1/stripe-webhook`
4. Select these events (only subscription events):
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `customer.subscription.trial_will_end` (optional)
5. Copy the webhook secret and save it to Supabase secrets (step 2 above)

### 4. Create Stripe Product & Price

1. Go to [Stripe Dashboard → Products](https://dashboard.stripe.com/products)
2. Click "Add Product"
3. Name: "PromptValley Pro"
4. Pricing: Recurring, $10/month (or your price)
5. Copy the Price ID (e.g., `price_xxxxx`)
6. Save it as environment variable: `STRIPE_PRICE_ID=price_xxxxx`

### 5. Set Up Environment Variables

Create `.env.local` (for Next.js) or equivalent:

```bash
# Public (can be exposed to frontend)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Private (backend only)
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_PRICE_ID=price_xxxxx
```

### 6. Add Backend API Routes

Choose your framework:

**Next.js App Router:**
```typescript
// app/api/create-checkout-session/route.ts
export { POST_checkout as POST } from '@/examples/api-routes-example'

// app/api/create-portal-session/route.ts
export { POST_portal as POST } from '@/examples/api-routes-example'
```

**Next.js Pages Router:**
```typescript
// pages/api/create-checkout-session.ts
export default async function handler(req, res) {
  // See examples/api-routes-example.ts
}
```

**Express.js:**
```typescript
// See examples/api-routes-example.ts for Express code
```

### 7. Add Billing Page to Frontend

Copy `examples/billing-page-example.tsx` to your app and customize the styling.

## How It Works

### User Journey

1. **Free User Wants to Upgrade:**
   - Clicks "Upgrade to Pro"
   - Backend calls `createCheckoutSession()`
   - User redirected to Stripe Checkout (Stripe-hosted page)
   - User enters payment info and subscribes
   - Stripe webhook fires → `customer.subscription.created`
   - Edge function calls `handle_stripe_webhook()`
   - User's `tier` updated to 'pro'
   - User redirected back to `/billing?success=true`

2. **Pro User Views Billing Page:**
   - Frontend calls `get_user_billing_info()` function
   - Displays subscription status, renewal date, etc.
   - All data comes from local `users` table (fast)

3. **Pro User Manages Subscription:**
   - Clicks "Manage Subscription"
   - Backend calls `createPortalSession()`
   - User redirected to Stripe Customer Portal (Stripe-hosted page)
   - User can:
     - Update payment method
     - Cancel subscription
     - View invoices
     - Update billing info
   - Any changes trigger webhook → updates `users` table
   - User redirected back to `/billing`

4. **Pro User Cancels:**
   - Cancels via Stripe Customer Portal
   - Stripe webhook fires → `customer.subscription.updated`
   - Database updated:
     - `stripe_cancel_at_period_end = true`
     - `stripe_canceled_at = NOW()`
     - `tier` stays 'pro' until period ends
   - User keeps access until `current_period_end`
   - At period end, Stripe fires `customer.subscription.deleted`
   - `tier` updated to 'free'
   - User loses access to pro content (RLS blocks it)

## What You DON'T Need to Build

✅ **Stripe handles these for you:**
- Payment form (Stripe Checkout)
- Payment processing
- Card validation
- 3D Secure authentication
- Subscription management UI (Customer Portal)
- Invoice generation
- Payment retry logic
- Failed payment handling
- Subscription cancellation flow
- Payment method updates

❌ **You only build:**
- Billing page showing subscription info
- Two API routes (checkout + portal)
- ONE webhook handler (already created)

## Testing

### Test the Webhook Locally

1. Install Stripe CLI:
   ```bash
   brew install stripe/stripe-cli/stripe
   stripe login
   ```

2. Forward webhooks to your local Supabase:
   ```bash
   stripe listen --forward-to https://your-project.supabase.co/functions/v1/stripe-webhook
   ```

3. Trigger a test event:
   ```bash
   stripe trigger customer.subscription.created
   ```

### Test Cards

Use Stripe test cards:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- 3D Secure: `4000 0027 6000 3184`

Any future expiry date, any CVC.

## Monitoring

### Check if webhook is working:

1. **Stripe Dashboard:**
   - Go to Developers → Webhooks
   - Click your endpoint
   - View "Recent deliveries"

2. **Supabase Logs:**
   ```bash
   supabase functions logs stripe-webhook
   ```

3. **Database Check:**
   ```sql
   SELECT
     email,
     tier,
     stripe_subscription_status,
     stripe_current_period_end
   FROM users
   WHERE stripe_customer_id IS NOT NULL;
   ```

## Common Issues

### Issue: Webhook not receiving events
- Check webhook URL is correct
- Check events are selected in Stripe dashboard
- Check webhook secret is correct in Supabase secrets

### Issue: User not upgraded after payment
- Check Supabase function logs for errors
- Verify `handle_stripe_webhook` function exists
- Check RLS policies allow service_role to update users

### Issue: "No active subscription found" when clicking Manage
- User needs to complete checkout first
- Check user has `stripe_customer_id` in database

## Production Checklist

- [ ] Replace test API keys with live keys
- [ ] Update webhook endpoint to production URL
- [ ] Test complete flow in production
- [ ] Set up Stripe billing alerts
- [ ] Configure email receipts in Stripe
- [ ] Set up tax collection (if needed)
- [ ] Configure subscription grace period
- [ ] Set up failed payment retry logic in Stripe

## Support

If issues arise:
1. Check Stripe webhook logs
2. Check Supabase function logs
3. Check database for user record updates
4. Test with Stripe CLI locally
