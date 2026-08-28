# Frontier Angels Softr Portal — Page Structure Analysis
# Extracted March 27, 2026 from frontierangels.softr.app

## Navigation (Sidebar)
- Home (/)
- Investment Dashboard (/investor-portal) 🔒 auth required
- Live Deals (/live-deals) 🔒
- Companies (/companies) 🔒
- Frontier Fund 3 (/frontier-fund-3) 🔒
- Frontier Fund 4 (/frontier-fund-4) 🔒
- Frontier Fund 5 (/frontier-fund-5) 🔒
- Events (/events) 🔒
- Angel Resources (/angel-resources) 🔒
- Directory (/directory) 🔒
- Account Settings (/account) 🔒

## User Auth Mapping (Airtable)
- Table: Investors
- Name field: "First"
- Email field: "Email"
- Date joined: "Date Joined"

## Investment Dashboard (/investor-portal) — KEY PAGE

### Summary Stats Block
- Dollars Invested Solo (from Transactions table, filtered by user)
- Solo Gross Distributions
- Companies Invested In (count)
- Dollars Invested in Funds
- Fund Gross Distributions
- Funds Invested In (count)

### Charts Block
- "Your Top Company Investments" — pie/donut chart showing % allocation by company
- "Dollars Deployed by Industry" — aggregated by $ invested, top 10 industries

### Portfolio Health Table
- Scoring table: Company | Date of Last Scoring | Customer/Revenue | Sales Pipeline | Partners | Cash on Hand | Team | Estimated Value | Overall Score
- Score scale: 1-1.6 = Sinking | 1.7-2.3 = Swimming | 2.4+ = Surfing
- Data source: Portfolio Tracker table (Airtable)

### Personal Portfolio Cards
- Company name + status (Open/Closed)
- MOIC (multiple on invested capital)
- Internal Rating (1-3 scale)
- Last Update date
- "See More" pagination
- Filter: user's direct (solo) investments only (NOT fund investments)

### Portfolio Transactions Table
- Columns: Portfolio Company | Amount | Date | Type | Detailed Transaction Type
- Filters: By Transaction Type | By Year
- Data: Transactions table, filtered by user's Investor Account

### Frontier Funds Summary
- Solo | FF3 | FF4 | FF5
- Your Commitment amount per fund
- Data source: Investor Accounts + FA LLCs tables

### Frontier Fund Transactions Table
- Columns: Frontier Fund | Amount | Date | Type
- Filter: By Year
- Data: Transactions table, fund transactions only

## Companies Page (/companies) — Company Directory

### List View
- Company name
- Description (paragraph)
- "See More" link to company detail page
- All FA portfolio companies visible to all members

### Company Detail Page (/company-details-investor)
- Full company profile
- Investment data specific to the logged-in user

## Live Deals (/live-deals)
- Current active deals available for investment
- Deal detail page: /deal-detail-page
- Data: Deals table (status = open/active)

## Frontier Fund Pages (FF3, FF4, FF5)
- Fund-specific performance data
- User's commitment and distributions
- Company Details sub-pages per fund:
  - /company-details-ff3
  - /company-details-fund-4
  - /company-details-fund-5

## Events (/events)
- FA Events table
- Event listings with dates

## Angel Resources (/angel-resources)
- Links/resources for angel investors
- Educational content

## Directory (/directory)
- Member directory
- Member detail: /member-directory-detail

## Airtable Table → Page Mapping
| Softr Page | Airtable Tables Used |
|---|---|
| Investment Dashboard | Investors, Investor Accounts, Transactions, Portfolio Tracker, FA LLCs |
| Companies | Portfolio Companies, Portfolio Tracker |
| Live Deals | Deals, Rounds |
| Fund Pages | FA LLCs, Investor Accounts, Transactions |
| Events | FA Events |
| Directory | Investors |
| Company Detail | Portfolio Companies, Portfolio Tracker, Initial Investment Interest |
