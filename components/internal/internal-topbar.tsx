'use client'

import { UserButton } from '@clerk/nextjs'
import { ShieldCheck } from 'lucide-react'

export function InternalTopBar({ user }: { user: { name: string; email: string; imageUrl?: string } }) {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-navy-100 px-6 h-16 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-gold-600" />
        <div>
          <h1 className="text-sm font-semibold text-navy-900">Internal Dashboard</h1>
          <p className="text-xs text-navy-300">{user.email}</p>
        </div>
      </div>
      <UserButton afterSignOutUrl="/sign-in" appearance={{ elements: { avatarBox: 'w-8 h-8' } }} />
    </header>
  )
}
