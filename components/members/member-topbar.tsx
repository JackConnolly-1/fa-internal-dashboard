'use client'

import React from 'react'
import { UserButton } from '@clerk/nextjs'
import { Bell } from 'lucide-react'

interface MemberTopBarProps {
  user: {
    name: string
    email: string
    imageUrl?: string
  }
}

export function MemberTopBar({ user }: MemberTopBarProps) {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-navy-100 px-6 h-16 flex items-center justify-between">
      <div>
        <h1 className="text-sm font-semibold text-navy-900">Member Portal</h1>
        <p className="text-xs text-navy-300">{user.email}</p>
      </div>

      <div className="flex items-center gap-3">
        <button className="w-8 h-8 rounded-lg hover:bg-navy-100 flex items-center justify-center text-navy-400 relative">
          <Bell className="w-4 h-4" />
        </button>

        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: 'w-8 h-8',
            },
          }}
        />
      </div>
    </header>
  )
}
