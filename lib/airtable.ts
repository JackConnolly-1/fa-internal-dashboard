/**
 * Airtable client for FrontierAngels — FA Core Database
 *
 * Uses direct Airtable REST API with Bearer token auth.
 * Server-only — never import in client components.
 *
 * Base ID: appbBEPdZ1KiFtRL2
 * Table IDs match FA Core Database exactly.
 */

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export interface Investor {
  id: string
  name: string
  email: string
  city?: string
  dateJoined?: string
  // linked record IDs
  accountIds: string[]
}

export interface InvestorAccount {
  id: string
  name?: string
  investorIds: string[]
  // linked to FA LLCs
  fundIds: string[]
  // linked transactions
  transactionIds: string[]
  commitment?: number
  totalInvested?: number
}

export interface Transaction {
  id: string
  // Airtable linked record IDs
  portfolioCompanyIds: string[]
  portfolioCompanyName?: string
  investorAccountIds: string[]
  amount: number
  date?: string
  type?: string
  detailedType?: string
  // fund-related
  fundIds?: string[]
  fundName?: string
}

export interface PortfolioCompany {
  id: string
  name: string
  description?: string
  industry?: string
  sector?: string
  stage?: string
  status?: string
  moic?: number
  performanceScore?: number
  performanceReportUrl?: string
  lastUpdate?: string
  website?: string
  logoUrl?: string
  // Internal-dashboard aggregates (Section A)
  totalInvested?: number
  distributions?: number
  uniqueInvestors?: number
  scoreCategory?: string
  roundCount?: number
  // Legacy fields for public portfolio page
  faInvestment?: number
  investmentDate?: string
  location?: string
}

/** A single transaction against a portfolio company (for the drill-down). */
export interface CompanyTransaction {
  id: string
  date?: string
  umbrellaType?: string
  detailedType?: string
  amount: number
  shares?: number
  sharePrice?: number
  round?: string
  roundType?: string
  security?: string
  investorOrFund?: string
  returnMultiple?: number
}

export interface PortfolioHealthAttachment {
  id: string
  url: string
  filename: string
  size?: number
  type?: string
  thumbnails?: { small?: { url: string }; large?: { url: string } }
}

interface AirtableAttachment {
  id: string
  url: string
  filename: string
  size?: number
  type?: string
  thumbnails?: { small?: { url: string }; large?: { url: string } }
}

export interface PortfolioHealthRecord {
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
  // Update detail fields
  summaryOutlook?: string
  nextSteps?: string
  attachments?: PortfolioHealthAttachment[]
  videoLink?: string
  reportingPeriod?: string
  seekingFinancing?: boolean
  financingNotes?: string
}

export interface FundRecord {
  id: string
  name: string
  status?: string
  targetSize?: number
  totalCommitments?: number
  totalDistributions?: number
  description?: string
  vintage?: number
  investmentCount?: number
}

export interface Deal {
  id: string
  name?: string
  companyName?: string
  companyIds: string[]
  roundType?: string
  preMoneyValuation?: number
  dealWindow?: string
  lastDateToInvest?: string
  amountRaised?: number
  description?: string
  memo?: string
  status?: string
  dropboxUrl?: string
  pitchDeckUrl?: string
  operatingStatus?: string
  internalRating?: number
}

export interface FAEvent {
  id: string
  name: string
  date?: string
  description?: string
  coverImageUrl?: string
  location?: string
  rsvpUrl?: string
}

export interface MemberDirectoryEntry {
  id: string
  name: string
  city?: string
  dateJoined?: string
  imageUrl?: string
}

// Legacy types (kept for existing pages)
export interface AirtableMember {
  id: string
  email: string
  name: string
  phone?: string
  status: 'Active' | 'Inactive' | 'Pending'
  memberSince?: string
  investmentCount?: number
  totalInvested?: number
  clerkUserId?: string
}

export interface Fund {
  id: string
  name: string
  vintage: number
  targetSize: number
  closedSize?: number
  status: 'Open' | 'Closed' | 'Investing' | 'Harvesting'
  investmentCount?: number
  irr?: number
  multiple?: number
  description?: string
}

export interface MemberInvestment {
  id: string
  memberId: string
  companyId: string
  companyName: string
  fundId?: string
  fundName?: string
  amount: number
  investmentDate: string
  currentValue?: number
  status: 'Active' | 'Exited' | 'Written Off'
  exitMultiple?: number
}

export interface Document {
  id: string
  memberId: string
  name: string
  type: 'K-1' | 'Annual Report' | 'Investment Summary' | 'Legal' | 'Other'
  year?: number
  fundName?: string
  url?: string
  uploadedAt: string
}

// ─────────────────────────────────────────────
// Table IDs (FA Core Database)
// ─────────────────────────────────────────────

const TABLES = {
  Investors: 'tblBqhe9eh47x6hy5',
  InvestorAccounts: 'tblMYseiJLRtuAAEA',
  Transactions: 'tbltEZDR8n8CfRDbj',
  PortfolioCompanies: 'tblkA2GsKYHEQvKsL',
  PortfolioTracker: 'tblivmsM92mNhuOXk',
  FALLCs: 'tbljk6Geo0eiASbyp',
  Deals: 'tbltehwdfChmcZgEN',
  FAEvents: 'tblqq8wJxvkCoY3YF',
  InvestorEntities: 'tblX7xbXSR7l7kO0t',
  InitialInvestmentInterest: 'tblQdjM52UTuzG3T1',
} as const

// ─────────────────────────────────────────────
// Core fetch helper
// ─────────────────────────────────────────────

interface AirtableRecord<T = Record<string, unknown>> {
  id: string
  fields: T
  createdTime: string
}

