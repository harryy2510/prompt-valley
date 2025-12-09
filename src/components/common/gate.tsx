import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'

import { useUser } from '@/actions/auth'
import {
  hasAdminAccess,
  hasProAccess,
  useProfile,
  type Tier,
  type UserRole,
} from '@/actions/profile'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

// ============================================
// Types
// ============================================

type GateProps = {
  children: ReactNode

  /**
   * Require user to be authenticated
   * @default true
   */
  requireAuth?: boolean

  /**
   * Required tier for access (free users can access 'free', pro users can access both)
   */
  requiredTier?: Tier

  /**
   * Required role for access
   */
  requiredRole?: UserRole

  /**
   * Custom component to show while loading
   */
  loadingFallback?: ReactNode

  /**
   * Custom component to show when user is not authenticated
   */
  unauthenticatedFallback?: ReactNode

  /**
   * Custom component to show when user doesn't have required tier
   */
  unauthorizedFallback?: ReactNode

  /**
   * Custom component to show when user doesn't have required role
   */
  forbiddenFallback?: ReactNode

  /**
   * If true, renders nothing instead of fallbacks
   */
  silent?: boolean
}

// ============================================
// Default Fallback Components
// ============================================

function DefaultLoadingFallback() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-64" />
    </div>
  )
}

function DefaultUnauthenticatedFallback() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed p-8 text-center">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Sign in required</h3>
        <p className="text-sm text-muted-foreground">
          Please sign in to access this content.
        </p>
      </div>
      <Button asChild>
        <Link to="/auth">Sign In</Link>
      </Button>
    </div>
  )
}

function DefaultUnauthorizedFallback() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed p-8 text-center">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Pro access required</h3>
        <p className="text-sm text-muted-foreground">
          Upgrade to Pro to unlock this feature.
        </p>
      </div>
      <Button variant="gradient" asChild>
        <a href="/pricing">Upgrade to Pro</a>
      </Button>
    </div>
  )
}

function DefaultForbiddenFallback() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed p-8 text-center">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Access denied</h3>
        <p className="text-sm text-muted-foreground">
          You don't have permission to view this content.
        </p>
      </div>
    </div>
  )
}

// ============================================
// Gate Component
// ============================================

export function Gate({
  children,
  requireAuth = true,
  requiredTier,
  requiredRole,
  loadingFallback,
  unauthenticatedFallback,
  unauthorizedFallback,
  forbiddenFallback,
  silent = false,
}: GateProps) {
  const { data: user, isLoading: isUserLoading } = useUser()
  const { data: profile, isLoading: isProfileLoading } = useProfile()

  const isLoading = isUserLoading || isProfileLoading

  // Loading state
  if (isLoading) {
    if (silent) return null
    return <>{loadingFallback ?? <DefaultLoadingFallback />}</>
  }

  // Authentication check
  if (requireAuth && !user) {
    if (silent) return null
    return (
      <>{unauthenticatedFallback ?? <DefaultUnauthenticatedFallback />}</>
    )
  }

  // Tier check (only if authenticated and tier is required)
  if (requiredTier === 'pro' && !hasProAccess(profile)) {
    if (silent) return null
    return <>{unauthorizedFallback ?? <DefaultUnauthorizedFallback />}</>
  }

  // Role check (only if authenticated and role is required)
  if (requiredRole === 'admin' && !hasAdminAccess(profile)) {
    if (silent) return null
    return <>{forbiddenFallback ?? <DefaultForbiddenFallback />}</>
  }

  // All checks passed
  return <>{children}</>
}

// ============================================
// Convenience Components
// ============================================

type SimpleGateProps = {
  children: ReactNode
  fallback?: ReactNode
  silent?: boolean
}

/**
 * Gate that only checks for authentication
 */
export function AuthGate({ children, fallback, silent }: SimpleGateProps) {
  return (
    <Gate
      requireAuth
      unauthenticatedFallback={fallback}
      silent={silent}
    >
      {children}
    </Gate>
  )
}

/**
 * Gate that checks for Pro tier access
 */
export function ProGate({ children, fallback, silent }: SimpleGateProps) {
  return (
    <Gate
      requireAuth
      requiredTier="pro"
      unauthorizedFallback={fallback}
      silent={silent}
    >
      {children}
    </Gate>
  )
}

/**
 * Gate that checks for admin role
 */
export function AdminGate({ children, fallback, silent }: SimpleGateProps) {
  return (
    <Gate
      requireAuth
      requiredRole="admin"
      forbiddenFallback={fallback}
      silent={silent}
    >
      {children}
    </Gate>
  )
}

// ============================================
// Hook for programmatic access checks
// ============================================

export function useGate() {
  const { data: user, isLoading: isUserLoading } = useUser()
  const { data: profile, isLoading: isProfileLoading } = useProfile()

  const isLoading = isUserLoading || isProfileLoading
  const isAuthenticated = !!user
  const isPro = hasProAccess(profile)
  const isAdmin = hasAdminAccess(profile)

  return {
    isLoading,
    isAuthenticated,
    isPro,
    isAdmin,
    user,
    profile,

    // Helper methods
    canAccess: (tier?: Tier, role?: UserRole) => {
      if (!isAuthenticated) return false
      if (tier === 'pro' && !isPro) return false
      if (role === 'admin' && !isAdmin) return false
      return true
    },
  }
}
