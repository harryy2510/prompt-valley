import { Link } from '@tanstack/react-router'
import { LogoWithText } from './logo-with-text'

const links = [
  { label: 'Pricing', href: '/pricing' },
  { label: 'Contact', href: '/contact' },
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
]

export function Footer() {
  return (
    <footer className="bg-gray-950">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          {/* Logo */}
          <Link to="/">
            <LogoWithText className="h-6 w-20 brightness-0 invert" />
          </Link>

          {/* Links */}
          <nav className="flex flex-wrap justify-center gap-6">
            {links.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="text-sm text-gray-200 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-gray-600 pt-6 text-center">
          <p className="text-sm text-gray-200">
            © {new Date().getFullYear()} PromptValley. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
