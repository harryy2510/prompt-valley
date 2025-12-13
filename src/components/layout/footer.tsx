import { Link } from '@tanstack/react-router'
import { LogoWithText } from './logo-with-text'

// ============================================
// Types
// ============================================

type FooterLink = {
  label: string
  href: string
  external?: boolean
}

// ============================================
// Data
// ============================================

const footerLinks: FooterLink[] = [
  { label: 'Explore', href: '/' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'LinkedIn', href: 'https://linkedin.com', external: true },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
  { label: 'AI Chatbot', href: '/chatbot' },
]

// ============================================
// Components
// ============================================

function FooterLinks({ links }: { links: FooterLink[] }) {
  return (
    <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
      {links.map((link) =>
        link.external ? (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {link.label}
          </a>
        ) : (
          <Link
            key={link.label}
            to={link.href}
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {link.label}
          </Link>
        ),
      )}
    </nav>
  )
}

// ============================================
// Footer Component
// ============================================

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="mt-auto border-t">
      {/* Main Footer */}
      <div className="container mx-auto px-2 py-8">
        <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
          {/* Logo */}
          <Link to="/" className="shrink-0">
            <LogoWithText className="h-6 w-20" />
          </Link>

          {/* Links */}
          <FooterLinks links={footerLinks} />
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; PromptValley {currentYear}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