interface AirtableListResponse<T = Record<string, unknown>> {
  records: AirtableRecord<T>[]
  offset?: string
}

function getBase(): string {
  if (!process.env.AIRTABLE_BASE_ID) throw new Error('AIRTABLE_BASE_ID not set'); return process.env.AIRTABLE_BASE_ID
}

function getKey(): string {
  const key = process.env.AIRTABLE_API_KEY
  if (!key) throw new Error('AIRTABLE_API_KEY not set')
  return key
}

/**
 * Safely append Airtable params to a URL.
 * Handles `sort` and `fields` as JSON strings by converting them to
 * Airtable's bracket-notation format: sort[0][field]=X&sort[0][direction]=asc
 */
function appendAirtableParams(url: URL, params: Record<string, string>) {
  for (const [key, value] of Object.entries(params)) {
    if ((key === 'sort' || key === 'fields') && value.startsWith('[')) {
      try {
        const parsed = JSON.parse(value)
        if (Array.isArray(parsed)) {
          parsed.forEach((item, i) => {
            if (key === 'sort' && typeof item === 'object') {
              if (item.field) url.searchParams.append(`sort[${i}][field]`, item.field)
              if (item.direction) url.searchParams.append(`sort[${i}][direction]`, item.direction)
            } else if (key === 'fields' && typeof item === 'string') {
              url.searchParams.append(`fields[]`, item)
            }
          })
          continue
        }
      } catch {
        // fall through to plain set
      }
    }
    url.searchParams.set(key, value)
  }
}

async function fetchAirtable<T = Record<string, unknown>>(
  tableId: string,
  params?: Record<string, string>
): Promise<AirtableRecord<T>[]> {
  const base = getBase()
  const key = getKey()

  let allRecords: AirtableRecord<T>[] = []
  let offset: string | undefined

  do {
    const url = new URL(`https://api.airtable.com/v0/${base}/${tableId}`)
    if (params) appendAirtableParams(url, params)
    if (offset) url.searchParams.set('offset', offset)

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${key}` },
      next: { revalidate: 300 },
    })

    if (!res.ok) {
      const text = await res.text()
      console.error(`[airtable] ${res.status} on ${tableId}: ${text}`)
      break
    }

    const data: AirtableListResponse<T> = await res.json()
    allRecords = allRecords.concat(data.records)
    offset = data.offset
  } while (offset)

  return allRecords
}

async function fetchOneAirtable<T = Record<string, unknown>>(
  tableId: string,
  recordId: string
): Promise<AirtableRecord<T> | null> {
  const base = getBase()
  const key = getKey()
  const res = await fetch(`https://api.airtable.com/v0/${base}/${tableId}/${recordId}`, {
    headers: { Authorization: `Bearer ${key}` },
    next: { revalidate: 300 },
  })
  if (!res.ok) return null
  return res.json()
}

function str(v: unknown): string {
  if (typeof v === 'string') return v
  if (Array.isArray(v)) return v[0] ?? ''
  return String(v ?? '')
}

function num(v: unknown): number {
  if (typeof v === 'number') return v
  const n = parseFloat(String(v ?? ''))
  return isNaN(n) ? 0 : n
}

function ids(v: unknown): string[] {
  if (!v) return []
  if (Array.isArray(v)) return v.filter((x) => typeof x === 'string')
  return []
}

function attachmentUrl(v: unknown): string | undefined {
  if (Array.isArray(v) && v.length > 0) {
    const att = v[0] as Record<string, unknown>
    return (att.url as string) || undefined
  }
  return undefined
}

// Number that may arrive as a single-element array (Airtable lookup/rollup fields)
function firstNum(v: unknown): number {
  if (Array.isArray(v)) return num(v[0])
  return num(v)
}

// URL from an Airtable "button"/URL field shaped like { label, url }
function urlField(v: unknown): string | undefined {
  if (v && typeof v === 'object' && !Array.isArray(v) && 'url' in v) {
    return ((v as { url?: string }).url) || undefined
  }
  return undefined
}

// ─────────────────────────────────────────────
// Investor lookup
// ─────────────────────────────────────────────

export async function getInvestorByEmail(email: string): Promise<Investor | null> {
  try {
    const records = await fetchAirtable(TABLES.Investors, {
      filterByFormula: `LOWER({Email}) = "${email.toLowerCase()}"`,
      maxRecords: '1',
    })
    if (!records.length) return null
    const r = records[0]
    const f = r.fields as Record<string, unknown>
    return {
      id: r.id,
      name:
        (str(f['Official First'] || f['First'] || f['First Name'] || '').trim() +
        ' ' + str(f['Official Last'] || f['Last'] || f['Last Name'] || '').trim()).trim() ||
        str(f['Name'] || ''),
      email: str(f['Email'] || email),
      city: str(f['Base MT City'] || f['Member - City'] || f['City'] || f['Location'] || '') || undefined,
      dateJoined: str(f['Date Joined'] || f['Created'] || '') || undefined,
      accountIds: ids(f['Investor Accounts'] || f['Accounts']),
    }
  } catch (err) {
    console.error('[airtable] getInvestorByEmail:', err)
    return null
  }
}

// ─────────────────────────────────────────────
// Investor Accounts
// ─────────────────────────────────────────────

/**
 * Get investor accounts by investor record ID.
 * Uses the Investor's linked Investor Accounts IDs if provided via accountIds,
 * or falls back to fetching the investor record to get account IDs.
 * Note: FIND(recordId, ARRAYJOIN({LinkedField})) doesn't work in Airtable
 * because linked fields output display names, not record IDs.
 */
