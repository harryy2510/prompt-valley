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
import { showBuyDialog, showSignInDialog } from '@/stores/app'
import { Link } from '@tanstack/react-router'

// ============================================
// Types
// ============================================

type GateProps = {
  children?: ReactNode

  /**
   * Show dialog or redirect
   */
  mode?: 'dialog' | 'redirect'

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

export function DefaultLoadingFallback() {
  return <Skeleton className="h-8 w-20" />
}

export function DefaultUnauthenticatedFallback({
  mode,
}: {
  mode?: 'dialog' | 'redirect'
}) {
  if (mode === 'dialog') {
    return (
      <Button onClick={showSignInDialog} variant="nav-link" size="nav">
        Log in
      </Button>
    )
  }
  return (
    <Button asChild variant="nav-link" size="nav">
      <Link to="/auth">Log in</Link>
    </Button>
  )
}

export function DefaultUnauthorizedFallback({
  mode,
}: {
  mode?: 'dialog' | 'redirect'
}) {
  if (mode === 'dialog') {
    return (
      <Button
        onClick={() => showBuyDialog('gate')}
        variant="gradient"
        size="nav"
      >
        <span>
          Get <span className="font-bold">PRO</span>
        </span>
      </Button>
    )
  }
  return (
    <Button variant="gradient" size="nav" asChild>
      <Link to="/pricing">
        <span>
          Get <span className="font-bold">PRO</span>
        </span>
      </Link>
    </Button>
  )
}

export function DefaultForbiddenFallback() {
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
  mode = 'redirect',
  requireAuth = true,
  requiredTier,
  requiredRole,
  loadingFallback,
  unauthenticatedFallback,
  unauthorizedFallback,
  forbiddenFallback,
  silent = false,
}: GateProps) {
  const { isLoading, isAuthenticated, isPro, isAdmin } = useGate()

  // Loading state
  if (isLoading) {
    return (
      <>{loadingFallback ?? (silent ? null : <DefaultLoadingFallback />)}</>
    )
  }

  // Tier check (only if authenticated and tier is required)
  if (requiredTier === 'pro' && !isPro) {
    return (
      <>
        {unauthorizedFallback ??
          (silent ? null : <DefaultUnauthorizedFallback mode={mode} />)}
      </>
    )
  }

  // Authentication check
  if (requireAuth && !isAuthenticated) {
    return (
      <>
        {unauthenticatedFallback ??
          (silent ? null : <DefaultUnauthenticatedFallback mode={mode} />)}
      </>
    )
  }

  // Role check (only if authenticated and role is required)
  if (requiredRole === 'admin' && !isAdmin) {
    return (
      <>{forbiddenFallback ?? (silent ? null : <DefaultForbiddenFallback />)}</>
    )
  }

  // All checks passed
  return <>{children}</>
}

// ============================================
// Convenience Components
// ============================================

type SimpleGateProps = {
  children?: ReactNode
  fallback?: ReactNode
  loadingFallback?: ReactNode
  silent?: boolean
  mode?: 'dialog' | 'redirect'
}

/**
 * Gate that only checks for authentication
 */
export function AuthGate({
  children,
  fallback,
  loadingFallback,
  silent,
  mode,
}: SimpleGateProps) {
  return (
    <Gate
      requireAuth
      unauthenticatedFallback={fallback}
      loadingFallback={loadingFallback}
      silent={silent}
      mode={mode}
    >
      {children}
    </Gate>
  )
}

/**
 * Gate that checks for Pro tier access
 */
export function ProGate({
  children,
  fallback,
  loadingFallback,
  silent,
  mode,
}: SimpleGateProps) {
  return (
    <Gate
      requireAuth
      requiredTier="pro"
      unauthorizedFallback={fallback}
      loadingFallback={loadingFallback}
      silent={silent}
      mode={mode}
    >
      {children}
    </Gate>
  )
}

/**
 * Gate that checks for admin role
 */
export function AdminGate({
  children,
  fallback,
  loadingFallback,
  silent,
  mode,
}: SimpleGateProps) {
  return (
    <Gate
      requireAuth
      requiredRole="admin"
      forbiddenFallback={fallback}
      loadingFallback={loadingFallback}
      silent={silent}
      mode={mode}
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
