/**
 * Auth helpers — server-side Clerk utilities
 * All functions are server-only
 */
import { auth, currentUser } from '@clerk/nextjs/server'
import { getMemberByEmail, updateMemberClerkId, type AirtableMember } from './airtable'

/**
 * Get the current user's Airtable member record
 * Syncs Clerk user ID to Airtable on first lookup
 */
export async function getCurrentMember(): Promise<AirtableMember | null> {
  const user = await currentUser()
  if (!user) return null

  const email = user.emailAddresses[0]?.emailAddress
  if (!email) return null

  const member = await getMemberByEmail(email)

  // Sync Clerk User ID to Airtable on first lookup
  if (member && !member.clerkUserId) {
    await updateMemberClerkId(member.id, user.id)
  }

  return member
}

/**
 * Require authentication — redirects to sign-in if not authenticated
 * Use in Server Components that must be protected
 */
export async function requireAuth() {
  const { userId } = await auth()
  if (!userId) {
    // Clerk middleware handles redirect, but this is a fallback
    throw new Error('Unauthorized')
  }
  return userId
}

/**
 * Check if the current user is an active FA member
 */
export async function isActiveMember(): Promise<boolean> {
  const member = await getCurrentMember()
  return member?.status === 'Active'
}

/**
 * Admin allowlist — only these emails may reach internal tools (/admin, /api/test).
 * Set ADMIN_EMAILS as a comma-separated list in the environment; defaults to Graham.
 */
export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false
  const allow = (process.env.ADMIN_EMAILS || 'graham@frontierangels.com')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
  return allow.includes(email.toLowerCase())
}

/**
 * Resolve which email to use for Airtable member lookups.
 *
 * DEV ONLY: a `?as=<email>` query param or the `DEV_PREVIEW_EMAIL` env var can
 * stand in for the logged-in user's email, so non-investors can preview the
 * portal as any real member. In production this always returns the real user's
 * email — the override is ignored entirely.
 */
export function resolvePreviewEmail(userEmail: string, queryOverride?: string): string {
  if (process.env.NODE_ENV !== 'production') {
    if (queryOverride && queryOverride.trim()) return queryOverride.trim()
    if (process.env.DEV_PREVIEW_EMAIL) return process.env.DEV_PREVIEW_EMAIL
  }
  return userEmail
}