export async function getInvestorAccounts(investorId: string): Promise<InvestorAccount[]> {
  try {
    // First, get the investor's account IDs from the Investor record
    const investorRecord = await fetchOneAirtable(TABLES.Investors, investorId)
    if (!investorRecord) return []
    const investorFields = investorRecord.fields as Record<string, unknown>
    const accountIds = ids(investorFields['Investor Accounts'] || investorFields['Accounts'])
    if (!accountIds.length) return []

    // Fetch each account record by ID
    const accountRecords = await Promise.all(
      accountIds.map((id) => fetchOneAirtable(TABLES.InvestorAccounts, id))
    )

    return accountRecords
      .filter(Boolean)
      .map((r) => {
        const record = r!
        const f = record.fields as Record<string, unknown>
        return {
          id: record.id,
          name: str(f['Name'] || f['Account Name'] || ''),
          investorIds: ids(f['Investor'] || f['Investors']),
          // "Fund Link" is the direct link to the FA LLC record (FF3/FF4/FF5)
          fundIds: ids(f['Fund Link'] || f['Funds Invested In'] || f['FA LLCs'] || f['Funds'] || f['Fund']),
          transactionIds: ids(f['Transactions']),
          commitment: num(f['Fund Commitment'] || f['FF3 Commitment'] || f['FF4 Commitment'] || f['FF5 Commitment'] || f['Commitment'] || f['Total Commitment'] || 0) || undefined,
          totalInvested: num(f['Amount Invested Solo (Rollup from Transactions)'] || f['Total Invested'] || 0) || undefined,
        }
      })
  } catch (err) {
    console.error('[airtable] getInvestorAccounts:', err)
    return []
  }
}

// ─────────────────────────────────────────────
// Transactions
// ─────────────────────────────────────────────

export async function getInvestorTransactions(accountIds: string[]): Promise<Transaction[]> {
  if (!accountIds.length) return []
  try {
    // Fetch all account records to get their linked transaction IDs
    const accountRecords = await Promise.all(
      accountIds.map((id) => fetchOneAirtable(TABLES.InvestorAccounts, id))
    )
    const validAccounts = accountRecords.filter((r): r is NonNullable<typeof r> => r !== null)
    if (!validAccounts.length) return []

    // Collect all transaction IDs from accounts
    const transactionIdSet = new Set<string>()
    for (const record of validAccounts) {
      if (!record) continue
      const f = record.fields as Record<string, unknown>
      ids(f['Transactions']).forEach((id) => transactionIdSet.add(id))
    }
    const transactionIds = Array.from(transactionIdSet)
    if (!transactionIds.length) return []

    // Fetch in batches of 30 to avoid Airtable URL length limits
    // (large OR formulas get silently truncated, causing missing transactions)
    const BATCH_SIZE = 30
    const allRecords: AirtableRecord[] = []
    for (let i = 0; i < transactionIds.length; i += BATCH_SIZE) {
      const batch = transactionIds.slice(i, i + BATCH_SIZE)
      const orClauses = batch.map((id) => `RECORD_ID() = "${id}"`).join(', ')
      const formula = batch.length === 1 ? orClauses : `OR(${orClauses})`
      const batchRecords = await fetchAirtable(TABLES.Transactions, {
        filterByFormula: formula,
        sort: JSON.stringify([{ field: 'Date', direction: 'desc' }]),
      })
      allRecords.push(...batchRecords)
    }
    // Sort combined results by date desc
    allRecords.sort((a, b) => {
      const dateA = str((a.fields as Record<string, unknown>)['Date'] || '') 
      const dateB = str((b.fields as Record<string, unknown>)['Date'] || '')
      return dateB.localeCompare(dateA)
    })

    return allRecords.map((r) => {
      const f = r.fields as Record<string, unknown>
      // Portfolio company name might be a linked name or direct text
      const companyLinked = ids(f['Portfolio Companies (from Deals)'] || f['Portfolio Company'] || f['Company'])
      const companyNameField =
        str(f['Portfolio Company Name'] || f['Company Name'] || '') || undefined
      return {
        id: r.id,
        portfolioCompanyIds: companyLinked,
        portfolioCompanyName: companyNameField,
        investorAccountIds: ids(f['Investor Account'] || f['Investor Accounts']),
        amount: num(f['Dollar Amount'] || f['Amount'] || f['Investment Amount'] || 0),
        date: str(f['Date'] || f['Investment Date'] || '') || undefined,
        type: str(f['Umbrella Transaction Type'] || f['Type'] || f['Transaction Type'] || '') || undefined,
        detailedType:
          str(f['Detailed Transaction Type'] || f['Detailed Type'] || '') || undefined,
        // Only FF3/FF4/FF5 are actual fund investments — FAI Series SPVs are solo investments
        // The fund link field in Airtable Transactions is "FF" (not "FA LLCs" or "FAI Series LLC")
        fundIds: ids(f['FF'] || f['FAI Series LLC'] || f['FA LLCs'] || f['Fund'] || f['Frontier Fund'])
          .filter(id => ['reccejD3T6N47JIjN','recjz4UaHk7i5EcIz','recz60FDQTahsb4lF'].includes(id)),
        // Fund name: parse from "Transaction Name" field (e.g. "FF3 | Steve Kirby" → "FF3")
        // or fall back to other name fields
        fundName: (() => {
          const txName = str(f['Transaction Name'] || '')
          if (txName && txName.includes(' | ')) {
            const ffPart = txName.split(' | ')[0].trim()
            if (ffPart.startsWith('FF')) return ffPart
          }
          // Try "Investor or FF Name" (e.g. "FF3Steve Kirby" → "FF3")
          const investorOrFF = str(f['Investor or FF Name'] || '')
          const ffMatch = investorOrFF.match(/^(FF\d+)/)
          if (ffMatch) return ffMatch[1]
          return str(f['SPV Official Name'] || f['Fund Name'] || f['Frontier Fund Name'] || '') || undefined
        })(),
      }
    })
  } catch (err) {
    console.error('[airtable] getInvestorTransactions:', err)
    return []
  }
}

