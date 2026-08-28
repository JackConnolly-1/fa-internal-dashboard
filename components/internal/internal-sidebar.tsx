'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Building2, Users, Layers, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { label: 'Portfolio', href: '/portfolio', icon: Building2 },
  { label: 'Members', href: '/members', icon: Users },
  { label: 'Funds', href: '/funds', icon: Layers },
]

export function InternalSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex flex-col w-60 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto bg-navy-900 text-white flex-shrink-0">
      <div className="p-6 border-b border-white/10">
        <Link href="/portfolio" className="flex flex-col items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/fa-logo-white.png" alt="Frontier Angels" className="h-20 w-auto" />
          <span className="text-xs text-gold-400 uppercase tracking-widest font-semibold">
            Internal Dashboard
          </span>
        </Link>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    active ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'
                  )}
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  <span className="flex-1">{item.label}</span>
                  {active && <ChevronRight className="w-3 h-3 text-gold-400" />}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-white/10">
        <p className="text-[11px] text-white/40 leading-relaxed">
          Frontier Angels — GP / admin view. All member &amp; fund data.
        </p>
      </div>
    </aside>
  )
}
