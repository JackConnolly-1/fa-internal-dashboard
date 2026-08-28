import type { Metadata } from 'next'
import { Card, CardContent } from '@/components/ui/card'
import { PortfolioTable } from '@/components/internal/portfolio-table'
import { getAllPortfolioCompanies } from '@/lib/airtable'
import { formatCurrency } from '@/lib/utils'

export const metadata: Metadata = { title: 'Portfolio | FA Internal' }

function moicColor(m?: number) {
  if (!m) return 'text-navy-400'
  if (m < 1) return 'text-red-600'
  if (m < 2) return 'text-amber-600'
  return 'text-green-600'
}

export default async function PortfolioPage() {
  const companies = await getAllPortfolioCompanies()

  const totalInvested = companies.reduce((s, c) => s + (c.totalInvested || 0), 0)
  const totalDistributions = companies.reduce((s, c) => s + (c.distributions || 0), 0)
  const weighted = companies.reduce(
    (acc, c) => {
      if (c.totalInvested && c.moic) {
        acc.inv += c.totalInvested
        acc.val += c.totalInvested * c.moic
      }
      return acc
    },
    { inv: 0, val: 0 }
  )
  const blendedMoic = weighted.inv ? weighted.val / weighted.inv : undefined

  const kpis = [
    { label: 'Companies', value: String(companies.length) },
    { label: 'Total Invested', value: formatCurrency(totalInvested) },
    { label: 'Distributions', value: formatCurrency(totalDistributions) },
    {
      label: 'Blended MOIC',
      value: blendedMoic ? `${blendedMoic.toFixed(2)}x` : '—',
      className: moicColor(blendedMoic),
    },
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-navy-900">Portfolio</h1>
        <p className="text-navy-600 mt-1">All portfolio companies across every investor and fund.</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <Card key={k.label} bordered>
            <CardContent className="pt-5 pb-5">
              <p className="text-xs font-medium text-navy-500 uppercase tracking-wider">{k.label}</p>
              <p className={`text-2xl font-bold mt-1 ${k.className || 'text-navy-900'}`}>{k.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table (sortable — click any column header) */}
      <Card bordered>
        <CardContent className="p-0">
          <PortfolioTable companies={companies} />
        </CardContent>
      </Card>
    </div>
  )
}
