import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const CONTACT_EMAIL = 'contact@promptvalley.ai'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
}

interface ContactEmailBody {
  name: string
  email: string
  subject: string
  message: string
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not configured')
    }

    const body: ContactEmailBody = await req.json()

    // Validate required fields
    if (!body.name || !body.email || !body.subject || !body.message) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      )
    }

    // Send email via Resend
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'PromptValley <noreply@promptvalley.ai>',
        to: [CONTACT_EMAIL],
        reply_to: body.email,
        subject: `[Contact Form] ${body.subject}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>From:</strong> ${body.name} (${body.email})</p>
          <p><strong>Subject:</strong> ${body.subject}</p>
          <hr />
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap;">${body.message}</p>
        `,
        text: `
New Contact Form Submission

From: ${body.name} (${body.email})
Subject: ${body.subject}

Message:
${body.message}
        `.trim(),
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Resend API error:', errorData)
      throw new Error(errorData.message || 'Failed to send email')
    }

    const data = await response.json()
    console.log('Email sent successfully:', data.id)

    return new Response(JSON.stringify({ success: true, id: data.id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error: unknown) {
    console.error('Error sending contact email:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to send message'
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
