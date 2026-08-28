import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { isAdminEmail } from '@/lib/auth'
import { InternalSidebar } from '@/components/internal/internal-sidebar'
import { InternalTopBar } from '@/components/internal/internal-topbar'

// Gates the whole internal dashboard: must be logged in AND on the admin allowlist.
export default async function InternalLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser()
  if (!user) redirect('/sign-in')

  const email = user.emailAddresses[0]?.emailAddress
  if (!isAdminEmail(email)) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md text-center">
          <h1 className="text-xl font-serif font-bold text-navy-900">Access restricted</h1>
          <p className="mt-2 text-sm text-navy-600">
            This dashboard is limited to Frontier Angels administrators. You&apos;re signed in as{' '}
            <span className="font-medium">{email}</span>.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <InternalTopBar
        user={{ name: user.fullName || email || '', email: email || '', imageUrl: user.imageUrl }}
      />
      <div className="flex items-start">
        <InternalSidebar />
        <main className="flex-1 min-w-0 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
