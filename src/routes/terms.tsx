import { createFileRoute } from '@tanstack/react-router'
import { LegalPage } from '@/components/legal'

export const Route = createFileRoute('/terms')({
  component: TermsPage,
})

function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      effectiveDate="December 14, 2025"
      intro='Welcome to PromptValley! These Terms of Service ("Terms") govern your access to and use of promptvalley.ai and related services (the "Service"), operated by PromptValley ("we", "us", or "our"). By accessing or using PromptValley, you agree to be bound by these Terms. If you do not agree, please do not use the Service.'
      sections={[
        {
          title: 'Definitions',
          content: [
            '"Service" refers to the PromptValley website, applications, and all related services.',
            '"Prompts" means the AI prompts, templates, and related content available on PromptValley for browsing, copying, and use.',
            '"User" or "you" refers to any individual or entity accessing or using the Service.',
            '"Pro Subscription" refers to the paid membership that provides access to premium prompts and features.',
            '"Content" includes all prompts, text, images, and other materials available through the Service.',
          ],
        },
        {
          title: 'Acceptance of terms',
          content:
            'By creating an account, subscribing to Pro, or otherwise using PromptValley, you confirm that you have read, understood, and agree to these Terms. We may update these Terms from time to time, and your continued use constitutes acceptance of any changes.',
        },
        {
          title: 'Account registration',
          content: [
            'You must be at least 13 years old to create an account and use PromptValley.',
            'You must provide accurate and complete information when registering.',
            'You are responsible for maintaining the confidentiality of your login credentials.',
            'You are responsible for all activities that occur under your account.',
            'You must notify us immediately if you suspect unauthorized access to your account.',
            'We reserve the right to suspend or terminate accounts that violate these Terms.',
          ],
        },
        {
          title: 'Free and Pro access',
          content:
            'PromptValley offers both free and Pro tiers with different levels of access.',
          subsections: [
            {
              title: 'Free access',
              content: [
                'Free users can browse all prompts and view prompt previews.',
                'Free users can copy and use prompts marked as "Free" without limitation.',
                'Some prompts are restricted to Pro subscribers only.',
              ],
            },
            {
              title: 'Pro subscription',
              content: [
                'Pro subscribers get unlimited access to all prompts, including Pro-exclusive content.',
                'Pro subscriptions are billed monthly or annually, depending on your chosen plan.',
                'Subscriptions automatically renew unless cancelled before the renewal date.',
                'You can cancel your subscription at any time from your account settings. Cancellation takes effect at the end of the current billing period.',
                'We do not offer refunds for partial subscription periods, except as required by law.',
              ],
            },
          ],
        },
        {
          title: 'Permitted use of prompts',
          content: [
            'Prompts you access through PromptValley may be used for personal and commercial purposes with AI tools.',
            'You may modify prompts to suit your needs.',
            'You may not redistribute, resell, or republish prompts as standalone products or as part of a competing prompt library.',
            'You may not claim authorship of prompts obtained from PromptValley.',
            'You may not use prompts to generate content that is illegal, harmful, defamatory, or infringes on third-party rights.',
            'Output generated using our prompts belongs to you, subject to the terms of the AI tool you use.',
          ],
        },
        {
          title: 'Intellectual property',
          content: [
            'All prompts, designs, logos, and content on PromptValley are owned by PromptValley or our licensors and protected by intellectual property laws.',
            'Your access to prompts does not transfer ownership—you receive a license to use them as described in these Terms.',
            'The PromptValley name, logo, and branding are trademarks of PromptValley. You may not use them without permission.',
            'If you believe content on PromptValley infringes your intellectual property, please contact us at legal@promptvalley.ai.',
          ],
        },
        {
          title: 'Prohibited conduct',
          content: [
            'You may not use the Service for any unlawful purpose.',
            'You may not attempt to gain unauthorized access to the Service, other accounts, or our systems.',
            'You may not use automated tools (bots, scrapers) to access or extract content from PromptValley without permission.',
            'You may not interfere with or disrupt the Service or servers.',
            'You may not upload or transmit viruses, malware, or other malicious code.',
            'You may not harass, threaten, or abuse other users or PromptValley staff.',
            'You may not impersonate others or misrepresent your affiliation.',
            'You may not circumvent, disable, or interfere with security features or access restrictions.',
          ],
        },
        {
          title: 'Payments and billing',
          content: [
            'All payments are processed securely through Stripe.',
            'Prices are displayed in USD unless otherwise specified.',
            'You agree to pay all fees associated with your subscription.',
            'We may change pricing with at least 30 days notice. Price changes do not affect your current billing period.',
            'If payment fails, we may suspend access to Pro features until payment is resolved.',
            'You are responsible for any taxes applicable to your subscription.',
          ],
        },
        {
          title: 'Disclaimer of warranties',
          content: [
            'THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED.',
            'WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, SECURE, OR FREE OF VIRUSES.',
            'WE DO NOT GUARANTEE THAT PROMPTS WILL PRODUCE SPECIFIC RESULTS WITH ANY AI TOOL.',
            'AI OUTPUTS MAY VARY BASED ON THE AI MODEL, SETTINGS, AND OTHER FACTORS OUTSIDE OUR CONTROL.',
            'YOU USE PROMPTS AND GENERATED CONTENT AT YOUR OWN RISK.',
          ],
        },
        {
          title: 'Limitation of liability',
          content: [
            'TO THE MAXIMUM EXTENT PERMITTED BY LAW, PROMPTVALLEY SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE SERVICE.',
            'OUR TOTAL LIABILITY FOR ANY CLAIM SHALL NOT EXCEED THE AMOUNT YOU PAID US IN THE 12 MONTHS PRECEDING THE CLAIM.',
            'SOME JURISDICTIONS DO NOT ALLOW LIMITATION OF LIABILITY, SO SOME OF THESE LIMITATIONS MAY NOT APPLY TO YOU.',
          ],
        },
        {
          title: 'Indemnification',
          content:
            'You agree to indemnify and hold harmless PromptValley, its affiliates, and their respective officers, directors, employees, and agents from any claims, damages, losses, or expenses (including legal fees) arising from your use of the Service, violation of these Terms, or infringement of any third-party rights.',
        },
        {
          title: 'Termination',
          content: [
            'You may delete your account at any time through your account settings or by contacting us.',
            'We may suspend or terminate your account immediately if you violate these Terms.',
            'Upon termination, your right to access the Service ceases immediately.',
            'Sections that by their nature should survive termination (such as intellectual property, disclaimers, and limitation of liability) will remain in effect.',
          ],
        },
        {
          title: 'Governing law',
          content:
            'These Terms are governed by the laws of the State of Delaware, United States, without regard to conflict of law principles. Any disputes shall be resolved in the courts located in Delaware.',
        },
        {
          title: 'Changes to terms',
          content:
            'We may modify these Terms at any time. We will notify you of material changes by email or by posting a notice on the Service. Your continued use after changes take effect constitutes acceptance of the new Terms.',
        },
        {
          title: 'Contact us',
          content:
            'If you have questions about these Terms of Service, please contact us at support@promptvalley.ai.',
        },
      ]}
    />
  )
}
