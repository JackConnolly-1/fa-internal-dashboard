import { performanceColorClass } from '@/lib/utils'
import type { PortfolioHealthRecord } from '@/lib/airtable'

const CATEGORIES: { label: string; get: (r: PortfolioHealthRecord) => number | undefined }[] = [
  { label: 'Current Sales', get: (r) => r.customerRevenue },
  { label: 'Sales Pipeline', get: (r) => r.salesPipeline },
  { label: 'Partners', get: (r) => r.partners },
  { label: 'Cash on Hand', get: (r) => r.cashOnHand },
  { label: 'Team', get: (r) => r.team },
  { label: 'Est. Value', get: (r) => r.estimatedValue },
]

// Per-value box styling: 1 = red, 2 = amber, 3 = green. Active is solid, others faded.
const BOX: Record<number, { on: string; off: string }> = {
  1: { on: 'bg-red-500 text-white shadow-sm', off: 'bg-red-100 text-red-400' },
  2: { on: 'bg-amber-500 text-white shadow-sm', off: 'bg-amber-100 text-amber-500' },
  3: { on: 'bg-green-500 text-white shadow-sm', off: 'bg-green-100 text-green-500' },
}

function scoreLabel(score?: number): string {
  if (!score) return '—'
  if (score < 1.6) return 'Sinking'
  if (score <= 2.3) return 'Swimming'
  return 'Surfing'
}

/** Per-category 1/2/3 boxes (red/amber/green) with the achieved value marked. */
export function CompanyScoreBars({ record }: { record: PortfolioHealthRecord }) {
  return (
    <div>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-y-4">
        {CATEGORIES.map((c) => {
          const score = c.get(record)
          const active = score ? Math.min(3, Math.max(1, Math.round(score))) : 0
          return (
            <div
              key={c.label}
              className="flex flex-col items-center justify-between px-2 border-navy-100 border-l [&:nth-child(3n+1)]:border-l-0 sm:[&:nth-child(3n+1)]:border-l sm:[&:nth-child(6n+1)]:border-l-0"
            >
              <div className="flex flex-col gap-1.5">
                {[3, 2, 1].map((v) => {
                  const isOn = v === active
                  return (
                    <div
                      key={v}
                      className={`w-9 h-9 rounded-md flex items-center justify-center text-sm font-semibold ${
                        isOn ? BOX[v].on : `${BOX[v].off} opacity-60`
                      }`}
                    >
                      {v}
                    </div>
                  )
                })}
              </div>
              <span className="mt-2 text-sm font-semibold leading-tight text-navy-800 text-center">
                {c.label}
              </span>
            </div>
          )
        })}
      </div>

      {/* Overall — the result of the category scores */}
      {record.overallScore ? (
        <div className="mt-5 pt-4 border-t border-navy-100 flex items-center justify-between">
          <span className="text-base font-semibold text-navy-800">Overall Score</span>
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-serif font-bold ${performanceColorClass(record.overallScore)}`}>
              {record.overallScore.toFixed(1)}
            </span>
            <span className="text-sm text-navy-700">{scoreLabel(record.overallScore)}</span>
          </div>
        </div>
      ) : null}
    </div>
  )
}
