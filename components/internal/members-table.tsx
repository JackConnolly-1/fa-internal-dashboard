'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronUp, ChevronDown } from 'lucide-react'
import { formatCurrency, performanceColorClass } from '@/lib/utils'
import type { MemberPortfolio } from '@/lib/airtable'

const COLS =
  'grid grid-cols-[minmax(180px,2fr)_1fr_1.2fr_80px_80px_80px_1.2fr] gap-3 items-center'

type SortKey = 'name' | 'status' | 'invested' | 'companies' | 'rating' | 'moic' | 'value'

const columns: {
  key: SortKey
  label: string
  align: 'left' | 'right' | 'center'
  get: (m: MemberPortfolio) => string | number | undefined
}[] = [
  { key: 'name', label: 'Member', align: 'left', get: (m) => m.name },
  { key: 'status', label: 'Status', align: 'left', get: (m) => m.status },
  { key: 'invested', label: 'Invested', align: 'right', get: (m) => m.totalInvested },
  { key: 'companies', label: 'Cos.', align: 'right', get: (m) => m.companyCount },
  { key: 'rating', label: 'Rating', align: 'center', get: (m) => m.overallRating },
  { key: 'moic', label: 'MOIC', align: 'right', get: (m) => m.totalMoic },
  { key: 'value', label: 'Ind. Value', align: 'right', get: (m) => m.indicativeValue },
]

function moicColor(m?: number) {
  if (!m) return 'text-navy-400'
  if (m < 1) return 'text-red-600'
  if (m < 2) return 'text-amber-600'
  return 'text-green-600'
}
const alignClass = (a: string) =>
  a === 'right' ? 'justify-end text-right' : a === 'center' ? 'justify-center text-center' : 'justify-start text-left'

export function MembersTable({ members }: { members: MemberPortfolio[] }) {
  const [sortKey, setSortKey] = useState<SortKey>('invested')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  const col = columns.find((c) => c.key === sortKey)!
  const sorted = [...members].sort((a, b) => {
    const av = col.get(a)
    const bv = col.get(b)
    const aEmpty = av === undefined || av === null || av === ''
    const bEmpty = bv === undefined || bv === null || bv === ''
    if (aEmpty && bEmpty) return 0
    if (aEmpty) return 1
    if (bEmpty) return -1
    const cmp =
      typeof av === 'number' && typeof bv === 'number' ? av - bv : String(av).localeCompare(String(bv))
    return sortDir === 'asc' ? cmp : -cmp
  })

  function toggle(key: SortKey) {
    if (key === sortKey) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else {
      setSortKey(key)
      setSortDir(key === 'name' || key === 'status' ? 'asc' : 'desc')
    }
  }

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[820px]">
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

        {sorted.map((m) => (
          <Link
            key={m.id}
            href={`/members/${m.id}`}
            className={`${COLS} px-4 py-3 border-b border-navy-50 hover:bg-navy-50/60 transition-colors`}
          >
            <span className="font-semibold text-navy-900 text-sm truncate">{m.name}</span>
            <span className="text-sm text-navy-600 truncate">{m.status || '—'}</span>
            <span className="text-right text-sm font-medium text-navy-900">
              {formatCurrency(m.totalInvested)}
            </span>
            <span className="text-right text-sm text-navy-600">{m.companyCount}</span>
            <span className="text-center">
              {m.overallRating ? (
                <span className={`text-sm font-bold ${performanceColorClass(m.overallRating)}`}>
                  {m.overallRating.toFixed(1)}
                </span>
              ) : (
                <span className="text-sm text-navy-300">—</span>
              )}
            </span>
            <span className={`text-right text-sm font-semibold ${moicColor(m.totalMoic)}`}>
              {m.totalMoic ? `${m.totalMoic.toFixed(2)}x` : '—'}
            </span>
            <span className="text-right text-sm text-navy-700">
              {m.indicativeValue ? formatCurrency(m.indicativeValue) : '—'}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
