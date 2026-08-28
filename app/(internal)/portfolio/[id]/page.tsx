import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { CompanyLogo } from '@/components/members/company-logo'
import { getPortfolioCompaniesByIds, getCompanyTransactions } from '@/lib/airtable'
import { formatCurrency, formatDate, performanceColorClass } from '@/lib/utils'

export const metadata: Metadata = { title: 'Company | FA Internal' }

const isInvestment = (t?: string) => {
  const s = (t || '').toLowerCase()
  return s.includes('investment') || s.includes('contribution') || s.includes('conversion')
}
const isPayout = (t?: string) => {
  const s = (t || '').toLowerCase()
  return s.includes('payout') || s.includes('distribution')
}

export default async function CompanyDetailPage({ params }: { params: { id: string } }) {
  const [company] = await getPortfolioCompaniesByIds([params.id])
  if (!company) notFound()

  const txns = await getCompanyTransactions(company.name)

  // Group transactions into rounds
  const roundMap = new Map<string, { round: string; security?: string; invested: number; count: number }>()
  for (const t of txns) {
    const key = t.round || t.roundType || 'Unspecified'
    const e = roundMap.get(key) || { round: key, security: t.security, invested: 0, count: 0 }
    if (isInvestment(t.umbrellaType)) e.invested += t.amount
    if (!e.security && t.security) e.security = t.security
    e.count++
    roundMap.set(key, e)
  }
  const rounds = Array.from(roundMap.values()).sort((a, b) => b.invested - a.invested)

  const kpis = [
    { label: 'Total Invested', value: company.totalInvested ? formatCurrency(company.totalInvested) : '—' },
    { label: 'Distributions', value: company.distributions ? formatCurrency(company.distributions) : '—' },
    {
      label: 'Indicative MOIC',
      value: company.moic ? `${company.moic.toFixed(2)}x` : '—',
      className: company.moic ? (company.moic < 1 ? 'text-red-600' : company.moic < 2 ? 'text-amber-600' : 'text-green-600') : '',
    },
    {
      label: 'Latest Rating',
      value: company.performanceScore ? company.performanceScore.toFixed(1) : '—',
      className: performanceColorClass(company.performanceScore),
    },
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Link href="/portfolio" className="inline-flex items-center gap-1.5 text-sm text-navy-600 hover:text-navy-900">
        <ArrowLeft className="w-4 h-4" /> Back to portfolio
      </Link>

      {/* Header */}
      <Card bordered>
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <CompanyLogo src={company.logoUrl} alt={company.name} size={64} />
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-serif font-bold text-navy-900">{company.name}</h1>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-sm text-navy-600">
                {company.industry && <span>{company.industry}</span>}
                {company.status && (
                  <>
                    <span className="text-navy-300">·</span>
                    <span>{company.status}</span>
                  </>
                )}
                {company.scoreCategory && (
                  <>
                    <span className="text-navy-300">·</span>
                    <span>{company.scoreCategory}</span>
                  </>
                )}
              </div>
              {company.description && (
                <p className="mt-3 text-sm text-navy-700 leading-relaxed line-clamp-3">{company.description}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPIs */}
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

      {/* Rounds */}
      <section>
        <h2 className="text-lg font-serif font-semibold text-navy-800 mb-4">
          Investment Rounds{rounds.length ? ` (${rounds.length})` : ''}
        </h2>
        {rounds.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {rounds.map((r) => (
              <Card key={r.round} bordered>
                <CardContent className="pt-5">
                  <p className="font-semibold text-navy-900">{r.round}</p>
                  <p className="text-xs text-navy-500 mt-0.5">{r.security || 'Instrument n/a'}</p>
                  <p className="text-xl font-bold text-navy-900 mt-3">{formatCurrency(r.invested)}</p>
                  <p className="text-xs text-navy-500">{r.count} transaction{r.count !== 1 ? 's' : ''}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card bordered>
            <CardContent className="py-8 text-center text-sm text-navy-500">
              No transactions found for this company.
            </CardContent>
          </Card>
        )}
      </section>

      {/* All transactions */}
      {txns.length > 0 && (
        <section>
          <h2 className="text-lg font-serif font-semibold text-navy-800 mb-4">
            All Transactions ({txns.length})
          </h2>
          <Card bordered>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-sm">
                  <thead>
                    <tr className="text-[11px] uppercase tracking-wider text-navy-500 border-b border-navy-100">
                      <th className="text-left font-semibold px-4 py-3">Date</th>
                      <th className="text-left font-semibold px-4 py-3">Type</th>
                      <th className="text-left font-semibold px-4 py-3">Round</th>
                      <th className="text-left font-semibold px-4 py-3">Security</th>
                      <th className="text-right font-semibold px-4 py-3">Shares</th>
                      <th className="text-right font-semibold px-4 py-3">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {txns.map((t) => (
                      <tr key={t.id} className="border-b border-navy-50">
                        <td className="px-4 py-2.5 text-navy-600 whitespace-nowrap">
                          {t.date ? formatDate(t.date, 'short') : '—'}
                        </td>
                        <td className="px-4 py-2.5 text-navy-800">
                          {t.umbrellaType || '—'}
                          {t.detailedType && (
                            <span className="block text-xs text-navy-400">{t.detailedType}</span>
                          )}
                        </td>
                        <td className="px-4 py-2.5 text-navy-600">{t.round || t.roundType || '—'}</td>
                        <td className="px-4 py-2.5 text-navy-600">{t.security || '—'}</td>
                        <td className="px-4 py-2.5 text-right text-navy-600 whitespace-nowrap">
                          {t.shares ? t.shares.toLocaleString() : '—'}
                        </td>
                        <td
                          className={`px-4 py-2.5 text-right font-medium whitespace-nowrap ${
                            isPayout(t.umbrellaType) ? 'text-green-600' : 'text-navy-900'
                          }`}
                        >
                          {t.amount ? formatCurrency(t.amount) : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </section>
      )}
    </div>
  )
}
