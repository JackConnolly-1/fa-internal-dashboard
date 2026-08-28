import type { Metadata } from 'next'
import { Card, CardContent } from '@/components/ui/card'
import { MembersTable } from '@/components/internal/members-table'
import { getMemberPortfolios } from '@/lib/airtable'
import { formatCurrency } from '@/lib/utils'

export const metadata: Metadata = { title: 'Members | FA Internal' }

export default async function MembersPage() {
  const members = await getMemberPortfolios()

  const totalInvested = members.reduce((s, m) => s + m.totalInvested, 0)
  const moicInv = members.reduce((s, m) => s + (m.indicativeValue ? m.totalInvested : 0), 0)
  const moicVal = members.reduce((s, m) => s + (m.indicativeValue || 0), 0)
  const blendedMoic = moicInv ? moicVal / moicInv : undefined

  const kpis = [
    { label: 'Members Investing', value: String(members.length) },
    { label: 'Total Invested (direct)', value: formatCurrency(totalInvested) },
    { label: 'Indicative Value', value: moicVal ? formatCurrency(moicVal) : '—' },
    {
      label: 'Blended MOIC',
      value: blendedMoic ? `${blendedMoic.toFixed(2)}x` : '—',
      className: blendedMoic ? (blendedMoic < 1 ? 'text-red-600' : blendedMoic < 2 ? 'text-amber-600' : 'text-green-600') : '',
    },
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-navy-900">Members</h1>
        <p className="text-navy-600 mt-1">
          Every member with direct investments — $ invested, invested-weighted rating &amp; MOIC.
        </p>
      </div>

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

      <Card bordered>
        <CardContent className="p-0">
          <MembersTable members={members} />
        </CardContent>
      </Card>
    </div>
  )
}
