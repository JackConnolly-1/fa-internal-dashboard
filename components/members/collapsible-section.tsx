'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

/**
 * A section with a clickable header that collapses/expands its content with a
 * smooth height + fade animation. Children are rendered by the server and passed
 * through, so this works with server-rendered content.
 */
export function CollapsibleSection({
  id,
  title,
  subtitle,
  defaultOpen = true,
  children,
}: {
  id?: string
  title: string
  subtitle?: string
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <section id={id} className="scroll-mt-6">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex items-start gap-2 w-full text-left mb-4 group"
      >
        <ChevronDown
          className={`w-5 h-5 mt-0.5 text-navy-600 transition-transform duration-300 group-hover:text-navy-800 ${
            open ? '' : '-rotate-90'
          }`}
        />
        <div>
          <h2 className="text-lg font-serif font-semibold text-navy-800">{title}</h2>
          {subtitle && <p className="text-sm text-navy-700 mt-0.5">{subtitle}</p>}
        </div>
      </button>

      {/* grid-rows 1fr/0fr trick animates height without knowing content size */}
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">{children}</div>
      </div>
    </section>
  )
}
