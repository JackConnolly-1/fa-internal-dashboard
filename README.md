# FrontierAngels.com Redesign

Modern Next.js 14 website with public marketing site and authenticated member portal. Built for FrontierAngels — Montana's most active angel investment network.

## 🚀 Quick Start

### 1. Clone & Install

```bash
# Clone the repository
git clone <repository-url>
cd frontierangels-redesign

# Install dependencies
npm install
# or
yarn install
# or
pnpm install
```

### 2. Environment Variables

Copy `.env.local.example` to `.env.local`:

```bash
cp .env.local.example .env.local
```

Fill in your API keys:

```env
# ============================================================
# Clerk Authentication (https://clerk.com)
# ============================================================
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# ============================================================
# Airtable (https://airtable.com/developers)
# ============================================================
AIRTABLE_API_KEY=pat...
AIRTABLE_BASE_ID=app...

# Airtable Table Names (exact names as in your base)
AIRTABLE_MEMBERS_TABLE=Members
AIRTABLE_PORTFOLIO_TABLE=Portfolio Companies
AIRTABLE_FUNDS_TABLE=Funds
AIRTABLE_INVESTMENTS_TABLE=Investments
AIRTABLE_DOCUMENTS_TABLE=Documents

# ============================================================
# App Config
# ============================================================
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📋 Project Structure

```
frontierangels-redesign/
├── app/
│   ├── (public)/          # Public marketing pages
│   │   ├── page.tsx       # Homepage
│   │   ├── about/
│   │   ├── how-it-works/
│   │   ├── portfolio/
│   │   ├── apply/
│   │   └── contact/
│   ├── (members)/         # Authenticated member portal
│   │   ├── members/
│   │   │   ├── dashboard/
│   │   │   ├── portfolio/
│   │   │   ├── funds/
│   │   │   └── documents/
│   │   └── layout.tsx     # Member portal layout
│   ├── sign-in/           # Clerk auth pages
│   ├── sign-up/
│   └── api/               # API routes
├── components/
│   ├── ui/                # Reusable UI components
│   ├── layout/            # Layout components
│   ├── sections/          # Page sections
│   └── members/           # Member portal components
├── lib/                   # Utilities
│   ├── airtable.ts        # Airtable client
│   ├── auth.ts            # Auth helpers
│   └── utils.ts           # General utilities
└── public/                # Static assets
```

## 🔐 Authentication (Clerk)

FrontierAngels uses [Clerk](https://clerk.com) for authentication:

1. **Sign up at Clerk.com** (free tier includes 10,000 monthly active users)
2. **Create an application** and copy your API keys
3. **Configure Redirect URLs** in Clerk dashboard:
   - `http://localhost:3000/sign-in`
   - `http://localhost:3000/sign-up`
   - `http://localhost:3000/members/dashboard` (after sign-in)
4. **Set up webhooks** (optional for Airtable sync):
   - Endpoint: `https://your-domain.com/api/webhooks/clerk`
   - Events: `user.created`, `user.updated`, `user.deleted`
   - Secret: Generate and add to `.env.local` as `CLERK_WEBHOOK_SECRET`

## 🗄️ Data Layer (Airtable)

The site pulls data from Airtable. Set up your base with these tables:

### Required Tables

1. **Members**
   - Fields: `Name`, `Email`, `Status` (Active/Inactive/Pending), `Member Since`, `Clerk User ID`, `Investment Count`, `Total Invested`

2. **Portfolio Companies**
   - Fields: `Name`, `Description`, `Sector`, `Stage` (Pre-Seed/Seed/Series A/etc.), `Status` (Active/Exited/Closed), `Public` (checkbox), `Logo URL`, `Website`, `Location`

3. **Investments**
   - Fields: `Member ID` (link to Members), `Company ID` (link to Portfolio Companies), `Amount`, `Investment Date`, `Status` (Active/Exited/Written Off), `Current Value`, `Exit Multiple`

