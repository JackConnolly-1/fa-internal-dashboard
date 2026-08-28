import { SignUp } from '@clerk/nextjs'
import { Mountain } from 'lucide-react'
import Link from 'next/link'

// Clerk appearance themed to the Frontier Angels design system (frontier-angels-ds)
const clerkAppearance = {
  variables: {
    colorPrimary: '#BB8956', // gold accent — primary CTA + links
    colorText: '#0C2140', // navy
    colorTextSecondary: '#4f7fbf', // navy-400 muted
    colorBackground: '#ffffff',
    fontFamily: 'var(--font-body), system-ui, sans-serif',
    borderRadius: '10px',
  },
  elements: {
    rootBox: 'w-full',
    card: 'shadow-card rounded-[10px] border border-navy-100',
    headerTitle: 'font-serif text-navy-900',
    headerSubtitle: 'text-navy-400',
    formButtonPrimary:
      'bg-gold-600 hover:bg-gold-700 text-white font-semibold normal-case tracking-wide',
    footerActionLink: 'text-navy-700 hover:text-gold-600 font-medium',
  },
}

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-navy-900 flex items-center justify-center p-4">
      {/* Subtle grid texture (no gradient — DS rule) */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />
      <div className="relative z-10 w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <Mountain className="w-8 h-8 text-gold-600" strokeWidth={1.5} />
          <span className="font-serif text-2xl font-bold text-white">Frontier Angels</span>
        </Link>

        <SignUp appearance={clerkAppearance} />

        <p className="text-center text-white/50 text-xs mt-6">
          Frontier Angels member portal is by invitation only.{' '}
          <a href="mailto:graham@frontierangels.com" className="underline hover:text-white/80">
            Contact us
          </a>{' '}
          to become a member.
        </p>
      </div>
    </div>
  )
}
