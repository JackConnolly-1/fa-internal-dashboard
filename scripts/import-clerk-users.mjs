// ─────────────────────────────────────────────────────────────────────────────
// Bulk-create Clerk users from Airtable member emails. SILENT — sends NO emails.
// (Invitations are a separate step you do later.)
//
// Run:
//   node scripts/import-clerk-users.mjs
//
// Requires these in .env.local (or the environment):
//   AIRTABLE_BASE_ID, AIRTABLE_API_KEY
//   CLERK_SECRET_KEY   ← MUST be your PRODUCTION key (sk_live_…) to import into
//                         the live instance. A dev key (sk_test_) imports into the
//                         dev instance and the script will refuse unless you pass
//                         --allow-test.
//
// To target production without editing .env.local, override on the command line:
//   CLERK_SECRET_KEY=sk_live_xxx node scripts/import-clerk-users.mjs
// ─────────────────────────────────────────────────────────────────────────────
import fs from 'node:fs'

// --- load .env.local (does not override anything already in process.env) --------
try {
  for (const line of fs.readFileSync('.env.local', 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
  }
} catch { /* no .env.local — rely on real env */ }

const BASE = process.env.AIRTABLE_BASE_ID
const AIRTABLE_KEY = process.env.AIRTABLE_API_KEY || process.env.AIRTABLE_PAT
const CLERK_KEY = process.env.CLERK_SECRET_KEY
const INVESTORS_TABLE = 'tblBqhe9eh47x6hy5'
const ALLOW_TEST = process.argv.includes('--allow-test')
const DRY_RUN = process.argv.includes('--dry-run')

if (!BASE || !AIRTABLE_KEY) { console.error('✗ Missing AIRTABLE_BASE_ID / AIRTABLE_API_KEY'); process.exit(1) }
if (!DRY_RUN) {
  if (!CLERK_KEY || !CLERK_KEY.startsWith('sk_')) { console.error('✗ Missing CLERK_SECRET_KEY (sk_live_…)'); process.exit(1) }
  if (CLERK_KEY.startsWith('sk_test_') && !ALLOW_TEST) {
    console.error('✗ CLERK_SECRET_KEY is a DEV key (sk_test_). This would create users in your DEV instance.')
    console.error('  For production, re-run with your sk_live_ key. To proceed on dev anyway, add --allow-test.')
    process.exit(1)
  }
}

const instance = !CLERK_KEY ? 'n/a (dry-run)' : CLERK_KEY.startsWith('sk_live_') ? 'PRODUCTION (sk_live)' : 'DEVELOPMENT (sk_test)'
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function fetchAllInvestors() {
  const out = []
  let offset
  do {
    const url = `https://api.airtable.com/v0/${BASE}/${INVESTORS_TABLE}?pageSize=100${offset ? `&offset=${offset}` : ''}`
    const res = await fetch(url, { headers: { Authorization: `Bearer ${AIRTABLE_KEY}` } })
    const j = await res.json()
    if (j.error) throw new Error(JSON.stringify(j.error))
    for (const r of j.records || []) {
      const f = r.fields || {}
      out.push({
        email: String(f['Email'] || '').trim(),
        first: String(f['Official First'] || f['First'] || '').trim(),
        last: String(f['Official Last'] || f['Last'] || '').trim(),
        status: String(f['Membership Status'] || '').trim(),
      })
    }
    offset = j.offset
  } while (offset)
  return out
}

async function createClerkUser(m) {
  const res = await fetch('https://api.clerk.com/v1/users', {
    method: 'POST',
    headers: { Authorization: `Bearer ${CLERK_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email_address: [m.email],
      first_name: m.first || undefined,
      last_name: m.last || undefined,
      skip_password_requirement: true,
    }),
  })
  const body = await res.json().catch(() => ({}))
  return { status: res.status, body }
}

// Only "current" members: Membership Status is Active*, Passive, or Frontier Fund Only.
// (Excludes Expired / Closed / Suspended / Other / blank.)
const isCurrent = (s) => {
  s = String(s || '').trim()
  return s.startsWith('Active') || s === 'Passive' || s === 'Frontier Fund Only'
}

// --- gather + dedupe ------------------------------------------------------------
const investors = await fetchAllInvestors()
const seen = new Set()
const members = []
let skippedStatus = 0, skippedBlankDupe = 0
for (const m of investors) {
  const e = m.email.toLowerCase()
  if (!e || !e.includes('@') || seen.has(e)) { skippedBlankDupe++; continue }
  if (!isCurrent(m.status)) { skippedStatus++; continue }
  seen.add(e)
  members.push(m)
}

console.log(`\nTarget instance   : ${instance}`)
console.log(`Airtable records  : ${investors.length}`)
console.log(`Skipped (status)  : ${skippedStatus}  (Expired/Closed/Suspended/Other/blank)`)
console.log(`Skipped (blank/dup): ${skippedBlankDupe}`)
console.log(`Will create       : ${members.length}  current members with a unique email`)
if (DRY_RUN) {
  console.log('\n--dry-run: not creating anything. Emails that WOULD be created:')
  members.forEach((m) => console.log('  ' + m.email))
  process.exit(0)
}
console.log('\nCreating users (no emails sent)…  . = created  = = already exists  x = failed\n')

let created = 0, exists = 0, failed = 0
const failures = []
for (const m of members) {
  try {
    const { status, body } = await createClerkUser(m)
    const errStr = JSON.stringify(body).toLowerCase()
    if (status === 200 || status === 201) { created++; process.stdout.write('.') }
    else if (errStr.includes('exist') || errStr.includes('taken') || errStr.includes('duplicate')) { exists++; process.stdout.write('=') }
    else { failed++; failures.push(`${m.email} → ${status} ${JSON.stringify(body.errors || body)}`); process.stdout.write('x') }
  } catch (err) {
    failed++; failures.push(`${m.email} → ${err.message}`); process.stdout.write('x')
  }
  await sleep(400) // stay under Clerk's rate limit
}

console.log('\n\n=== Summary ===')
console.log(`created         : ${created}`)
console.log(`already existed : ${exists}`)
console.log(`failed          : ${failed}`)
if (failures.length) {
  console.log('\nFailures:')
  failures.forEach((f) => console.log('  ' + f))
}