// ─────────────────────────────────────────────
// Portfolio Health
// ─────────────────────────────────────────────

export async function getPortfolioHealth(companyIds: string[]): Promise<PortfolioHealthRecord[]> {
  if (!companyIds.length) return []
  try {
    const records = await fetchAirtable(TABLES.PortfolioTracker, {})
    return records
      .filter((r) => {
        const f = r.fields as Record<string, unknown>
        const linked = ids(f['Portfolio Company'] || f['Company'])
        return linked.some((id) => companyIds.includes(id))
      })
      .map((r) => {
        const f = r.fields as Record<string, unknown>
        return {
          id: r.id,
          companyIds: ids(f['Portfolio Company'] || f['Company']),
          companyName:
            str(f['Portfolio Company Name'] || f['Company Name'] || '') || undefined,
          lastScored: str(f['Date of Last Scoring'] || f['Last Scored'] || f['Date Updated'] || '') || undefined,
          customerRevenue: num(f['1. Current Customers/Revenue'] || f['Customer/Revenue'] || f['Customer Revenue'] || 0) || undefined,
          salesPipeline: num(f['2. Sales Pipeline'] || f['Sales Pipeline'] || 0) || undefined,
          partners: num(f['3. Partners'] || f['Partners'] || 0) || undefined,
          cashOnHand: num(f['4. Cash on Hand'] || f['Cash on Hand'] || f['Cash'] || 0) || undefined,
          team: num(f['5. Team'] || f['Team'] || 0) || undefined,
          estimatedValue: num(f['6. Estimated Value'] || f['Estimated Value'] || f['Est. Value'] || 0) || undefined,
          overallScore: num(f['Overall Score'] || f['Score'] || 0) || undefined,
          // Update detail fields
          summaryOutlook: str(f['Summary Outlook'] || '') || undefined,
          nextSteps: str(f['Next Steps'] || '') || undefined,
          videoLink: str(f['Video Link'] || '') || undefined,
          reportingPeriod: str(f['Reporting Period'] || f['Quarter Updated'] || '') || undefined,
          seekingFinancing: f['Seeking More Financing?'] === true || undefined,
          financingNotes: str(f['Additional Financing Notes'] || '') || undefined,
          attachments: Array.isArray(f['Attachement']) ? (f['Attachement'] as AirtableAttachment[]).map((a) => ({
            id: a.id,
            url: a.url,
            filename: a.filename,
            size: a.size,
            type: a.type,
            thumbnails: a.thumbnails,
          })) : [],
        }
      })
  } catch (err) {
    console.error('[airtable] getPortfolioHealth:', err)
    return []
  }
}

// ─────────────────────────────────────────────
// Portfolio Companies
// ─────────────────────────────────────────────

// Fallback descriptions for companies missing them in Airtable
// (Airtable PAT is read-only; update Airtable directly when possible)
const COMPANY_DESCRIPTION_FALLBACKS: Record<string, string> = {
  'Evitado': 'Evitado Technologies develops collision avoidance systems for aviation and defense applications. Their technology protects aircraft during ground operations — towing, pushback, and stationary scenarios — reducing costly accidents and improving operational efficiency at commercial airports and military installations.',
  'VBASE Lubricants': 'VBASE Oil Company produces Secondary Polyol Ester® (SPE) base oils engineered for high-performance, sustainable lubrication. Their biobased, biodegradable, and non-toxic lubricants boost equipment reliability, extend service intervals, and reduce total operating costs — serving industrial, metalworking, and specialty applications.',
  'Transformative Optics': 'Transformative Optics Corporation (TOC) is a Portland-based imaging technology company pioneering advanced vision systems for sports, defense, and immersive technology. Their modular imaging solutions address high-performance optics manufacturing challenges, making cutting-edge technology widely accessible across industries.',
}

export async function getAllPortfolioCompanies(): Promise<PortfolioCompany[]> {
  try {
    const records = await fetchAirtable(TABLES.PortfolioCompanies, {
      sort: JSON.stringify([{ field: 'Name', direction: 'asc' }]),
    })
    // Filter out non-company placeholder records
    const EXCLUDED_NAMES = new Set(['FAM'])
    return records
      .filter((r) => {
        const name = str((r.fields as Record<string, unknown>)['Name'] || '')
        return !EXCLUDED_NAMES.has(name)
      })
      .map((r) => {
        const f = r.fields as Record<string, unknown>
        return {
          id: r.id,
          name: str(f['Name'] || f['Company Name'] || ''),
          description: (() => {
            const fromAirtable = str(f['Description'] || f['Summary'] || '')
            if (fromAirtable) return fromAirtable
            const name = str(f['Name'] || f['Company Name'] || '')
            return COMPANY_DESCRIPTION_FALLBACKS[name] || undefined
          })(),
          industry: str(f['Industry Sector'] || f['Industry'] || f['Sector'] || '') || undefined,
          sector: str(f['Industry Sector'] || f['Sector'] || f['Industry'] || '') || undefined,
          stage: str(f['Stage'] || f['Operating Status'] || f['Status'] || '') || undefined,
          status: str(f['Operating Status'] || f['Status'] || f['Stage'] || '') || undefined,
          moic: num(f['MOIC Summary'] || f['MOIC'] || 0) || undefined,
          performanceScore: firstNum(f['Most Recent Score'] || f['Company Performance Score']) || undefined,
          performanceReportUrl: urlField(f['Company Performance Report']),
          lastUpdate: str(f['Last Updated'] || f['Last Udated'] || f['Last Update'] || '') || undefined,
          website: str(f['Website'] || '') || undefined,
          logoUrl: attachmentUrl(f['Logo'] || f['Logo URL']),
          totalInvested: num(f['Investment Amount'] || f['Amount Invested'] || 0) || undefined,
          distributions: num(f['Net Distributions'] || f['Total Payout from TC To-Date'] || 0) || undefined,
          uniqueInvestors: num(f['Unique Investors (not counting FFs)'] || 0) || undefined,
          scoreCategory: str(f['Most Recent Score Category'] || f['Last Rating'] || '') || undefined,
          roundCount: ids(f['Rounds']).length || undefined,
          faInvestment: num(f['Amount Invested'] || f['FA Investment'] || f['Total Investment'] || 0) || undefined,
          investmentDate: str(f['Investment Date'] || f['Date'] || '') || undefined,
          location: str(f['Location'] || f['City'] || f['State'] || '') || undefined,
        }
      })
  } catch (err) {
    console.error('[airtable] getAllPortfolioCompanies:', err)
    return []
  }
}

