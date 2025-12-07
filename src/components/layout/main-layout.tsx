import type { ReactNode } from 'react'

import { Footer } from './footer'
import { Header } from './header'

// ============================================
// Types
// ============================================

export type MainLayoutProps = {
  /** Page content */
  children: ReactNode
  /** Whether to show the header (default: true) */
  showHeader?: boolean
  /** Whether to show the footer (default: true) */
  showFooter?: boolean
}

// ============================================
// Component
// ============================================

export function MainLayout({
  children,
  showHeader = true,
  showFooter = true,
}: MainLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      {showHeader && <Header />}
      <main className="flex-1 container mx-auto px-2">{children}</main>
      {showFooter && <Footer />}
    </div>
  )
}
