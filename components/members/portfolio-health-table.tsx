'use client'

import React, { useState, useMemo } from 'react'
import { Search, Calendar, Filter, ChevronDown, ChevronUp, Video, DollarSign } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { formatDate } from '@/lib/utils'

interface PortfolioHealthAttachment {
  id: string
  url: string
  filename: string
  size?: number
  type?: string
  thumbnails?: { small?: { url: string }; large?: { url: string } }
}

interface PortfolioHealthRecord {
  id: string
  companyIds: string[]
  companyName?: string
  lastScored?: string
  customerRevenue?: number
  salesPipeline?: number
  partners?: number
  cashOnHand?: number
  team?: number
  estimatedValue?: number
  overallScore?: number
  summaryOutlook?: string
  nextSteps?: string
  attachments?: PortfolioHealthAttachment[]
  videoLink?: string
  reportingPeriod?: string
  seekingFinancing?: boolean
  financingNotes?: string
}

function scoreColor(score: number | undefined) {
  if (!score) return 'bg-navy-100 text-navy-700'
  if (score < 1.6) return 'bg-red-100 text-red-700'
  if (score <= 2.3) return 'bg-yellow-100 text-yellow-700'
  return 'bg-green-100 text-green-700'
}

function scoreLabel(score: number | undefined) {
  if (!score) return '—'
  if (score < 1.6) return 'Sinking'
  if (score <= 2.3) return 'Swimming'
  return 'Surfing'
}

