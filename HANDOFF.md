# FrontierAngels Member Portal Handoff

## Current Status

- Next.js 14 app with public FrontierAngels pages and authenticated member portal.
- Member portal uses Clerk for authentication and Airtable for FA Core Database data.
- Main portal routes exist under `app/(members)/members/`:
  - `dashboard`
  - `portfolio`
  - `companies`
  - `deals`
  - `funds`
  - `documents`
  - `events`
  - `directory`
  - `account`
- Admin data tester exists at `/admin`.

## Verification

These pass as of the cleanup handoff:

```bash
npm run type-check
npm run build
```

In a fresh clone without `.env.local`, `npm run build` may log Airtable configuration warnings while rendering public pages. The build still completes. Add real Airtable and Clerk values before product QA.

## Dependency Warning

`npm ci` currently reports audit findings, including high and critical vulnerabilities, and warns that `next@14.2.5` should be upgraded. Treat dependency upgrades as an early teammate task before any production member launch.

## Required Environment

Use `.env.local.example` as the template. Required values:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
AIRTABLE_API_KEY=
AIRTABLE_BASE_ID=
NEXT_PUBLIC_APP_URL=
```

Optional values:

```bash
RESEND_API_KEY=
CONTACT_EMAIL_TO=
CLERK_WEBHOOK_SECRET=
```

Do not commit `.env.local`.

## Recommended Next Work

1. Run the app locally with live env vars:

```bash
npm run dev
```

2. Sign in through Clerk and test these member paths with a real FA member email:

```text
/members/dashboard
/members/portfolio
/members/companies
/members/deals
/members/funds
/members/documents
/members/events
/members/directory
/admin
```

3. Verify Airtable field mappings in `lib/airtable.ts` against the live FA Core Database.
4. Decide what should be visible in the first member-facing launch:
   - Dashboard KPIs
   - Direct investments
   - Fund commitments/contributions
   - Documents
   - Open deals
   - Events
   - Member directory
5. Connect deployment, preferably Vercel, and add the same environment variables there.
6. Configure Clerk production URLs and webhook endpoint after deployment.

## Notes

- The app is build-clean, but product QA is still needed before inviting members.
- `/api/test?email=<member-email>&detailed=true` is useful for checking Airtable data returned for one member.
- The portal currently assumes FA Core Database table IDs and field names in `lib/airtable.ts`.
