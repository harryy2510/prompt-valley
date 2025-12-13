import { ArrowRight } from 'lucide-react'

export function UpsellBanner() {
  return (
    <div className="relative px-4 py-5 text-center text-primary-foreground bg-[url(@/assets/landing/footer-upsell-background.webp)] bg-size-[auto_100%] xl:bg-size-[100%_auto] bg-center bg-no-repeat">
      <p className="text-sm">
        <span className="font-semibold">Upgrade to PromptValley Pro:</span> Get
        premium AI prompt templates that instantly improve your AI results{' '}
        <ArrowRight className="size-4 inline align-sub" />
      </p>
    </div>
  )
}