4. **Funds**
   - Fields: `Name`, `Vintage` (year), `Target Size`, `Closed Size`, `Status` (Open/Closed/Investing/Harvesting), `Investment Count`, `IRR`, `Multiple`, `Description`

5. **Documents**
   - Fields: `Member ID`, `Name`, `Type` (K-1/Annual Report/Investment Summary/etc.), `Year`, `Fund Name`, `URL`, `Uploaded At`

### Airtable Setup Steps

1. **Create a Personal Access Token** in Airtable Account → Developer Hub
2. **Share your base** with the token's email address (read-only access)
3. **Copy base ID** from the URL: `airtable.com/appXXXXXX/...`
4. **Update environment variables** with your table names

## ✨ Features

### Public Marketing Site
- **Homepage**: Hero, value props, how it works, portfolio preview, dual CTA
- **About**: Graham's story, FA mission, team, funds overview
- **How It Works**: Step-by-step process, timeline, FAQ
- **Portfolio**: Public view of investments (filtered by `Public` checkbox)
- **Apply**: Multi-step application form with email notifications
- **Contact**: Contact form + direct email/Calendly links

### Member Portal
- **Dashboard**: Investment overview, recent activity, fund summaries
- **My Portfolio**: Detailed investment table with performance metrics
- **Fund Details**: Fund performance, vintage, allocation
- **Documents**: Tax forms, reports, downloadable files

### Technical Features
- **Next.js 14 App Router** with server components
- **Tailwind CSS** with custom design system (navy/gold brand)
- **Clerk authentication** with middleware protection
- **Airtable integration** with typed client and error handling
- **Responsive design** optimized for all devices
- **Security headers** and best practices
- **Form validation** with React Hook Form + Zod

## 🚢 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
2. **Import project** in Vercel
3. **Add environment variables** from `.env.local`
4. **Deploy**

Vercel will automatically:
- Set up HTTPS
- Configure Next.js build
- Enable edge functions for API routes
- Handle Clerk authentication redirects

### Other Platforms

- **Netlify**: Similar to Vercel, requires adapter
- **AWS Amplify**: Supports Next.js with some configuration
- **Self-hosted**: Docker container with Node.js

## 🔧 Configuration Notes

### Brand Colors
- Navy: `#1a3a6b` (primary)
- Gold: `#f0c420` (accent)
- Defined in `tailwind.config.ts`

### Fonts
- **Inter** for body text (via Google Fonts)
- **Playfair Display** for headings (via Google Fonts)

### Images
- Place images in `/public` directory
- Reference as `/image-name.jpg`
- Use Next.js Image component for optimization

### Environment Variables

| Variable | Purpose | Required |
|----------|---------|----------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk frontend auth | Yes |
| `CLERK_SECRET_KEY` | Clerk backend auth | Yes |
| `AIRTABLE_API_KEY` | Airtable API access | Yes |
| `AIRTABLE_BASE_ID` | Airtable base ID | Yes |
| `AIRTABLE_*_TABLE` | Table names | Yes |
| `NEXT_PUBLIC_APP_URL` | Base URL for auth | Yes |
| `RESEND_API_KEY` | Email notifications | No |
| `CONTACT_EMAIL_TO` | Application notifications | No |
| `CLERK_WEBHOOK_SECRET` | Webhook verification | No |

## 📞 Support

### Development Issues
- Check `console.log` output in browser and server
- Verify environment variables are set
- Ensure Airtable base structure matches expected schema
- Check Clerk dashboard for authentication errors

### Content Updates
- **Public pages**: Edit files in `app/(public)/`
- **Member portal**: Edit files in `app/(members)/`
- **Components**: Reuse from `components/`
- **Styles**: Update `tailwind.config.ts` or `app/globals.css`

### Contact
- **Graham Conran**: graham@frontierangels.com
- **GitHub Issues**: For bug reports and feature requests

## 📄 License

Proprietary — FrontierAngels internal use only.

---

*Built with Next.js 14, Tailwind CSS, Clerk, and Airtable.*