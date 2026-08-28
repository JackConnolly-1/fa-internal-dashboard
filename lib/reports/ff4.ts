// ─────────────────────────────────────────────────────────────────────────────
// FF4 H2 2025 Semi-Annual Report — content seeded from the PDF.
// (Phase 1: hardcoded from the report so the layout matches 1:1. Quantitative
// sections will be wired to Airtable in a later pass.)
// ─────────────────────────────────────────────────────────────────────────────

export type StatusKey =
  | 'Surfing'
  | 'Swimming'
  | 'Floating'
  | 'Sinking'
  | 'Drowned'
  | 'On the Beach'
  | 'Exited'

export interface FundReport {
  fundName: string
  fundShort: string
  period: string
  periodEnding: string
  letterDate: string
  letterBody: string[]
  signature: { name: string; titles: string[] }
  summary: { metric: string; value: string; notes?: string; emphasize?: boolean }[]
  allocation: { label: string; value: number; color: string }[]
  investmentActivity: string[]
  industry: { industry: string; count: number; amount: number; pctFund: string; avg: number }[]
  industryTotal: { count: number; amount: number; avg: number }
  investmentDetail: {
    company: string
    initial?: number
    fastClose?: number
    followOn?: number
    total: number
    pctTotal: string
    pctFund: string
  }[]
  investmentDetailTotal: { initial: number; fastClose: number; followOn: number; total: number }
  categoryDefs: { category: string; definition: string; status: StatusKey }[]
  healthBar: { label: string; amount: string; pct: string; color: string }[]
  healthAssessment: { company: string; status: StatusKey; note?: string }[]
  disclosures: string[]
}

const GREEN = '#4a9c5d'
const YELLOW = '#eab63b'
const GRAY = '#7a8290'
const RED = '#d75c53'

