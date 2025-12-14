import { ArrowRight } from 'lucide-react'
import { ProGate } from '@/components/common/gate'
import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'

export function UpsellBanner() {
  return (
    <ProGate
      fallback={
        <Button
          asChild
          size="xl"
          variant="gradient"
          className="w-full rounded-none bg-[url(@/assets/landing/footer-upsell-background.webp)]"
        >
          <Link to="/pricing">
            <p className="text-sm">
              <span className="font-semibold">
                Upgrade to PromptValley Pro:
              </span>{' '}
              Get premium AI prompt templates that instantly improve your AI
              results <ArrowRight className="size-4 inline align-sub" />
            </p>
          </Link>
        </Button>
      }
    />
  )
}