export async function getPortfolioCompaniesByIds(ids_: string[]): Promise<PortfolioCompany[]> {
  if (!ids_.length) return []
  try {
    const orClauses = ids_.map((id) => `RECORD_ID() = "${id}"`).join(', ')
    const formula = ids_.length === 1 ? orClauses : `OR(${orClauses})`
    const records = await fetchAirtable(TABLES.PortfolioCompanies, {
      filterByFormula: formula,
    })
    return records.map((r) => {
      const f = r.fields as Record<string, unknown>
      return {
        id: r.id,
        name: str(f['Name'] || f['Company Name'] || ''),
        description: str(f['Description'] || f['Summary'] || '') || undefined,
        industry: str(f['Industry Sector'] || f['Industry'] || f['Sector'] || '') || undefined,
        sector: str(f['Industry Sector'] || f['Sector'] || f['Industry'] || '') || undefined,
        stage: str(f['Stage'] || f['Operating Status'] || f['Status'] || '') || undefined,
        status: str(f['Operating Status'] || f['Status'] || f['Stage'] || '') || undefined,
        moic: num(f['MOIC Summary'] || f['MOIC'] || 0) || undefined,
        performanceScore: firstNum(f['Most Recent Score'] || f['Company Performance Score']) || undefined,
        performanceReportUrl: urlField(f['Company Performance Report']),
        lastUpdate: str(f['Last Updated'] || f['Last Udated'] || f['Last Update'] || '') || undefined,
        website: str(f['Website'] || '') || undefined,
        logoUrl: attachmentUrl(f['Logo'] || f['Logo URL']),
      }
    })
  } catch (err) {
    console.error('[airtable] getPortfolioCompaniesByIds:', err)
    return []
  }
}

