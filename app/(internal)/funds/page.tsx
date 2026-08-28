import type { Metadata } from 'next'
import Link from 'next/link'
import { FileText, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export const metadata: Metadata = { title: 'Funds | FA Internal' }

const funds = [
  { short: 'FF3', name: 'Frontier Fund 3', built: false },
  { short: 'FF4', name: 'Frontier Fund 4', built: true },
  { short: 'FF5', name: 'Frontier Fund 5', built: false },
]

export default function FundsPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-navy-900">Funds</h1>
        <p className="text-navy-600 mt-1">
          Live, exportable semi-annual reports that mirror the PDF format 1:1.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {funds.map((f) => (
          <Link key={f.short} href={`/funds/${f.short}`} className="block">
            <Card bordered hoverable className="h-full">
              <CardContent className="pt-6 pb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-navy-900 text-white flex items-center justify-center font-bold text-sm">
                    {f.short}
                  </div>
                  <div>
                    <p className="font-serif font-semibold text-navy-900">{f.name}</p>
                    <p className="text-xs text-navy-500">
                      {f.built ? 'H2 2025 report ready' : 'Report — coming soon'}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-1.5 text-sm font-medium text-navy-700">
                  <FileText className="w-3.5 h-3.5" />
                  {f.built ? 'View report' : 'Preview'}
                  <ArrowRight className="w-3.5 h-3.5 ml-auto" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
