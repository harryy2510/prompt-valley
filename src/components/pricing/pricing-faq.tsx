import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

// ============================================
// FAQ Data
// ============================================

const faqItems = [
  {
    question: 'What is PromptValley Pro?',
    answer:
      'PromptValley Pro gives you unlimited access to premium prompt templates, advanced filters, unlimited saves, private collections, and priority access to new prompt packs and updates.',
  },
  {
    question: "What's the difference between the Free plan and the Pro plan?",
    answer: (
      <>
        The Free plan lets you browse and use a limited number of prompts. Pro
        unlocks everything, including:
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>All premium prompt templates</li>
          <li>Unlimited saves and collections</li>
          <li>Early access to new prompt releases</li>
          <li>Pro-only categories like SEO, ads, image prompts, workflows</li>
          <li>Faster browsing with AI-enhanced search</li>
        </ul>
      </>
    ),
  },
  {
    question: 'How often do you add new prompts?',
    answer:
      'New prompts and collections are added weekly for Pro members, including seasonal packs, industry-specific packs, and high-demand use cases.',
  },
  {
    question: 'Do you offer team or enterprise plans?',
    answer:
      'Team plans are coming soon. Enterprise plans are available by request.',
  },
  {
    question: 'Which AI models does PromptValley support?',
    answer:
      'PromptValley includes optimized prompt templates for ChatGPT and Gemini. New model-specific prompts are added regularly as the AI landscape evolves. Midjourney coming soon.',
  },
  {
    question: 'Can I cancel my subscription?',
    answer:
      'Yes, you can cancel anytime from your account settings. Your Pro access will continue until the end of your current billing period.',
  },
]

// ============================================
// Pricing FAQ Component
// ============================================

export function PricingFaq() {
  return (
    <section className="py-16">
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold sm:text-3xl">
            Frequently asked questions
          </h2>
          <p className="mt-4 text-muted-foreground">
            For additional information, please{' '}
            <a
              href="mailto:support@promptvalley.ai"
              className="text-primary hover:underline"
            >
              contact us
            </a>
            .
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="lg:col-span-2">
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left font-semibold">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
