import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { CompanyLogo } from '@/components/members/company-logo'
import { getMemberPortfolios } from '@/lib/airtable'
import { formatCurrency, performanceColorClass } from '@/lib/utils'

export const metadata: Metadata = { title: 'Member | FA Internal' }

function moicColor(m?: number) {
  if (!m) return 'text-navy-400'
  if (m < 1) return 'text-red-600'
  if (m < 2) return 'text-amber-600'
  return 'text-green-600'
}

export default async function MemberDetailPage({ params }: { params: { id: string } }) {
  const members = await getMemberPortfolios()
  const member = members.find((m) => m.id === params.id)
  if (!member) notFound()

  const kpis = [
    { label: 'Total Invested', value: formatCurrency(member.totalInvested) },
    { label: 'Companies', value: String(member.companyCount) },
    {
      label: 'Portfolio Rating',
      value: member.overallRating ? member.overallRating.toFixed(1) : '—',
      className: performanceColorClass(member.overallRating),
    },
    {
      label: 'Portfolio MOIC',
      value: member.totalMoic ? `${member.totalMoic.toFixed(2)}x` : '—',
      className: moicColor(member.totalMoic),
    },
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Link href="/members" className="inline-flex items-center gap-1.5 text-sm text-navy-600 hover:text-navy-900">
        <ArrowLeft className="w-4 h-4" /> Back to members
      </Link>

      {/* Header */}
      <Card bordered>
        <CardContent className="pt-6">
          <h1 className="text-2xl font-serif font-bold text-navy-900">{member.name}</h1>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-sm text-navy-600">
            {member.status && <span>{member.status}</span>}
            {member.email && (
              <>
                <span className="text-navy-300">·</span>
                <a href={`mailto:${member.email}`} className="hover:text-gold-600">{member.email}</a>
              </>
            )}
            {member.indicativeValue && (
              <>
                <span className="text-navy-300">·</span>
                <span>Indicative value {formatCurrency(member.indicativeValue)}</span>
              </>
            )}
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

      {/* Holdings */}
      <section>
        <h2 className="text-lg font-serif font-semibold text-navy-800 mb-4">
          Holdings by Company ({member.companyCount})
        </h2>
        <Card bordered>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <div className="min-w-[720px]">
                <div className="grid grid-cols-[minmax(200px,2.4fr)_1.1fr_80px_80px_1.1fr] gap-3 items-center px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-navy-500 border-b border-navy-100">
                  <div>Company</div>
                  <div className="text-right">Invested</div>
                  <div className="text-center">Rating</div>
                  <div className="text-right">MOIC</div>
                  <div className="text-right">Ind. Value</div>
                </div>
                {member.holdings.map((h) => (
                  <Link
                    key={h.companyId}
                    href={`/portfolio/${h.companyId}`}
                    className="grid grid-cols-[minmax(200px,2.4fr)_1.1fr_80px_80px_1.1fr] gap-3 items-center px-4 py-3 border-b border-navy-50 hover:bg-navy-50/60 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <CompanyLogo src={h.logoUrl} alt={h.companyName} size={32} />
                      <span className="font-semibold text-navy-900 text-sm truncate">{h.companyName}</span>
                    </div>
                    <div className="text-right text-sm font-medium text-navy-900">{formatCurrency(h.invested)}</div>
                    <div className="text-center">
                      {h.rating ? (
                        <span className={`text-sm font-bold ${performanceColorClass(h.rating)}`}>
                          {h.rating.toFixed(1)}
                        </span>
                      ) : (
                        <span className="text-sm text-navy-300">—</span>
                      )}
                    </div>
                    <div className={`text-right text-sm font-semibold ${moicColor(h.moic)}`}>
                      {h.moic ? `${h.moic.toFixed(2)}x` : '—'}
                    </div>
                    <div className="text-right text-sm text-navy-700">
                      {h.indicativeValue ? formatCurrency(h.indicativeValue) : '—'}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
