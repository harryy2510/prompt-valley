import { createFileRoute } from '@tanstack/react-router'

import {
  HeroSection,
  ExploreSection,
  RolesSection,
  CategoriesSection,
  TestimonialsSection,
  CtaSection,
  UpsellBanner,
} from '@/components/home'
import { MainLayout } from '@/components/layout'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <>
      <MainLayout>
        <HeroSection />
        <div className="container mx-auto px-2">
          <ExploreSection />
          <RolesSection />
          <CategoriesSection />
          <TestimonialsSection />
        </div>
        <CtaSection />
        <UpsellBanner />
      </MainLayout>
    </>
  )
}
