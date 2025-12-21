import { createFileRoute } from '@tanstack/react-router'
import { LegalPage } from '@/components/legal'
import { seo } from '@/utils/seo'

export const Route = createFileRoute('/privacy')({
  head: () => ({
    meta: seo({
      title: 'Privacy Policy',
      description:
        'Learn how Prompt Valley collects, uses, and protects your personal information. Your privacy matters to us.',
      image: '/og/legal.png',
      url: '/privacy',
    }),
  }),
  component: PrivacyPage,
})

function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      effectiveDate="December 14, 2025"
      intro='PromptValley ("PromptValley", "we", "us", or "our") operates promptvalley.ai, a curated marketplace for AI prompts across categories like writing, image generation, coding, and more. Your privacy is important to us. This Privacy Policy explains how we collect, use, share, and protect your personal information when you browse prompts, create an account, purchase prompts, or interact with our Service. By using PromptValley, you accept the practices described in this Privacy Policy.'
      sections={[
        {
          title: 'Scope & definitions',
          content: [
            '"Personal information" means any information that can be used to identify you directly or indirectly, including your name, email address, payment information, IP address, and device identifiers.',
            '"User data" includes your account details, prompt purchase history, favorites, collections, and any prompts you may submit to the platform.',
            '"Prompts" refers to the AI prompts available on PromptValley for browsing, copying, and use with AI tools like ChatGPT, Midjourney, DALL-E, Claude, and others.',
            'This policy applies to all PromptValley websites, applications, and services.',
          ],
        },
        {
          title: 'Information we collect',
          content:
            'We collect information to provide you with a personalized prompt discovery experience and to process your transactions.',
          subsections: [
            {
              title: 'Information you provide',
              content: [
                'Account information: When you sign up, we collect your email address and create a secure account. You may also sign in using Google or other OAuth providers, in which case we receive your name and email from that provider.',
                'Payment information: When you upgrade to PromptValley Pro, payment is processed securely through Stripe. We do not store your full credit card details—only a token and last four digits for reference.',
                'Profile information: You may optionally add a display name, profile picture, or bio to personalize your account.',
                'Favorites and collections: We store the prompts you save to your favorites and any collections you create.',
                'Support communications: When you contact us for help, we collect the information you provide in your message.',
              ],
            },
            {
              title: 'Information collected automatically',
              content: [
                'Usage data: We track which prompts you view, copy, and favorite to improve recommendations and understand popular content.',
                'Device information: Browser type, operating system, screen resolution, and device type help us optimize the experience.',
                'Log data: IP address, access times, pages visited, and referring URLs are collected for security and analytics.',
                'Cookies: We use essential cookies for authentication and preferences, and analytics cookies (with your consent) to understand how you use PromptValley.',
              ],
            },
          ],
        },
        {
          title: 'How we use your information',
          content: [
            'Provide the Service: To let you browse, search, copy, and organize AI prompts across all categories.',
            'Process transactions: To handle Pro subscription payments and maintain your subscription status.',
            'Personalize your experience: To show relevant prompts based on your interests, viewing history, and favorites.',
            'Improve PromptValley: To analyze usage patterns, identify popular prompts, and develop new features.',
            'Communicate with you: To send account confirmations, subscription updates, and (with your consent) newsletters about new prompts and features.',
            'Ensure security: To detect fraud, prevent abuse, and protect the integrity of our platform.',
            'Comply with legal obligations: To meet applicable laws, regulations, and legal processes.',
          ],
        },
        {
          title: 'Information sharing',
          content: [
            'Payment processors: Stripe processes your payments securely. They receive only the information necessary to complete transactions.',
            'Hosting and infrastructure: We use cloud services (such as Vercel and Supabase) to host PromptValley. These providers have access to data as needed to provide their services.',
            'Analytics: We may use privacy-focused analytics tools to understand usage patterns. These tools receive anonymized or aggregated data.',
            'Legal requirements: We may disclose information if required by law, court order, or to protect the rights and safety of PromptValley and our users.',
            'Business transfers: If PromptValley is acquired or merged, your information may be transferred to the new entity.',
            'We do not sell your personal information to third parties.',
          ],
        },
        {
          title: 'Data retention',
          content: [
            'Account data: We retain your account information for as long as your account is active. If you delete your account, we will remove your personal data within 30 days, except where retention is required by law.',
            'Transaction records: Payment and subscription records are retained for 7 years for accounting and legal compliance.',
            'Usage logs: Anonymized usage data may be retained indefinitely for analytics purposes.',
            'You can request deletion of your account and associated data at any time by contacting us or using the account settings.',
          ],
        },
        {
          title: 'Your rights',
          content: [
            'Access: Request a copy of the personal information we hold about you.',
            'Correction: Update or correct inaccurate information in your account settings or by contacting us.',
            'Deletion: Request deletion of your account and personal data.',
            'Data portability: Request your data in a machine-readable format.',
            'Withdraw consent: Opt out of marketing emails at any time using the unsubscribe link.',
            'Object to processing: In certain circumstances, you may object to how we process your data.',
            'To exercise these rights, contact us at privacy@promptvalley.ai.',
          ],
        },
        {
          title: 'Cookies and tracking',
          content: [
            'Essential cookies: Required for authentication, security, and basic functionality. These cannot be disabled.',
            'Preference cookies: Remember your settings like theme preference and recently viewed prompts.',
            'Analytics cookies: Help us understand how you use PromptValley. You can opt out of these in your browser settings or through our cookie banner.',
            'We do not use advertising cookies or share data with ad networks.',
          ],
        },
        {
          title: 'Security',
          content: [
            'We implement industry-standard security measures to protect your information, including encryption in transit (HTTPS), secure password hashing, and access controls.',
            'Payment information is handled by PCI-compliant processors and never stored on our servers.',
            'While we take security seriously, no system is 100% secure. We encourage you to use a strong, unique password for your PromptValley account.',
          ],
        },
        {
          title: 'International transfers',
          content:
            'PromptValley is operated from the United States. If you access the Service from outside the US, your information may be transferred to and processed in the US or other countries where our service providers operate. We ensure appropriate safeguards are in place for such transfers.',
        },
        {
          title: 'Children\'s privacy',
          content:
            'PromptValley is not intended for children under 13. We do not knowingly collect personal information from children under 13. If you believe we have collected such information, please contact us immediately.',
        },
        {
          title: 'Changes to this policy',
          content:
            'We may update this Privacy Policy from time to time. We will notify you of significant changes by email or by posting a prominent notice on PromptValley. Your continued use after changes constitutes acceptance of the updated policy.',
        },
        {
          title: 'Contact us',
          content:
            'If you have questions about this Privacy Policy or how we handle your data, please contact us at privacy@promptvalley.ai.',
        },
      ]}
    />
  )
}
