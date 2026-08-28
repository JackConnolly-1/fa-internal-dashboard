'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronUp, ChevronDown } from 'lucide-react'
import { CompanyLogo } from '@/components/members/company-logo'
import { formatCurrency, performanceColorClass } from '@/lib/utils'
import type { PortfolioCompany } from '@/lib/airtable'

const COLS =
  'grid grid-cols-[minmax(200px,2.4fr)_1.2fr_1fr_1fr_80px_90px_70px] gap-3 items-center'

type SortKey = 'name' | 'industry' | 'invested' | 'distributions' | 'moic' | 'rating' | 'investors'

const columns: {
  key: SortKey
  label: string
  align: 'left' | 'right' | 'center'
  get: (c: PortfolioCompany) => string | number | undefined
}[] = [
  { key: 'name', label: 'Company', align: 'left', get: (c) => c.name },
  { key: 'industry', label: 'Industry', align: 'left', get: (c) => c.industry },
  { key: 'invested', label: 'Invested', align: 'right', get: (c) => c.totalInvested },
  { key: 'distributions', label: 'Distributions', align: 'right', get: (c) => c.distributions },
  { key: 'moic', label: 'MOIC', align: 'right', get: (c) => c.moic },
  { key: 'rating', label: 'Rating', align: 'center', get: (c) => c.performanceScore },
  { key: 'investors', label: 'Investors', align: 'right', get: (c) => c.uniqueInvestors },
]

function moicColor(m?: number) {
  if (!m) return 'text-navy-400'
  if (m < 1) return 'text-red-600'
  if (m < 2) return 'text-amber-600'
  return 'text-green-600'
}

const alignClass = (a: string) =>
  a === 'right' ? 'justify-end text-right' : a === 'center' ? 'justify-center text-center' : 'justify-start text-left'

export function PortfolioTable({ companies }: { companies: PortfolioCompany[] }) {
  const [sortKey, setSortKey] = useState<SortKey>('moic')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  const col = columns.find((c) => c.key === sortKey)!
  const sorted = [...companies].sort((a, b) => {
    const av = col.get(a)
    const bv = col.get(b)
    const aEmpty = av === undefined || av === null || av === ''
    const bEmpty = bv === undefined || bv === null || bv === ''
    if (aEmpty && bEmpty) return 0
    if (aEmpty) return 1 // empties always sink to the bottom
    if (bEmpty) return -1
    const cmp =
      typeof av === 'number' && typeof bv === 'number' ? av - bv : String(av).localeCompare(String(bv))
    return sortDir === 'asc' ? cmp : -cmp
  })

  function toggle(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      // text columns default A→Z; numeric columns default high→low
      setSortDir(key === 'name' || key === 'industry' ? 'asc' : 'desc')
    }
  }

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[860px]">
        {/* Sortable header */}
        <div
          className={`${COLS} px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-navy-500 border-b border-navy-100 select-none`}
        >
          {columns.map((c) => (
            <button
              key={c.key}
              type="button"
              onClick={() => toggle(c.key)}
              className={`flex w-full items-center gap-1 hover:text-navy-800 transition-colors ${alignClass(c.align)} ${
                sortKey === c.key ? 'text-navy-800' : ''
              }`}
            >
              <span>{c.label}</span>
              {sortKey === c.key &&
                (sortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
            </button>
          ))}
        </div>

        {/* Rows */}
        {sorted.map((c) => (
          <Link
            key={c.id}
            href={`/portfolio/${c.id}`}
            className={`${COLS} px-4 py-3 border-b border-navy-50 hover:bg-navy-50/60 transition-colors`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <CompanyLogo src={c.logoUrl} alt={c.name} size={36} />
              <span className="font-semibold text-navy-900 text-sm truncate">{c.name}</span>
            </div>
            <div className="text-sm text-navy-600 truncate">{c.industry || '—'}</div>
            <div className="text-right text-sm font-medium text-navy-900">
              {c.totalInvested ? formatCurrency(c.totalInvested) : '—'}
            </div>
            <div className="text-right text-sm text-navy-700">
              {c.distributions ? formatCurrency(c.distributions) : '—'}
            </div>
            <div className={`text-right text-sm font-semibold ${moicColor(c.moic)}`}>
              {c.moic ? `${c.moic.toFixed(2)}x` : '—'}
            </div>
            <div className="text-center">
              {c.performanceScore ? (
                <span className={`text-sm font-bold ${performanceColorClass(c.performanceScore)}`}>
                  {c.performanceScore.toFixed(1)}
                </span>
              ) : (
                <span className="text-sm text-navy-300">—</span>
              )}
            </div>
            <div className="text-right text-sm text-navy-600">{c.uniqueInvestors ?? '—'}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
