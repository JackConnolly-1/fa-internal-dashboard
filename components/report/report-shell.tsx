import { PrintButton } from './print-button'

const CSS = `
.fa-report{
  --r-navy:#132b50; --r-gold:#c7a548; --r-ink:#20272f; --r-muted:#7b8290;
  --r-cream:#fdf8ea; --r-border:#e4dfce;
  font-family:Georgia,'Times New Roman',serif; color:var(--r-ink); background:#fff;
  max-width:8.5in; margin:0 auto; padding:0.55in 0.8in; font-size:12px; line-height:1.55;
}
.fa-report *{box-sizing:border-box}
.fa-report h1,.fa-report h2,.fa-report h3{font-family:var(--font-display),Georgia,serif;margin:0}
.fa-report p{margin:0 0 11px}

.r-runhead{display:flex;justify-content:space-between;align-items:flex-end;font-size:8.5px;letter-spacing:.09em;text-transform:uppercase;color:#9aa0a6;border-bottom:1.5px solid var(--r-gold);padding-bottom:6px;margin-bottom:20px}
.r-runfoot{display:flex;justify-content:space-between;font-size:8.5px;color:#9aa0a6;border-top:1px solid #ededed;padding-top:6px;margin-top:26px}

.r-h1{font-size:16px;font-weight:700;letter-spacing:.24em;text-transform:uppercase;color:var(--r-navy);margin-bottom:5px}
.r-rule{height:2px;background:var(--r-gold);border:0;margin:0 0 16px}
.r-caption{font-style:italic;font-weight:700;color:var(--r-navy);margin:20px 0 8px;font-size:12.5px}
.r-note{font-size:11px;color:#54606f;margin-top:10px}

.r-table{width:100%;border-collapse:collapse;font-size:10.5px}
.r-table thead th{background:var(--r-navy);color:#fff;text-align:left;padding:7px 10px;font-family:var(--font-display),Georgia,serif;font-weight:600;font-size:10.5px}
.r-table thead th.num{text-align:right}
.r-table td{padding:6px 10px;border-bottom:1px solid #ece8db}
.r-table tbody tr:nth-child(even) td{background:var(--r-cream)}
.r-table td.num{text-align:right;font-variant-numeric:tabular-nums}
.r-table tr.total td{font-weight:700;background:#f1efe7;border-top:2px solid var(--r-navy);border-bottom:none}

.st-Surfing{color:#2f8a46;font-weight:700}
.st-Swimming{color:#c1901f;font-weight:700}
.st-Floating{color:#6b7280;font-weight:700}
.st-Sinking{color:#c0392b;font-weight:700}
.st-Drowned{color:#c0392b;font-weight:700}
.st-Exited{color:#1f7a4d;font-weight:700}
.st-OntheBeach{color:#1f7a4d;font-weight:700}

.r-healthbar{display:flex;width:100%;height:82px;overflow:hidden;margin:18px 0 4px}
.r-healthbar>div{display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;text-align:center;padding:4px}
.r-healthbar .hb-l{font-weight:700;font-size:11px}
.r-healthbar .hb-v{font-size:10px;opacity:.95}

.r-pie-wrap{display:flex;align-items:center;justify-content:center;gap:34px;margin-top:14px;flex-wrap:wrap}
.r-legend{list-style:none;padding:0;margin:0;font-size:11px}
.r-legend li{display:flex;align-items:center;gap:8px;margin:5px 0}
.r-legend .sw{width:11px;height:11px;border-radius:2px;flex:none}

/* cover */
.r-cover{min-height:9.2in;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}
.r-cover .tag{font-style:italic;color:#8a8f98;font-size:12px}
.r-cover img{height:120px;width:auto;margin:6px 0 8px}
.r-cover .crule{width:62%;height:2px;background:var(--r-gold);margin:16px 0 26px}
.r-cover .ftitle{font-size:40px;font-weight:800;letter-spacing:.22em;color:var(--r-navy);font-family:var(--font-display),Georgia,serif}
.r-cover .fsub{font-size:22px;color:var(--r-ink);margin-top:4px}
.r-cover .fperiod{color:#8a8f98;margin-top:8px}

.r-sig{font-weight:700;margin-top:34px}
.r-toc{list-style:none;padding:0;margin:12px 0}
.r-toc li{display:flex;justify-content:space-between;border-bottom:1px dotted #cfcabb;padding:6px 0;font-size:12.5px}

@media print{
  .fa-report{max-width:none;margin:0;padding:0;font-size:11px}
  .r-noprint{display:none!important}
  .r-page{page-break-after:always}
  .r-page:last-child{page-break-after:auto}
  thead{display:table-header-group}
  tr{page-break-inside:avoid}
  @page{size:letter;margin:0.55in 0.7in}
}
`

export function ReportShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* eslint-disable-next-line react/no-danger */}
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <PrintButton />
      <div className="fa-report">{children}</div>
    </>
  )
}

/** Running page header + footer (repeats visually per section on screen). */
export function ReportRun({
  fund,
  period,
  page,
}: {
  fund: string
  period: string
  page: number
}) {
  return {
    head: (
      <div className="r-runhead">
        <span>
          {fund} | {period} Semi-Annual Report
        </span>
        <span>Confidential</span>
      </div>
    ),
    foot: (
      <div className="r-runfoot">
        <span>Confidential — For {fund} Members Only</span>
        <span>Page {page}</span>
      </div>
    ),
  }
}
