'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Building2,
  Zap,
  ChevronRight,
  ChevronDown,
  Calendar,
  Users,
  Settings,
  Layers,
  ClipboardList,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  {
    label: 'Investment Dashboard',
    href: '/members/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Companies',
    href: '/members/companies',
    icon: Building2,
  },
  {
    label: 'Live Deals',
    href: '/members/deals',
    icon: Zap,
  },
  {
    label: 'Events',
    href: '/members/events',
    icon: Calendar,
  },
  {
    label: 'Directory',
    href: '/members/directory',
    icon: Users,
  },
  {
    label: 'Scoring Criteria',
    href: '/members/scoring-criteria',
    icon: ClipboardList,
  },
  {
    label: 'Account Settings',
    href: '/members/account',
    icon: Settings,
  },
]

export function MemberSidebar({
  funds = [],
}: {
  funds?: string[]
}) {
  const pathname = usePathname()
  const [fundsOpen, setFundsOpen] = useState(pathname.startsWith('/members/funds'))

  const renderNavItem = (item: (typeof navItems)[number]) => {
    const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
    return (
      <li key={item.href}>
        <Link
          href={item.href}
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
            isActive ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'
          )}
        >
          <item.icon className="w-4 h-4 flex-shrink-0" />
          <span className="flex-1">{item.label}</span>
          {isActive && <ChevronRight className="w-3 h-3 text-gold-400" />}
        </Link>
      </li>
    )
  }

  return (
    <aside className="hidden md:flex flex-col w-64 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto bg-navy-900 text-white flex-shrink-0">
      {/* Logo area */}
      <div className="p-6 border-b border-white/10">
        <Link href="/" className="flex flex-col items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/fa-logo-white.png" alt="Frontier Angels" className="h-24 w-auto" />
          <span className="text-xs text-white/50 uppercase tracking-widest font-semibold">
            Member Portal
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {/* Investment Dashboard */}
          {renderNavItem(navItems[0])}

          {/* Frontier Funds dropdown */}
          {funds.length > 0 && (
            <li>
              <button
                type="button"
                onClick={() => setFundsOpen((o) => !o)}
                aria-expanded={fundsOpen}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  pathname.startsWith('/members/funds')
                    ? 'bg-white/10 text-white'
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                )}
              >
                <Layers className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1 text-left">Frontier Funds</span>
                <ChevronDown
                  className={cn('w-3.5 h-3.5 transition-transform', fundsOpen ? '' : '-rotate-90')}
                />
              </button>
              {fundsOpen && (
                <ul className="mt-1 ml-5 space-y-1 border-l border-white/10 pl-3">
                  {funds.map((fund) => {
                    const href = `/members/funds/${fund}`
                    const active = pathname === href
                    return (
                      <li key={fund}>
                        <Link
                          href={href}
                          className={cn(
                            'flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                            active
                              ? 'bg-white/10 text-white'
                              : 'text-white/60 hover:bg-white/5 hover:text-white'
                          )}
                        >
                          {fund}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              )}
            </li>
          )}

          {/* Remaining items */}
          {navItems.slice(1).map(renderNavItem)}
        </ul>
      </nav>

      {/* Bottom link back to the marketing site */}
      <div className="p-4 border-t border-white/10">
        <a
          href={process.env.NEXT_PUBLIC_MARKETING_URL || 'https://frontierangels.com'}
          className="flex items-center gap-2 text-xs text-white/40 hover:text-white/60 transition-colors"
        >
          ← Back to main site
        </a>
      </div>
    </aside>
  )
}