/** All transactions against one company (by exact company name), newest first. */
export async function getCompanyTransactions(companyName: string): Promise<CompanyTransaction[]> {
  if (!companyName) return []
  try {
    const esc = companyName.replace(/"/g, '\\"')
    const records = await fetchAirtable(TABLES.Transactions, {
      filterByFormula: `{Portfolio Company Name} = "${esc}"`,
      sort: JSON.stringify([{ field: 'Date', direction: 'desc' }]),
    })
    return records.map((r) => {
      const f = r.fields as Record<string, unknown>
      return {
        id: r.id,
        date: str(f['Date'] || '') || undefined,
        umbrellaType: str(f['Umbrella Transaction Type'] || '') || undefined,
        detailedType: str(f['Detailed Transaction Type'] || '') || undefined,
        amount: num(f['Dollar Amount'] || 0),
        shares: num(f['Shares/Units'] || 0) || undefined,
        sharePrice: num(f['Share/Unit Price'] || 0) || undefined,
        round: str(f['Current Round (from Deal)'] || f['Round Type (from Deal)'] || '') || undefined,
        roundType: str(f['Round Type (from Deal)'] || f['Original Round Type (from Deal)'] || '') || undefined,
        security: str(f['Security Used'] || '') || undefined,
        investorOrFund: str(f['Investor or FF Name'] || '') || undefined,
        returnMultiple: num(f['Return Multiple Before Carry To-Date'] || 0) || undefined,
      }
    })
  } catch (err) {
    console.error('[airtable] getCompanyTransactions:', err)
    return []
  }
}

// ─────────────────────────────────────────────
// Section B — Members (internal aggregation)
// ─────────────────────────────────────────────

export interface InvestorSummary {
  id: string
  name: string
  email: string
  status?: string
  accountIds: string[]
}

export async function getAllInvestors(): Promise<InvestorSummary[]> {
  try {
    const records = await fetchAirtable(TABLES.Investors, {})
    return records.map((r) => {
      const f = r.fields as Record<string, unknown>
      const first = str(f['Official First'] || f['First'] || '').trim()
      const last = str(f['Official Last'] || f['Last'] || '').trim()
      return {
        id: r.id,
        name: str(f['Name'] || '') || `${first} ${last}`.trim() || 'Member',
        email: str(f['Email'] || ''),
        status: str(f['Membership Status'] || '') || undefined,
        accountIds: ids(f['Investor Accounts'] || f['Accounts']),
      }
    })
  } catch (err) {
    console.error('[airtable] getAllInvestors:', err)
    return []
  }
}

const FF_TX_IDS = ['reccejD3T6N47JIjN', 'recjz4UaHk7i5EcIz', 'recz60FDQTahsb4lF']

/** Every transaction in the base (paginated). Internal aggregation only. */
export async function getAllTransactions(): Promise<Transaction[]> {
  try {
    const records = await fetchAirtable(TABLES.Transactions, {})
    return records.map((r) => {
      const f = r.fields as Record<string, unknown>
      return {
        id: r.id,
        portfolioCompanyIds: ids(f['Portfolio Companies (from Deals)'] || f['Portfolio Company'] || f['Company']),
        portfolioCompanyName: str(f['Portfolio Company Name'] || '') || undefined,
        investorAccountIds: ids(f['Investor Account'] || f['Investor Accounts']),
        amount: num(f['Dollar Amount'] || f['Amount'] || 0),
        date: str(f['Date'] || '') || undefined,
        type: str(f['Umbrella Transaction Type'] || f['Type'] || '') || undefined,
        detailedType: str(f['Detailed Transaction Type'] || '') || undefined,
        fundIds: ids(f['FF'] || f['FAI Series LLC'] || f['Fund']).filter((id) => FF_TX_IDS.includes(id)),
        fundName: undefined,
      }
    })
  } catch (err) {
    console.error('[airtable] getAllTransactions:', err)
    return []
  }
}

export interface MemberHolding {
  companyId: string
  companyName: string
  logoUrl?: string
  invested: number
  rating?: number
  moic?: number
  indicativeValue?: number
}

export interface MemberPortfolio {
  id: string
  name: string
  email: string
  status?: string
  totalInvested: number
  companyCount: number
  overallRating?: number
  totalMoic?: number
  indicativeValue?: number
  holdings: MemberHolding[]
}

const isInvestType = (t?: string) => {
  const s = (t || '').toLowerCase()
  return s.includes('investment') || s.includes('contribution') || s.includes('conversion')
}

/** Every member's DIRECT (solo) holdings by company, with invested-weighted rating + MOIC. */
export async function getMemberPortfolios(): Promise<MemberPortfolio[]> {
  const [investors, transactions, companies] = await Promise.all([
    getAllInvestors(),
    getAllTransactions(),
    getAllPortfolioCompanies(),
  ])
  const companyById = new Map(companies.map((c) => [c.id, c]))
  const accountToInvestor = new Map<string, string>()
  for (const inv of investors) for (const acc of inv.accountIds) accountToInvestor.set(acc, inv.id)

  // investorId → (companyId → invested $)
  const agg = new Map<string, Map<string, number>>()
  for (const t of transactions) {
    if (t.fundIds && t.fundIds.length) continue // fund transaction — not a direct company holding
    if (!isInvestType(t.type)) continue
    const accId = (t.investorAccountIds || [])[0]
    const compId = (t.portfolioCompanyIds || [])[0]
    if (!accId || !compId) continue
    const invId = accountToInvestor.get(accId)
    if (!invId) continue
    if (!agg.has(invId)) agg.set(invId, new Map())
    const byCo = agg.get(invId)!
    byCo.set(compId, (byCo.get(compId) || 0) + t.amount)
  }

  const investorById = new Map(investors.map((i) => [i.id, i]))
  const result: MemberPortfolio[] = []
  for (const [invId, byCompany] of Array.from(agg.entries())) {
    const inv = investorById.get(invId)
    if (!inv) continue
    const holdings: MemberHolding[] = []
    let totalInvested = 0
    let ratingW = 0, ratingSum = 0
    let moicInv = 0, moicVal = 0
    for (const [compId, invested] of Array.from(byCompany.entries())) {
      if (invested <= 0) continue
      const c = companyById.get(compId)
      const rating = c?.performanceScore
      const moic = c?.moic
      holdings.push({
        companyId: compId,
        companyName: c?.name || 'Unknown Company',
        logoUrl: c?.logoUrl,
        invested,
        rating,
        moic,
        indicativeValue: moic ? invested * moic : undefined,
      })
      totalInvested += invested
      if (rating) { ratingSum += invested * rating; ratingW += invested }
      if (moic) { moicVal += invested * moic; moicInv += invested }
    }
    if (!holdings.length) continue
    holdings.sort((a, b) => b.invested - a.invested)
    result.push({
      id: inv.id,
      name: inv.name,
      email: inv.email,
      status: inv.status,
      totalInvested,
      companyCount: holdings.length,
      overallRating: ratingW ? ratingSum / ratingW : undefined,
      totalMoic: moicInv ? moicVal / moicInv : undefined,
      indicativeValue: moicInv ? moicVal : undefined,
      holdings,
    })
  }
  result.sort((a, b) => b.totalInvested - a.totalInvested)
  return result
}

// ─────────────────────────────────────────────
// Live Deals
// ─────────────────────────────────────────────

function mapDeal(r: AirtableRecord): Deal {
  const f = r.fields as Record<string, unknown>
  return {
    id: r.id,
    name: str(f['Name'] || f['Deal Name'] || '') || undefined,
    companyIds: ids(f['Portfolio Companies'] || f['Portfolio Company'] || f['Company']),
    roundType: str(f['Round Type'] || f['Original Round Type'] || f['Type'] || '') || undefined,
    preMoneyValuation: firstNum(f['Pre-Money Valuation']) || undefined,
    dealWindow: str(f['Deal Window Date'] || '') || undefined,
    lastDateToInvest: str(f['Last Date to Invest (input)'] || f['Last Day to Invest'] || '') || undefined,
    amountRaised:
      num(
        f['Amount Contributed to SPV by Investors+FF'] ||
          f['Total Amount Both SOLO + FF Invested in TC Total (via SPV+FF Direct)'] ||
          0
      ) || undefined,
    description: str(f['Company Description'] || f['Description'] || f['Summary'] || '') || undefined,
    memo: str(f['Memo'] || '') || undefined,
    status: str(f['Deal Status (for members)'] || f['Deal Status'] || f['Status'] || '') || undefined,
    dropboxUrl: str(f['Company Dropbox URL'] || '') || undefined,
    pitchDeckUrl: attachmentUrl(f['One Pager & Pitch Deck']),
    operatingStatus: str(f['Operating Status'] || '') || undefined,
    internalRating: firstNum(f['Target Company - Most Recent Internal Rating']) || undefined,
  }
}

export async function getLiveDeals(): Promise<Deal[]> {
  try {
    const records = await fetchAirtable(TABLES.Deals, {
      filterByFormula: `OR({Deal Status (for members)} = "Open Deals", {Deal Status (for members)} = "Open", {Deal Status (for members)} = "Active", {Deal Status (for members)} = "Live")`,
      sort: JSON.stringify([{ field: 'Name', direction: 'asc' }]),
    })
    return records.map(mapDeal)
  } catch (err) {
    console.error('[airtable] getLiveDeals:', err)
    return []
  }
}

export async function getDealById(id: string): Promise<Deal | null> {
  try {
    const records = await fetchAirtable(TABLES.Deals, {
      filterByFormula: `RECORD_ID() = "${id}"`,
      maxRecords: '1',
    })
    if (!records.length) return null
    return mapDeal(records[0])
  } catch (err) {
    console.error('[airtable] getDealById:', err)
    return null
  }
}

// ─────────────────────────────────────────────
// Funds (FA LLCs)
// ─────────────────────────────────────────────

export async function getFundData(fundId?: string): Promise<FundRecord[]> {
  try {
    const params: Record<string, string> = {}
    if (fundId) params.filterByFormula = `RECORD_ID() = "${fundId}"`
    const records = await fetchAirtable(TABLES.FALLCs, params)
    return records.map((r) => {
      const f = r.fields as Record<string, unknown>
      return {
        id: r.id,
        name: str(f['Name'] || f['Official Name'] || f['Fund Name'] || ''),
        status: str(f['Status'] || '') || undefined,
        targetSize: num(f['Target Size'] || f['Fund Size'] || 0) || undefined,
        totalCommitments:
          num(f['Total Committed'] || f['Total Commitments'] || f['Commitments'] || 0) || undefined,
        totalDistributions:
          num(f['FF Distribution Amount'] || f['Total Distributions'] || f['Distributions'] || 0) || undefined,
        description: str(f['Description'] || '') || undefined,
        vintage: num(f['Vintage'] || f['Year'] || 0) || undefined,
        investmentCount: num(f['Number of Unique Investors in SPV'] || f['Investment Count'] || f['# Investments'] || 0) || undefined,
      }
    })
  } catch (err) {
    console.error('[airtable] getFundData:', err)
    return []
  }
}

// Known FF3/FF4/FF5 record IDs — used for fund lookup
const FRONTIER_FUND_IDS = {
  FF3: 'recz60FDQTahsb4lF',
  FF4: 'reccejD3T6N47JIjN',
  FF5: 'recjz4UaHk7i5EcIz',
}
const FRONTIER_FUND_ID_SET = new Set(Object.values(FRONTIER_FUND_IDS))

export async function getMemberFunds(accountIds: string[]): Promise<FundRecord[]> {
  if (!accountIds.length) return []
  try {
    // Strategy 1: get fund IDs from linked fields on InvestorAccount records
    const fundIdSet = new Set<string>()
    for (const accountId of accountIds) {
      const record = await fetchOneAirtable(TABLES.InvestorAccounts, accountId)
      if (record) {
        const f = record.fields as Record<string, unknown>
        // Check Account Type field — FF3/FF4/FF5 accounts have Account Type = ["FF3"] etc.
        const accountType = str(f['Account Type'] ? (Array.isArray(f['Account Type']) ? f['Account Type'][0] : f['Account Type']) : '')
        if (accountType === 'FF3') fundIdSet.add(FRONTIER_FUND_IDS.FF3)
        if (accountType === 'FF4') fundIdSet.add(FRONTIER_FUND_IDS.FF4)
        if (accountType === 'FF5') fundIdSet.add(FRONTIER_FUND_IDS.FF5)
        // Also try "Fund Link" field and other linked fields
        ids(f['Fund Link'] || f['Funds Invested In'] || f['FA LLCs'] || f['Funds'] || f['Fund'])
          .filter(id => FRONTIER_FUND_ID_SET.has(id))
          .forEach((id) => fundIdSet.add(id))
      }
    }
    if (!fundIdSet.size) return []
    const fundIds: string[] = Array.from(fundIdSet)
    const orClauses = fundIds.map((id) => `RECORD_ID() = "${id}"`).join(', ')
    const formula = fundIds.length === 1 ? orClauses : `OR(${orClauses})`
    const records = await fetchAirtable(TABLES.FALLCs, { filterByFormula: formula })
    return records.map((r) => {
      const f = r.fields as Record<string, unknown>
      return {
        id: r.id,
        name: str(f['Name'] || f['Official Name'] || f['Fund Name'] || ''),
        status: str(f['Status'] || '') || undefined,
        targetSize: num(f['Target Size'] || f['Fund Size'] || 0) || undefined,
        totalCommitments:
          num(f['Total Committed'] || f['Total Commitments'] || f['Commitments'] || 0) || undefined,
        totalDistributions:
          num(f['FF Distribution Amount'] || f['Total Distributions'] || f['Distributions'] || 0) || undefined,
        description: str(f['Description'] || '') || undefined,
        vintage: num(f['Vintage'] || f['Year'] || 0) || undefined,
        investmentCount: num(f['Number of Unique Investors in SPV'] || f['Investment Count'] || 0) || undefined,
      }
    })
  } catch (err) {
    console.error('[airtable] getMemberFunds:', err)
    return []
  }
}

// ─────────────────────────────────────────────
// Fund holdings (companies a Frontier Fund invested in)
// ─────────────────────────────────────────────

export interface FundHolding {
  companyId: string
  companyName: string
  fundInvested: number
}

/**
 * All companies a given Frontier Fund (e.g. "FF3") invested in, with the fund's
 * total invested per company. Aggregated from the fund's transactions.
 */
export async function getFundHoldings(fundName: string): Promise<FundHolding[]> {
  try {
    const records = await fetchAirtable(TABLES.Transactions, {
      filterByFormula: `FIND("${fundName}", ARRAYJOIN({FF})) > 0`,
    })
    const byCompany = new Map<string, FundHolding>()
    for (const r of records) {
      const f = r.fields as Record<string, unknown>
      const companyId = ids(
        f['Portfolio Companies (from Deals)'] || f['Portfolio Company'] || f['Company']
      )[0]
      if (!companyId) continue
      const name = str(f['Portfolio Company Name'] || f['Company Name'] || '')
      const amount = num(f['Dollar Amount'] || f['Amount'] || 0)
      const ffType = str(f['FF Transaction Type'] || '').toLowerCase()
      const umbrella = str(f['Umbrella Transaction Type'] || f['Type'] || '').toLowerCase()

      const entry = byCompany.get(companyId) || { companyId, companyName: name, fundInvested: 0 }
      if (!entry.companyName && name) entry.companyName = name

      const isInvestment =
        ffType.includes('invest') || umbrella.includes('contribution') || umbrella.includes('invest')
      const isNegativeOrDist =
        umbrella.includes('refund') ||
        umbrella.includes('reversal') ||
        umbrella.includes('return') ||
        umbrella.includes('distribut')
      if (isInvestment && !isNegativeOrDist) entry.fundInvested += amount

      byCompany.set(companyId, entry)
    }
    return Array.from(byCompany.values()).sort((a, b) => b.fundInvested - a.fundInvested)
  } catch (err) {
    console.error('[airtable] getFundHoldings:', err)
    return []
  }
}

// ─────────────────────────────────────────────
// Events
// ─────────────────────────────────────────────

export async function getEvents(): Promise<FAEvent[]> {
  try {
    const records = await fetchAirtable(TABLES.FAEvents, {
      sort: JSON.stringify([{ field: 'Start Time', direction: 'asc' }]),
    })
    return records.map((r) => {
      const f = r.fields as Record<string, unknown>
      return {
        id: r.id,
        name: str(f['Event Name'] || f['Name'] || f['Title'] || ''),
        date: str(f['Start Time'] || f['Date'] || f['Event Date'] || '') || undefined,
        description: str(f['Description'] || f['Summary'] || '') || undefined,
        coverImageUrl: attachmentUrl(
          f['Cover Image'] || f['Image'] || f['Photo'] || f['Attachment']
        ),
        location: str(f['Location'] || f['Venue'] || '') || undefined,
        rsvpUrl: str(f['RSVP Link'] || f['RSVP URL'] || f['Link'] || f['URL'] || '') || undefined,
      }
    })
  } catch (err) {
    console.error('[airtable] getEvents:', err)
    return []
  }
}

// ─────────────────────────────────────────────
// Member Directory
// ─────────────────────────────────────────────

export async function getMemberDirectory(): Promise<MemberDirectoryEntry[]> {
  try {
    const records = await fetchAirtable(TABLES.Investors, {
      fields: JSON.stringify([
        'First',
        'Last',
        'Official First',
        'Official Last',
        'Name',
        'Base MT City',
        'Member - City',
        'Date Joined',
      ]),
      sort: JSON.stringify([{ field: 'First', direction: 'asc' }]),
    })
    return records.map((r) => {
      const f = r.fields as Record<string, unknown>
      const firstName = str(f['Official First'] || f['First'] || f['First Name'] || '')
      const lastName = str(f['Official Last'] || f['Last'] || f['Last Name'] || '')
      const fullName = str(f['Name'] || '') || `${firstName} ${lastName}`.trim()
      return {
        id: r.id,
        name: fullName || 'Member',
        city: str(f['Base MT City'] || f['Member - City'] || f['City'] || f['Location'] || '') || undefined,
        dateJoined: str(f['Date Joined'] || '') || undefined,
        imageUrl: attachmentUrl(f['Photo'] || f['Headshot']),
      }
    })
  } catch (err) {
    console.error('[airtable] getMemberDirectory:', err)
    return []
  }
}

// ─────────────────────────────────────────────
// Legacy aliases (for existing pages that use old function names)
// ─────────────────────────────────────────────

export async function getMemberByEmail(email: string): Promise<AirtableMember | null> {
  const investor = await getInvestorByEmail(email)
  if (!investor) return null
  return {
    id: investor.id,
    email: investor.email,
    name: investor.name,
    status: 'Active',
    memberSince: investor.dateJoined,
  }
}

export async function getMemberPortfolio(memberId: string): Promise<MemberInvestment[]> {
  const accounts = await getInvestorAccounts(memberId)
  if (!accounts.length) return []
  const transactions = await getInvestorTransactions(accounts.map((a) => a.id))
  return transactions.map((t) => ({
    id: t.id,
    memberId,
    companyId: t.portfolioCompanyIds[0] || '',
    companyName: t.portfolioCompanyName || 'Unknown Company',
    fundName: t.fundName,
    amount: t.amount,
    investmentDate: t.date || '',
    status: 'Active',
  }))
}

export async function getPortfolioCompanies() {
  return getAllPortfolioCompanies()
}

export async function getMemberDocuments() {
  return []
}

export async function updateMemberClerkId(
  _airtableRecordId: string,
  _clerkUserId: string
): Promise<boolean> {
  return false
}

export const getCurrentMember = getMemberByEmail
