'use client'

import React, { useState, useMemo } from 'react'
import { Search, Filter, X, ChevronDown, ChevronRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { formatDate, formatCurrency } from '@/lib/utils'

interface Transaction {
  id: string
  portfolioCompanyIds: string[]
  portfolioCompanyName?: string
  amount: number
  date?: string
  type?: string
  detailedType?: string
  companyName?: string // enriched
}

interface PortfolioTransactionsProps {
  transactions: Transaction[]
}

function fmt(v: number) {
  if (!v) return '—'
  return formatCurrency(v)
}

export default function PortfolioTransactions({ transactions }: PortfolioTransactionsProps) {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [yearFilter, setYearFilter] = useState('all')
  // Collapse every year by default except the most recent one
  const [collapsedYears, setCollapsedYears] = useState<Set<string>>(() => {
    const yrs = Array.from(
      new Set(transactions.map((t) => t.date?.slice(0, 4) || 'Unknown'))
    ).sort((a, b) => b.localeCompare(a))
    return new Set(yrs.slice(1))
  })

  const toggleYear = (year: string) => {
    setCollapsedYears((prev) => {
      const next = new Set(prev)
      if (next.has(year)) next.delete(year)
      else next.add(year)
      return next
    })
  }

  // Derive unique types and years for filter dropdowns
  const uniqueTypes = useMemo(() => {
    const types = new Set(transactions.map((t) => t.type).filter(Boolean) as string[])
    return Array.from(types).sort()
  }, [transactions])

  const uniqueYears = useMemo(() => {
    const years = new Set(transactions.map((t) => t.date?.slice(0, 4)).filter(Boolean) as string[])
    return Array.from(years).sort((a, b) => b.localeCompare(a))
  }, [transactions])

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const name = (t.portfolioCompanyName || t.companyName || '').toLowerCase()
      if (search && !name.includes(search.toLowerCase())) return false
      if (typeFilter !== 'all' && t.type !== typeFilter) return false
      if (yearFilter !== 'all' && t.date?.slice(0, 4) !== yearFilter) return false
      return true
    })
  }, [transactions, search, typeFilter, yearFilter])

  // Group filtered results by year
  const byYear = useMemo(() => {
    const map = new Map<string, Transaction[]>()
    for (const t of filtered) {
      const year = t.date?.slice(0, 4) || 'Unknown'
      if (!map.has(year)) map.set(year, [])
      map.get(year)!.push(t)
    }
    return map
  }, [filtered])

  const years = Array.from(byYear.keys()).sort((a, b) => b.localeCompare(a))

  const activeFilters = [search, typeFilter !== 'all' ? typeFilter : '', yearFilter !== 'all' ? yearFilter : ''].filter(Boolean)

  return (
    <div className="space-y-4">
      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-300 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-navy-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-300 hover:text-navy-700">
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Type filter */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-300 w-4 h-4" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="pl-9 pr-8 py-2 border border-navy-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 appearance-none bg-white min-w-[180px]"
          >
            <option value="all">All Types</option>
            {uniqueTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Year filter */}
        <div className="relative">
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="px-3 py-2 border border-navy-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 appearance-none bg-white min-w-[100px]"
          >
            <option value="all">All Years</option>
            {uniqueYears.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Active filter chips + result count */}
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {search && (
            <span className="inline-flex items-center gap-1 text-xs bg-navy-50 text-navy-700 px-2 py-1 rounded-full border border-navy-200">
              Company: "{search}"
              <button onClick={() => setSearch('')}><X className="w-3 h-3" /></button>
            </span>
          )}
          {typeFilter !== 'all' && (
            <span className="inline-flex items-center gap-1 text-xs bg-gold-100 text-gold-700 px-2 py-1 rounded-full border border-gold-300">
              Type: {typeFilter}
              <button onClick={() => setTypeFilter('all')}><X className="w-3 h-3" /></button>
            </span>
          )}
          {yearFilter !== 'all' && (
            <span className="inline-flex items-center gap-1 text-xs bg-navy-100 text-navy-700 px-2 py-1 rounded-full border border-navy-200">
              Year: {yearFilter}
              <button onClick={() => setYearFilter('all')}><X className="w-3 h-3" /></button>
            </span>
          )}
          {activeFilters.length > 0 && (
            <button
              onClick={() => { setSearch(''); setTypeFilter('all'); setYearFilter('all') }}
              className="text-xs text-navy-400 hover:text-navy-700 underline"
            >
              Clear all
            </button>
          )}
        </div>
        <span className="text-xs text-navy-300">
          {filtered.length} of {transactions.length} transactions
        </span>
      </div>

      {/* Empty state */}
      {filtered.length === 0 ? (
        <Card bordered>
          <CardContent className="py-8 text-center text-navy-300">No transactions match your filters.</CardContent>
        </Card>
      ) : (
        // Grouped by year, collapsible
        <div className="space-y-2">
          {years.map((year) => {
            const yearTxs = byYear.get(year)!
            const isCollapsed = collapsedYears.has(year)
            const yearTotal = yearTxs
              .filter((t) => {
                const type = (t.type || '').toLowerCase()
                if (type.includes('refund') || type.includes('reversal')) return false
                return type.includes('invest') || type.includes('contribution') || !t.type
              })
              .reduce((s, t) => s + t.amount, 0)
            return (
              <div key={year}>
                {/* Year header — click to expand/collapse */}
                <button
                  onClick={() => toggleYear(year)}
                  className="w-full flex items-center gap-3 py-2 text-left group"
                >
                  {isCollapsed
                    ? <ChevronRight className="w-4 h-4 text-navy-300 flex-shrink-0" />
                    : <ChevronDown className="w-4 h-4 text-navy-300 flex-shrink-0" />
                  }
                  <h3 className="text-sm font-semibold text-navy-700 group-hover:text-navy-700">{year}</h3>
                  <div className="flex-1 h-px bg-navy-100" />
                  <span className="text-xs text-navy-300">
                    {yearTxs.length} transaction{yearTxs.length !== 1 ? 's' : ''}
                    {yearTotal > 0 ? ` · ${fmt(yearTotal)} invested` : ''}
                  </span>
                </button>

                {/* Transactions — hidden when collapsed */}
                {!isCollapsed && (
                  <Card bordered className="mb-4">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-navy-100 bg-navy-50">
                            {['Date', 'Company', 'Amount', 'Type', 'Detailed Type'].map((h) => (
                              <th key={h} className="text-left text-xs font-semibold text-navy-400 uppercase tracking-wider px-4 py-3 whitespace-nowrap">
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {yearTxs.map((t) => (
                            <tr key={t.id} className="border-b border-navy-100 hover:bg-navy-50">
                              <td className="px-4 py-3 text-navy-700 whitespace-nowrap">
                                {t.date ? formatDate(t.date, 'short') : '—'}
                              </td>
                              <td className="px-4 py-3 font-medium text-navy-800 whitespace-nowrap">
                                {t.portfolioCompanyName || t.companyName || '—'}
                              </td>
                              <td className="px-4 py-3 text-navy-700">{fmt(t.amount)}</td>
                              <td className="px-4 py-3 text-navy-700">{t.type || '—'}</td>
                              <td className="px-4 py-3 text-navy-700">{t.detailedType || '—'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
