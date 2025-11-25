import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [mounted, setMounted] = useState(false)

  // useEffect(() => {
  //   setMounted(true)
  //   // Check if user has a preference in localStorage
  //   const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
  //   const prefersDark = window.matchMedia(
  //     '(prefers-color-scheme: dark)',
  //   ).matches
  //
  //   if (savedTheme) {
  //     setTheme(savedTheme)
  //     document.documentElement.classList.toggle('dark', savedTheme === 'dark')
  //   } else if (prefersDark) {
  //     setTheme('dark')
  //     document.documentElement.classList.add('dark')
  //   }
  // }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
  }

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full"
        disabled
        aria-label="Toggle theme"
      >
        <Sun className="size-5" />
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="rounded-full group relative"
      aria-label="Toggle theme"
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <Sun className="size-5 transition-transform group-hover:rotate-90" />
      ) : (
        <Moon className="size-5 transition-transform group-hover:-rotate-12" />
      )}
    </Button>
  )
}
