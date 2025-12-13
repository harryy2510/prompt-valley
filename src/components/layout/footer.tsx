import { Link } from '@tanstack/react-router'
import { LogoWithText } from './logo-with-text'

// ============================================
// Data
// ============================================

const leftLinks = [
  { label: 'Explore', href: '/' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Blog', href: '/blog' },
]

const rightLinks = [
  { label: 'Contact', href: '/contact' },
  { label: 'Linkedin', href: 'https://linkedin.com', external: true },
  { label: 'X (Twitter)', href: 'https://x.com', external: true },
]

const bottomLinks = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
]

// ============================================
// Footer Component
// ============================================

export function Footer() {
  return (
    <footer className="bg-gray-950">
      <div className="container mx-auto">
        {/* Main Footer Content */}
        <div className="flex items-start justify-between py-12">
          {/* Logo */}
          <Link to="/" className="inline-block">
            <LogoWithText className="h-8 w-27 brightness-0 invert" />
          </Link>

          {/* Links */}
          <div className="flex">
            {/* Left Column */}
            <div className="flex w-40 flex-col gap-3">
              {leftLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="text-sm text-gray-100 transition-colors hover:text-white font-medium"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right Column */}
            <div className="flex w-40 flex-col gap-3">
              {rightLinks.map((link) =>
                link.external ? (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-100 transition-colors hover:text-white font-medium"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.label}
                    to={link.href}
                    className="text-sm text-gray-100 transition-colors hover:text-white font-medium"
                  >
                    {link.label}
                  </Link>
                ),
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex items-center justify-between border-t border-gray-800 py-6">
          <p className="text-sm text-gray-100">
            © PromptValley 2025. All rights reserved
          </p>

          <div className="flex">
            {bottomLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="w-40 text-sm text-gray-100 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
