import { createRouter } from '@tanstack/react-router'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'
import * as TanstackQuery from '@/libs/react-query/root-provider'

// Import the generated route tree
import { routeTree } from './routeTree.gen'
import type { ReactNode } from 'react'
import { AuthStateProvider } from '@/libs/supabase/auth-state-provider'

// Create a new router instance
export const getRouter = () => {
  const rqContext = TanstackQuery.getContext()

  const router = createRouter({
    scrollRestoration: true,
    routeTree,
    context: {
      ...rqContext,
      session: null,
      user: null,
    },
    defaultPreload: 'intent',
    Wrap: (props: { children: ReactNode }) => {
      return (
        <TanstackQuery.Provider {...rqContext}>
          <AuthStateProvider>{props.children}</AuthStateProvider>
        </TanstackQuery.Provider>
      )
    },
  })

  setupRouterSsrQueryIntegration({ router, queryClient: rqContext.queryClient })

  return router
}
