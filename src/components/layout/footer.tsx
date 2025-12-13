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

type FooterSection = {
  title: string
  links: FooterLink[]
}

// ============================================
// Data
// ============================================

const footerSections: FooterSection[] = [
  {
    title: 'Quick Links',
    links: [
      { label: 'Explore', href: '/' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Blog', href: '/blog' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Contact', href: '/contact' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Help Center', href: '/help' },
    ],
  },
]

// ============================================
// Components
// ============================================

function FooterLinkSection({ section }: { section: FooterSection }) {
  return (
    <div>
      <h3 className="mb-4 text-sm font-semibold text-white">{section.title}</h3>
      <ul className="space-y-3">
        {section.links.map((link) => (
          <li key={link.label}>
            {link.external ? (
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-400 transition-colors hover:text-white"
              >
                {link.label}
              </a>
            ) : (
              <Link
                to={link.href}
                className="text-sm text-gray-400 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

// ============================================
// Footer Component
// ============================================

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-950">
      <div className="container mx-auto">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5 pt-8 pb-20">
          {/* Logo & Description */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block">
              <LogoWithText className="h-8 w-27 brightness-0 invert" />
            </Link>
          </div>

          {/* Link Sections */}
          {footerSections.map((section) => (
            <FooterLinkSection key={section.title} section={section} />
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-600 pt-6 pb-8 md:flex-row">
          <p className="text-sm text-gray-300">
            © PromptValley {currentYear}. All rights reserved
          </p>
        </div>
      </div>
    </footer>
  )
}
