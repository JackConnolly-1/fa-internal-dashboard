import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { ReportShell } from '@/components/report/report-shell'
import { ReportPie } from '@/components/report/report-pie'
import { ff4Report as r } from '@/lib/reports/ff4'

export const metadata: Metadata = { title: 'Fund Report | FA Internal' }

const usd = (n?: number) => (n || n === 0 ? '$' + Math.round(n).toLocaleString() : '—')
const stClass = (s: string) => 'st-' + s.replace(/\s+/g, '')

function RunHead() {
  return (
    <div className="r-runhead">
      <span>
        {r.fundName} | {r.period} Semi-Annual Report
      </span>
      <span>Confidential</span>
    </div>
  )
}
function RunFoot({ page }: { page: number }) {
  return (
    <div className="r-runfoot">
      <span>Confidential — For {r.fundName} Members Only</span>
      <span>Page {page}</span>
    </div>
  )
}

export default function FundReportPage({ params }: { params: { fund: string } }) {
  const fund = params.fund.toUpperCase()

  if (fund !== 'FF4') {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center">
        <Link href="/funds" className="inline-flex items-center gap-1.5 text-sm text-navy-600 hover:text-navy-900">
          <ArrowLeft className="w-4 h-4" /> Back to funds
        </Link>
        <p className="mt-8 text-navy-600">
          The <strong>{fund}</strong> report isn&apos;t built yet — FF4 is the first one. Once the FF4
          layout is approved, FF3 and FF5 slot into the same template.
        </p>
      </div>
    )
  }

  const allocTotal = r.allocation.reduce((s, a) => s + a.value, 0)

  return (
    <div>
      <Link
        href="/funds"
        className="r-noprint inline-flex items-center gap-1.5 text-sm text-navy-600 hover:text-navy-900 mb-4"
      >
        <ArrowLeft className="w-4 h-4" /> Back to funds
      </Link>

      <ReportShell>
        {/* ── Cover ─────────────────────────────────────────────── */}
        <section className="r-page r-cover">
          <p className="tag">A Montana Based Investment Network</p>
          <div style={{ margin: '18px 0' }}>
            <div style={{ fontFamily: 'var(--font-display),Georgia,serif', fontWeight: 800, fontSize: 46, letterSpacing: '.06em', color: '#1b1b1b' }}>
              FA
            </div>
            <div style={{ fontFamily: 'var(--font-display),Georgia,serif', fontWeight: 800, fontSize: 20, letterSpacing: '.06em', color: '#1b1b1b' }}>
              FRONTIER ANGELS
            </div>
          </div>
          <p className="tag">A Montana Based Investment Network</p>
          <div className="crule" />
          <div className="ftitle">FRONTIER FUND 4</div>
          <div className="fsub">Semi-Annual Report</div>
          <div className="fperiod">Period Ending {r.periodEnding}</div>
        </section>

        {/* ── Letter to Members ─────────────────────────────────── */}
        <section className="r-page">
          <RunHead />
          <h1 className="r-h1">Letter to Members</h1>
          <hr className="r-rule" />
          <p>
            <strong>To:</strong> Members of {r.fundName} LLC
          </p>
          <p>
            <strong>Date:</strong> {r.letterDate}
          </p>
          {r.letterBody.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
          <p style={{ marginTop: 18 }}>Sincerely,</p>
          <p className="r-sig" style={{ marginTop: 26, marginBottom: 0 }}>
            {r.signature.name}
          </p>
          {r.signature.titles.map((t) => (
            <p key={t} style={{ margin: 0 }}>
              {t}
            </p>
          ))}
          <RunFoot page={3} />
        </section>

        {/* ── Investments & Distributions ───────────────────────── */}
        <section className="r-page">
          <RunHead />
          <h1 className="r-h1">{r.fundShort} Investments &amp; Distributions</h1>
          <hr className="r-rule" />
          <p className="r-caption">Table 1: Fund Summary</p>
          <table className="r-table">
            <thead>
              <tr>
                <th>Metric</th>
                <th>Value</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {r.summary.map((row) => (
                <tr key={row.metric}>
                  <td style={row.emphasize ? { fontWeight: 700 } : undefined}>{row.metric}</td>
                  <td style={row.emphasize ? { fontWeight: 700 } : undefined}>{row.value}</td>
                  <td>{row.notes || ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="r-note">
            FF4 is a $2,525,000 fund with 44 limited partners and 21 portfolio companies. The Fund opened
            in October 2019 with first investments in March 2020. All committed capital has been called and
            received. No capital was deployed in H2 2025.
          </p>

          <p className="r-caption" style={{ textAlign: 'center' }}>
            Capital Allocation Breakdown
          </p>
          <div className="r-pie-wrap">
            <ReportPie data={r.allocation} size={300} />
            <ul className="r-legend">
              {r.allocation.map((a) => (
                <li key={a.label}>
                  <span className="sw" style={{ background: a.color }} />
                  <span>
                    {a.label} — {usd(a.value)} ({Math.round((a.value / allocTotal) * 100)}%)
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <RunFoot page={4} />
        </section>

        {/* ── Investment Activity ───────────────────────────────── */}
        <section className="r-page">
          <RunHead />
          <h1 className="r-h1">Investment Activity in {r.period}</h1>
          <hr className="r-rule" />
          {r.investmentActivity.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          <RunFoot page={5} />
        </section>

        {/* ── Industry Allocation ───────────────────────────────── */}
        <section className="r-page">
          <RunHead />
          <h1 className="r-h1">Industry Allocation</h1>
          <hr className="r-rule" />
          <p className="r-caption">Table 2: Industry Allocation</p>
          <table className="r-table">
            <thead>
              <tr>
                <th>Industry</th>
                <th className="num"># Companies</th>
                <th className="num">Amount Invested</th>
                <th className="num">% of Fund</th>
                <th className="num">Avg Investment</th>
              </tr>
            </thead>
            <tbody>
              {r.industry.map((row) => (
                <tr key={row.industry}>
                  <td>{row.industry}</td>
                  <td className="num">{row.count}</td>
                  <td className="num">{usd(row.amount)}</td>
                  <td className="num">{row.pctFund}</td>
                  <td className="num">{usd(row.avg)}</td>
                </tr>
              ))}
              <tr className="total">
                <td>TOTAL</td>
                <td className="num">{r.industryTotal.count}</td>
                <td className="num">{usd(r.industryTotal.amount)}</td>
                <td className="num">100%</td>
                <td className="num">{usd(r.industryTotal.avg)}</td>
              </tr>
            </tbody>
          </table>
          <RunFoot page={6} />
        </section>

        {/* ── Portfolio Investment Detail ───────────────────────── */}
        <section className="r-page">
          <RunHead />
          <h1 className="r-h1">Portfolio Investment Detail</h1>
          <hr className="r-rule" />
          <p className="r-caption">Table 3: Record of Investments</p>
          <table className="r-table">
            <thead>
              <tr>
                <th>Company</th>
                <th className="num">Initial Match</th>
                <th className="num">Fast Close</th>
                <th className="num">Total Follow-On</th>
                <th className="num">Total Invested</th>
                <th className="num">% of Total</th>
                <th className="num">% of Fund</th>
              </tr>
            </thead>
            <tbody>
              {r.investmentDetail.map((row) => (
                <tr key={row.company}>
                  <td>{row.company}</td>
                  <td className="num">{usd(row.initial)}</td>
                  <td className="num">{usd(row.fastClose)}</td>
                  <td className="num">{usd(row.followOn)}</td>
                  <td className="num">{usd(row.total)}</td>
                  <td className="num">{row.pctTotal}</td>
                  <td className="num">{row.pctFund}</td>
                </tr>
              ))}
              <tr className="total">
                <td>Total</td>
                <td className="num">{usd(r.investmentDetailTotal.initial)}</td>
                <td className="num">{usd(r.investmentDetailTotal.fastClose)}</td>
                <td className="num">{usd(r.investmentDetailTotal.followOn)}</td>
                <td className="num">{usd(r.investmentDetailTotal.total)}</td>
                <td className="num">100.0%</td>
                <td className="num">87.5%</td>
              </tr>
            </tbody>
          </table>
          <RunFoot page={7} />
        </section>

        {/* ── Portfolio Status Scorecard ────────────────────────── */}
        <section className="r-page">
          <RunHead />
          <h1 className="r-h1">Portfolio Status Scorecard</h1>
          <hr className="r-rule" />
          <p>
            Of FF4&apos;s 14 operating portfolio companies, 4 are currently classified as low-failure-risk
            (coded green), 10 are medium-failure-risk (coded yellow), none are classified as
            high-failure-risk (red), 6 have failed, and one has exited for a 2.12x multiple. The potential
            stars in the Fund are continuing their positive trajectory, including BioSqueeze, Bone Health, and
            Materna Medical.
          </p>

          <p className="r-caption">Table 4: Performance Category Definitions</p>
          <table className="r-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Definition</th>
              </tr>
            </thead>
            <tbody>
              {r.categoryDefs.map((c) => (
                <tr key={c.category}>
                  <td className={stClass(c.status)}>{c.category}</td>
                  <td>{c.definition}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className="r-caption" style={{ textAlign: 'center' }}>
            Portfolio Health by Invested Capital
          </p>
          <div className="r-healthbar">
            {r.healthBar.map((h) => (
              <div key={h.label} style={{ flex: parseFloat(h.pct), background: h.color }}>
                <span className="hb-l">{h.label}</span>
                <span className="hb-v">
                  {h.amount} ({h.pct})
                </span>
              </div>
            ))}
          </div>

          <p className="r-caption">Table 5: Portfolio Health Assessment</p>
          <table className="r-table">
            <thead>
              <tr>
                <th style={{ width: '26%' }}>Company</th>
                <th style={{ width: '16%' }}>Current Status</th>
                <th>Change from Prior Period</th>
              </tr>
            </thead>
            <tbody>
              {r.healthAssessment.map((h) => (
                <tr key={h.company}>
                  <td style={{ fontWeight: 700 }}>{h.company}</td>
                  <td className={stClass(h.status)}>{h.status === 'Exited' ? h.note : h.status}</td>
                  <td>{h.status === 'Exited' ? '' : h.note || ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <RunFoot page={8} />
        </section>

        {/* ── Placeholder for the remaining sections ────────────── */}
        <section className="r-page">
          <RunHead />
          <h1 className="r-h1">Portfolio Company Updates &amp; Matrix</h1>
          <hr className="r-rule" />
          <p style={{ fontStyle: 'italic', color: '#7b8290' }}>
            Next pass: the 21 per-company write-ups, the 7-dimension Status Matrix (driven live from the
            Airtable Portfolio Tracker scores), and the Portfolio Companies logo gallery — all in this same
            template.
          </p>
          <RunFoot page={8} />
        </section>

        {/* ── Important Disclosures ─────────────────────────────── */}
        <section className="r-page">
          <RunHead />
          <h1 className="r-h1">Important Disclosures</h1>
          <hr className="r-rule" />
          {r.disclosures.map((d, i) => (
            <p key={i}>{d}</p>
          ))}
          <RunFoot page={10} />
        </section>

        {/* ── Back cover ────────────────────────────────────────── */}
        <section className="r-cover" style={{ minHeight: '5in' }}>
          <div className="ftitle" style={{ fontSize: 30 }}>
            FRONTIER ANGELS
          </div>
          <p style={{ marginTop: 8 }}>Bozeman, Montana</p>
          <p className="tag">A Montana Based Investment Network</p>
          <p style={{ marginTop: 6 }}>www.frontierangels.com</p>
        </section>
      </ReportShell>
    </div>
  )
}
