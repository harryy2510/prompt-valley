import { Moon, Sun } from 'lucide-react'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useLocalStorage } from 'usehooks-ts'

type Theme = 'light' | 'dark'

function getSystemTheme(): Theme {
  if (typeof window === 'undefined') return 'light'
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  return prefersDark ? 'dark' : 'light'
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.remove('dark', 'light')
  document.documentElement.classList.add(theme)
}

export function ThemeToggle() {
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>(
    'prompt-valley-theme',
    getSystemTheme(),
  )

  useEffect(() => {
    // TODO: Only light theme for now
    // applyTheme(theme)
  }, [theme])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
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