export const ff4Report: FundReport = {
  fundName: 'Frontier Fund 4',
  fundShort: 'FF4',
  period: 'H2 2025',
  periodEnding: 'December 31, 2025',
  letterDate: 'February 28, 2026',
  letterBody: [
    'We are pleased to provide you this latest semi-annual report on the state of Frontier Fund 4 and the latest updates from our portfolio companies. The Fund is comprised of a portfolio of twenty-one companies across twelve industries. In line with our investment thesis, each company was chosen for its unique competitive advantages — leveraged by technology and intellectual property — and for the introspective and self-aware quality of its founders.',
    'The second half of 2025 was characterized by continued market uncertainty, punctuated by policy shifts, tariff concerns, and mixed signals on the direction of interest rates. While public equities rallied into year-end, the IPO and M&A markets for venture-backed companies remained subdued. A few high-profile exits emerged late in the year, but conditions for early-stage companies seeking liquidity continued to be challenging. The backlog of exit-ready companies continues to grow.',
    'At the Angel level, the competitive dynamics highlighted in our H1 report have persisted. Larger venture firms continue to crowd into Pre-Seed and Seed stages, compressing valuations for follow-on rounds and making it harder for angel-backed companies to raise on favorable terms. We continue to be disciplined in our follow-on investment decisions, passing on rounds where terms do not adequately reflect company performance.',
    'On the whole, we remain cautiously optimistic about Fund 4’s performance trajectory, targeting a 20-25% internal rate of return (IRR). We have one completed gain exit (Aperiomics at 2.12x), several strong performers led by BioSqueeze, Bone Health Technologies, and Materna Medical, and a growing number of companies approaching inflection points. With Vega Cloud now officially failed, the Fund has 14 operating portfolio companies, 6 failures, and 1 exit. As in prior reports, we have distilled portfolio company progress updates into a holistic performance index and highlighted the most relevant developments. This report covers Fund 4 activity through December 31, 2025.',
    'With Fund 4 essentially fully invested, our focus remains on supporting our portfolio companies to maximize value and identify exit opportunities. We are encouraged by the commercial traction at Bone Health Technologies (exceeding $2.5M in Osteoboost sales), BioSqueeze’s path to breakeven ($7.5M in 2025 revenue), and Materna Medical’s FDA progress with Ellora. While we do not see any imminent exits, several companies are positioning for liquidity events in the next 12-24 months.',
    'Below you will find more information on the Fund and portfolio companies, which we have assembled with inputs from quarterly status updates, emails, and discussions in which we engaged in frank conversations with our CEOs.',
    'Thank you for your support and your trust. Please do not hesitate to reach out should you have any questions or concerns.',
  ],
  signature: {
    name: 'Pat LaPointe',
    titles: ['Chairman, Frontier Angels', 'General Partner, Frontier Fund 4 LLC'],
  },
  summary: [
    { metric: 'Total Capital Committed', value: '$2,525,000', notes: '44 Limited Partners' },
    { metric: 'Capital Called', value: '$2,525,000', notes: '100% of committed' },
    { metric: 'Total Invested', value: '$2,209,743', notes: '87.5% of committed capital' },
    { metric: 'Fees Paid', value: '$248,183', emphasize: true },
    { metric: 'Reserve for Future Fees', value: '$94,755' },
    { metric: 'Remaining Cash Balance', value: '$67,074' },
    { metric: 'Distributions Paid', value: '$132,906', notes: 'Aperiomics exit (2.12x)' },
    { metric: 'Active Portfolio Companies', value: '14', notes: 'of 21 total' },
  ],
  allocation: [
    { label: 'Total Invested', value: 2209743, color: '#5b93c7' },
    { label: 'Fees Paid', value: 248183, color: '#d98b82' },
    { label: 'Reserve for Future Fees', value: 94755, color: '#8bbf93' },
    { label: 'Remaining Cash Balance', value: 67074, color: '#e6b95c' },
  ],
  investmentActivity: [
    'No new investments or distributions were made during H2 2025. All cash currently in FF4 is invested in low-risk money-market overnight sweep accounts or in MMA accounts or CDs held at Silicon Valley Bank and/or Glacier National Bank. All accounts are below the $250K FDIC insured limits.',
  ],
  industry: [
    { industry: 'Medical Devices', count: 7, amount: 684450, pctFund: '31.0%', avg: 97779 },
    { industry: 'Software & Services', count: 4, amount: 380000, pctFund: '17.2%', avg: 95000 },
    { industry: 'Cleantech', count: 1, amount: 218293, pctFund: '9.9%', avg: 218293 },
    { industry: 'Cybersecurity', count: 1, amount: 170000, pctFund: '7.7%', avg: 170000 },
    { industry: 'Data & Analytics', count: 1, amount: 62500, pctFund: '2.8%', avg: 62500 },
    { industry: 'Digital Health', count: 1, amount: 55000, pctFund: '2.5%', avg: 55000 },
    { industry: 'Materials & Chemicals', count: 1, amount: 137500, pctFund: '6.2%', avg: 137500 },
    { industry: 'E-Commerce', count: 1, amount: 50000, pctFund: '2.3%', avg: 50000 },
    { industry: 'Food', count: 1, amount: 50000, pctFund: '2.3%', avg: 50000 },
    { industry: 'Hardware & Electronic Equip', count: 1, amount: 40000, pctFund: '1.8%', avg: 40000 },
    { industry: 'Energy', count: 1, amount: 29000, pctFund: '1.3%', avg: 29000 },
    { industry: 'Real Estate & Services', count: 1, amount: 75000, pctFund: '3.4%', avg: 75000 },
  ],
  industryTotal: { count: 21, amount: 2209743, avg: 100443 },
  investmentDetail: [
    { company: '2Morrow', initial: 55000, total: 55000, pctTotal: '2.5%', pctFund: '2.2%' },
    { company: 'Amsel Medical', initial: 50000, followOn: 75000, total: 125000, pctTotal: '5.7%', pctFund: '5.0%' },
    { company: 'Aperiomics', fastClose: 37500, followOn: 25000, total: 62500, pctTotal: '2.8%', pctFund: '2.5%' },
    { company: 'Biosqueeze', initial: 115000, followOn: 103293, total: 218293, pctTotal: '9.9%', pctFund: '8.6%' },
    { company: 'Bone Health', initial: 50000, followOn: 147450, total: 197450, pctTotal: '8.9%', pctFund: '7.8%' },
    { company: 'Codelucida', fastClose: 40000, total: 40000, pctTotal: '1.8%', pctFund: '1.6%' },
    { company: 'Groupize', fastClose: 50000, followOn: 150000, total: 200000, pctTotal: '9.1%', pctFund: '7.9%' },
    { company: 'Keys (fka Charmed)', initial: 25000, followOn: 50000, total: 75000, pctTotal: '3.4%', pctFund: '3.0%' },
    { company: 'Life Detection Technologies', initial: 50000, total: 50000, pctTotal: '2.3%', pctFund: '2.0%' },
    { company: 'Makani Science', fastClose: 37500, total: 37500, pctTotal: '1.7%', pctFund: '1.5%' },
    { company: 'Materna Medical', initial: 50000, followOn: 150000, total: 200000, pctTotal: '9.1%', pctFund: '7.9%' },
    { company: 'Meallogix', fastClose: 50000, total: 50000, pctTotal: '2.3%', pctFund: '2.0%' },
    { company: 'Pest Notify', initial: 75000, total: 75000, pctTotal: '3.4%', pctFund: '3.0%' },
    { company: 'PhishCloud (Canauri)', initial: 140000, followOn: 30000, total: 170000, pctTotal: '7.7%', pctFund: '6.7%' },
    { company: 'SeaTrec', initial: 29000, total: 29000, pctTotal: '1.3%', pctFund: '1.1%' },
    { company: 'Smart Human Dynamics', fastClose: 37500, followOn: 37500, total: 75000, pctTotal: '3.4%', pctFund: '3.0%' },
    { company: 'Something Borrowed Blooms', fastClose: 50000, total: 50000, pctTotal: '2.3%', pctFund: '2.0%' },
    { company: 'Sonnest', fastClose: 50000, total: 50000, pctTotal: '2.3%', pctFund: '2.0%' },
    { company: 'Terecircuits', fastClose: 37500, followOn: 100000, total: 137500, pctTotal: '6.2%', pctFund: '5.4%' },
    { company: 'Vega Cloud', fastClose: 37500, followOn: 175000, total: 212500, pctTotal: '9.6%', pctFund: '8.4%' },
    { company: 'Veriskin', initial: 50000, followOn: 50000, total: 100000, pctTotal: '4.5%', pctFund: '4.0%' },
  ],
  investmentDetailTotal: { initial: 689000, fastClose: 427500, followOn: 1093243, total: 2209743 },
  categoryDefs: [
    { category: 'Surfing', status: 'Surfing', definition: 'Performing well — revenue growing, milestones met, team strong, low failure risk.' },
    { category: 'Swimming', status: 'Swimming', definition: 'Progressing but below plan — some challenges remain, moderate failure risk.' },
    { category: 'Floating', status: 'Floating', definition: 'Holding pattern — minimal progress, zombie-like status.' },
    { category: 'Sinking', status: 'Sinking', definition: 'Significant challenges — high failure risk, looking for exit or recovery path.' },
    { category: 'Drowned', status: 'Drowned', definition: 'Company has failed or is non-operational — total or near-total loss expected.' },
    { category: 'On the Beach', status: 'On the Beach', definition: 'Exited — returned capital to the Fund, exit event completed.' },
  ],
  healthBar: [
    { label: 'Surfing', amount: '$816K', pct: '36.9%', color: GREEN },
    { label: 'Swimming', amount: '$484K', pct: '21.9%', color: YELLOW },
    { label: 'Floating', amount: '$310K', pct: '14.0%', color: GRAY },
    { label: 'Drowned', amount: '$530K', pct: '24.3%', color: RED },
  ],
  healthAssessment: [
    { company: '2Morrow', status: 'Swimming', note: 'Some significant customer wins but still fighting to get to cashflow B/E with a small team. Looking to exit in the next 1-2 years.' },
    { company: 'Amsel Medical', status: 'Swimming', note: 'Solid progress with new CEO that can execute. Still looks like more capital and longer path to exit which will likely drive dilution.' },
    { company: 'BioSqueeze', status: 'Surfing', note: 'Signs of a positive inflection point in valuation are mounting. Heading in the right direction across most metrics with strong YoY revenue growth.' },
    { company: 'Bone Health Technologies', status: 'Surfing', note: 'Strong signs of market adoption are evident. Revenue doubled in H2 over H1 2025. Osteoporosis is a large addressable market (~$14B globally) with limited non-pharmaceutical options. Physician onboarding is accelerating and investors seem very supportive. Still early in the commercialization curve.' },
    { company: 'Codelucida', status: 'Floating', note: 'While there are some small positive signs from a development contract with a Tier 1 supplier, the proposed solution needs to be put into production before any real revenue is generated.' },
    { company: 'Groupize', status: 'Surfing', note: 'Signs of a positive inflection point in valuation are mounting. Heading in the right direction across most metrics.' },
    { company: 'Life Detection Technologies', status: 'Floating', note: 'Positive R&D results driving strong specificity and sensitivity benchmarks. Still a long path to commercialization and the prior cram down means we are unlikely to see a meaningful return.' },
    { company: 'Makani Science', status: 'Swimming', note: 'Gearing up for product production and sharpening their go-to-market strategy with a new Head of Product hire.' },
    { company: 'Materna Medical', status: 'Surfing', note: 'Closed $15MM of $20MM Series B. Reduced head count by 50% after achieving key milestones. MILLI revenue growing. Targeting ELLORA product launch in 2027.' },
    { company: 'PhishCloud (Canauri)', status: 'Floating', note: 'On life support but we still see the possibility of a partial capital recovery based the terms of our Note and the value of the IP.' },
    { company: 'Seatrec', status: 'Swimming', note: 'CEO still executing more like a project manager than a company builder. Nevertheless — the company is progressing and evidence of product-market fit are growing with some key licensing and customer wins.' },
    { company: 'Something Borrowed Blooms', status: 'Floating', note: 'Operational improvements continue to drive down costs but top line growth is too anemic to attract a buyer (and a premium). Approaching B/E cashflow.' },
    { company: 'Terecircuits', status: 'Swimming', note: 'The team has shown real grit in figuring out how to find a home for their technology. Recent trends in chip packaging and a spike in compute needs has re-ignited customer interest. LOI from Micron, expected investment from their corporate venture group expected Q2 2026.' },
    { company: 'Veriskin', status: 'Swimming', note: 'Positive developments towards FDA clearance with pivotal trial launched. The exit of a competitor provides some valuation support. Gearing up for a capital raise in 2026.' },
    { company: 'Aperiomics', status: 'Exited', note: 'Exited (2.12x)' },
    { company: 'Keys (fka Charmed)', status: 'Drowned' },
    { company: 'Meallogix', status: 'Drowned' },
    { company: 'Pest Notify', status: 'Drowned' },
    { company: 'Smart Human Dynamics', status: 'Drowned' },
    { company: 'Sonnest', status: 'Drowned' },
    { company: 'Vega Cloud', status: 'Drowned', note: 'A fast and disappointing outcome given the positive developments earlier in the year. Seemingly overnight, a failed sale process exacerbated and accelerated the company’s downfall.' },
  ],
  disclosures: [
    'This report is provided for informational purposes only to the members of Frontier Fund 4 LLC. The information contained herein is confidential and proprietary and is not to be reproduced, distributed, or disclosed to any third parties without the prior written consent of Frontier Angels.',
    'This document contains forward-looking statements that involve risks and uncertainties. Actual results could differ materially from those anticipated in these forward-looking statements. Past performance is not indicative of future results.',
    'The valuations and assessments contained herein are based on management’s best estimates using information available as of December 31, 2025. These estimates are subject to change and may not reflect actual outcomes.',
    'Frontier Angels and its affiliates do not provide tax, legal, or accounting advice. Recipients of this report should consult their own tax, legal, and accounting advisors before engaging in any transaction.',
  ],
}
