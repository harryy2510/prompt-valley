import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackDevtools } from '@tanstack/react-devtools'

import TanStackQueryDevtools from '@/libs/react-query/query-devtools'
import TanStackRouterDevtools from '@/libs/react-query/router-devtools'

import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'
import type { PropsWithChildren } from 'react'
import type { User } from '@supabase/supabase-js'
import { seo } from '@/utils/seo'
import { userQueryOptions, useAuthStateListener } from '@/actions/auth'

// ============================================
// Router Context Type
// ============================================

export interface RouterContext {
  queryClient: QueryClient
  user: User | null
}

// ============================================
// Root Route
// ============================================

export const Route = createRootRouteWithContext<RouterContext>()({
  beforeLoad: async ({ context }) => {
    // Use React Query to fetch and cache the session
    const user = await context.queryClient.ensureQueryData(userQueryOptions())

    return { user }
  },

  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      ...seo({
        title: 'Prompt Valley - Curated Prompts for Every AI Use Case',
        description:
          'Discover a growing collection of high quality AI prompts across multiple categories. Simple to browse, easy to copy, and designed for better AI results.',
        keywords:
          'ai prompts, prompt library, prompt collection, chatgpt prompts, midjourney prompts, dalle prompts, stable diffusion prompts, best ai prompts, prompt ideas, prompt directory, prompt marketplace, creative prompts, productivity prompts, writing prompts, coding prompts, marketing prompts, seo prompts, business prompts, brainstorming prompts, image prompts, text prompts, top ai prompts, curated ai prompts, prompt categories, prompt generator, prompt templates, ai workflow prompts, daily prompts, professional prompts, premium prompts, prompt packs, prompt vault, prompt valley, ai tools, ai resources, ai content ideas',
      }),
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },

      // Favicon
      {
        rel: 'icon',
        type: 'image/svg+xml',
        href: '/favicon.svg',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '96x96',
        href: '/favicon-96x96.png',
      },
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico',
      },
      // Apple Touch Icon
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/apple-touch-icon.png',
      },
      // Web App Manifest
      {
        rel: 'manifest',
        href: '/site.webmanifest',
      },
    ],
  }),

  shellComponent: RootDocument,
})

// ============================================
// Root Document Shell
// ============================================

function RootDocument({ children }: PropsWithChildren) {
  useAuthStateListener()
  return (
    <html lang="en">
      <head>
        <HeadContent />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const savedTheme = localStorage.getItem('prompt-valley-theme');
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body>
        {children}
        <TanStackDevtools
          config={{ position: 'bottom-right' }}
          plugins={[TanStackRouterDevtools, TanStackQueryDevtools]}
        />
        <Scripts />
      </body>
    </html>
  )
}
