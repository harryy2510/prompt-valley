import { createFileRoute } from '@tanstack/react-router'

import {
  HeroSection,
  ExploreSection,
  RolesSection,
  CategoriesSection,
  TestimonialsSection,
  CtaSection,
} from '@/components/home'
import { MainLayout } from '@/components/layout'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <MainLayout>
      <HeroSection />
      <ExploreSection />
      <RolesSection />
      <CategoriesSection />
      <TestimonialsSection />
      <CtaSection />
    </MainLayout>
  )
}