function RatingBadge({ score }: { score: number | undefined }) {
  if (score === undefined || score === null) return <span className="text-navy-600">—</span>
  return (
    <span
      className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold ${scoreColor(score)}`}
      title={scoreLabel(score)}
    >
      {score.toFixed(0)}
    </span>
  )
}

function fileIcon(filename: string) {
  const ext = filename.split('.').pop()?.toLowerCase()
  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) return '🖼️'
  if (['pdf'].includes(ext || '')) return '📄'
  if (['ppt', 'pptx'].includes(ext || '')) return '📊'
  if (['doc', 'docx'].includes(ext || '')) return '📝'
  if (['xls', 'xlsx'].includes(ext || '')) return '📊'
  return '📎'
}

function formatFileSize(bytes?: number) {
  if (!bytes) return ''
  if (bytes < 1024) return `${bytes}B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`
  return `${(bytes / 1024 / 1024).toFixed(1)}MB`
}

interface PortfolioHealthTableProps {
  records: PortfolioHealthRecord[]
}

type DateFilter = 'all' | 'recent' | 'old'
type ScoreFilter = 'all' | 'surfing' | 'swimming' | 'sinking'

export default function PortfolioHealthTable({ records }: PortfolioHealthTableProps) {
  const [search, setSearch] = useState('')
  const [dateFilter, setDateFilter] = useState<DateFilter>('all')
  const [scoreFilter, setScoreFilter] = useState<ScoreFilter>('all')
  const [expandedRow, setExpandedRow] = useState<string | null>(null)

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      if (search && !record.companyName?.toLowerCase().includes(search.toLowerCase())) return false
      if (dateFilter !== 'all' && record.lastScored) {
        const scoredDate = new Date(record.lastScored)
        const sixMonthsAgo = new Date()
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
        if (dateFilter === 'recent' && scoredDate < sixMonthsAgo) return false
        if (dateFilter === 'old' && scoredDate >= sixMonthsAgo) return false
      }
      if (scoreFilter !== 'all' && record.overallScore !== undefined) {
        if (scoreFilter === 'surfing' && record.overallScore <= 2.3) return false
        if (scoreFilter === 'swimming' && (record.overallScore < 1.6 || record.overallScore > 2.3)) return false
        if (scoreFilter === 'sinking' && record.overallScore >= 1.6) return false
      }
      return true
    })
  }, [records, search, dateFilter, scoreFilter])

  const hasDetail = (r: PortfolioHealthRecord) =>
    r.summaryOutlook || r.nextSteps || (r.attachments && r.attachments.length > 0) || r.videoLink

  return (
    <div className="space-y-4">
      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-navy-600 w-4 h-4" />
          <input
            type="text"
            placeholder="Search company name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-navy-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-navy-600 w-4 h-4" />
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as DateFilter)}
              className="pl-9 pr-8 py-2 border border-navy-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 appearance-none bg-white w-[140px]"
            >
              <option value="all">All Dates</option>
              <option value="recent">Last 6 Months</option>
              <option value="old">Older</option>
            </select>
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-navy-600 w-4 h-4" />
            <select
              value={scoreFilter}
              onChange={(e) => setScoreFilter(e.target.value as ScoreFilter)}
              className="pl-9 pr-8 py-2 border border-navy-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 appearance-none bg-white w-[140px]"
            >
              <option value="all">All Ratings</option>
              <option value="surfing">Surfing</option>
              <option value="swimming">Swimming</option>
              <option value="sinking">Sinking</option>
            </select>
          </div>
        </div>
      </div>

      <div className="text-sm text-navy-700">
        Showing {filteredRecords.length} of {records.length} companies
      </div>

      {/* Table */}
      <Card bordered>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-navy-100 bg-navy-50">
                <th className="text-left text-xs font-semibold text-navy-700 uppercase tracking-wider px-4 py-3 whitespace-nowrap w-8"></th>
                <th className="text-left text-xs font-semibold text-navy-700 uppercase tracking-wider px-4 py-3 whitespace-nowrap">Company</th>
                <th className="text-left text-xs font-semibold text-navy-700 uppercase tracking-wider px-4 py-3 whitespace-nowrap">Last Scored</th>
                <th className="text-center text-xs font-semibold text-navy-700 uppercase tracking-wider px-4 py-3 whitespace-nowrap">Cust/Rev</th>
                <th className="text-center text-xs font-semibold text-navy-700 uppercase tracking-wider px-4 py-3 whitespace-nowrap">Pipeline</th>
                <th className="text-center text-xs font-semibold text-navy-700 uppercase tracking-wider px-4 py-3 whitespace-nowrap">Partners</th>
                <th className="text-center text-xs font-semibold text-navy-700 uppercase tracking-wider px-4 py-3 whitespace-nowrap">Cash</th>
                <th className="text-center text-xs font-semibold text-navy-700 uppercase tracking-wider px-4 py-3 whitespace-nowrap">Team</th>
                <th className="text-center text-xs font-semibold text-navy-700 uppercase tracking-wider px-4 py-3 whitespace-nowrap">Est. Value</th>
                <th className="text-center text-xs font-semibold text-navy-700 uppercase tracking-wider px-4 py-3 whitespace-nowrap">Overall</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center text-navy-600 py-8 px-4">
                    No portfolio health data matching filters.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((h) => {
                  const isExpanded = expandedRow === h.id
                  const canExpand = hasDetail(h)
                  return (
                    <React.Fragment key={h.id}>
                      <tr
                        className={`border-b border-navy-100 ${canExpand ? 'hover:bg-navy-50 cursor-pointer' : ''} ${isExpanded ? 'bg-navy-50' : ''}`}
                        onClick={() => canExpand && setExpandedRow(isExpanded ? null : h.id)}
                      >
                        {/* Expand toggle */}
                        <td className="px-3 py-3 text-navy-600 w-8">
                          {canExpand ? (
                            isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                          ) : null}
                        </td>
                        <td className="px-4 py-3 font-medium text-navy-800 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {h.companyName || '—'}
                            {canExpand && !isExpanded && (
                              <span className="text-xs text-navy-700 font-normal">view update</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-navy-700 whitespace-nowrap">
                          {h.lastScored ? formatDate(h.lastScored, 'short') : '—'}
                        </td>
                        <td className="px-4 py-3 text-center"><RatingBadge score={h.customerRevenue} /></td>
                        <td className="px-4 py-3 text-center"><RatingBadge score={h.salesPipeline} /></td>
                        <td className="px-4 py-3 text-center"><RatingBadge score={h.partners} /></td>
                        <td className="px-4 py-3 text-center"><RatingBadge score={h.cashOnHand} /></td>
                        <td className="px-4 py-3 text-center"><RatingBadge score={h.team} /></td>
                        <td className="px-4 py-3 text-center"><RatingBadge score={h.estimatedValue} /></td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${scoreColor(h.overallScore)}`}>
                            {h.overallScore ? `${h.overallScore.toFixed(1)} · ${scoreLabel(h.overallScore)}` : '—'}
                          </span>
                        </td>
                      </tr>

                      {/* Expanded detail row */}
                      {isExpanded && (
                        <tr className="border-b border-navy-100 bg-navy-50/80">
                          <td colSpan={10} className="px-6 py-5">
                            <div className="space-y-4 max-w-4xl">
                              {/* Header */}
                              <div className="flex items-center justify-between">
                                <h4 className="font-semibold text-navy-800">
                                  {h.companyName} — Company Update
                                  {h.reportingPeriod && (
                                    <span className="ml-2 text-xs font-normal text-navy-700 bg-navy-100 px-2 py-0.5 rounded-full">
                                      {h.reportingPeriod}
                                    </span>
                                  )}
                                  {h.lastScored && (
                                    <span className="ml-2 text-xs font-normal text-navy-700">
                                      {formatDate(h.lastScored, 'long')}
                                    </span>
                                  )}
                                </h4>
                                {h.seekingFinancing && (
                                  <span className="flex items-center gap-1 text-xs font-semibold text-gold-700 bg-gold-100 border border-gold-300 px-2 py-1 rounded-full">
                                    <DollarSign className="w-3 h-3" />
                                    Seeking Financing
                                  </span>
                                )}
                              </div>

                              {/* Summary + Next Steps */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {h.summaryOutlook && (
                                  <div>
                                    <p className="text-xs font-semibold text-navy-700 uppercase tracking-wider mb-1">Summary Outlook</p>
                                    <p className="text-sm text-navy-700 leading-relaxed">{h.summaryOutlook}</p>
                                  </div>
                                )}
                                {h.nextSteps && (
                                  <div>
                                    <p className="text-xs font-semibold text-navy-700 uppercase tracking-wider mb-1">Next Steps</p>
                                    <p className="text-sm text-navy-700 leading-relaxed">{h.nextSteps}</p>
                                  </div>
                                )}
                              </div>

                              {/* Financing notes */}
                              {h.financingNotes && (
                                <div>
                                  <p className="text-xs font-semibold text-gold-700 uppercase tracking-wider mb-1">Financing Notes</p>
                                  <p className="text-sm text-navy-700">{h.financingNotes}</p>
                                </div>
                              )}

                              {/* Attachments + Video */}
                              {((h.attachments && h.attachments.length > 0) || h.videoLink) && (
                                <div>
                                  <p className="text-xs font-semibold text-navy-700 uppercase tracking-wider mb-2">Attachments</p>
                                  <div className="flex flex-wrap gap-2">
                                    {h.attachments?.map((att) => (
                                      <a
                                        key={att.id}
                                        href={att.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-3 py-2 bg-white border border-navy-100 rounded-lg text-sm text-navy-700 hover:border-navy-300 hover:bg-navy-50 transition-colors"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <span>{fileIcon(att.filename)}</span>
                                        <span className="font-medium truncate max-w-[180px]">{att.filename}</span>
                                        {att.size && <span className="text-xs text-navy-600">{formatFileSize(att.size)}</span>}
                                      </a>
                                    ))}
                                    {h.videoLink && (
                                      <a
                                        href={h.videoLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-3 py-2 bg-white border border-navy-100 rounded-lg text-sm text-navy-700 hover:border-navy-300 hover:bg-navy-50 transition-colors"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <Video className="w-4 h-4 text-navy-700" />
                                        <span className="font-medium">Attachment</span>
                                      </a>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
