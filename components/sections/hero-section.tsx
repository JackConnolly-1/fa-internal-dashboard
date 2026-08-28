import React from 'react'
import Link from 'next/link'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface HeroSectionProps {
  title: string
  subtitle?: string
  description?: string
  primaryCta?: { label: string; href: string }
  secondaryCta?: { label: string; href: string }
  stats?: Array<{ value: string; label: string }>
  backgroundImage?: string
  showScrollIndicator?: boolean
  size?: 'full' | 'medium'
  className?: string
}

export function HeroSection({
  title,
  subtitle,
  description,
  primaryCta,
  secondaryCta,
  stats,
  backgroundImage,
  showScrollIndicator = false,
  size = 'full',
  className,
}: HeroSectionProps) {
  return (
    <section
      className={cn(
        'relative flex items-center bg-gradient-navy overflow-hidden',
        size === 'full' ? 'min-h-screen' : 'min-h-[50vh] py-24',
        className
      )}
    >
      {/* Background image overlay */}
      {backgroundImage && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-hero" />
        </div>
      )}

      {/* Montana mountain silhouette decoration */}
      <div className="absolute bottom-0 left-0 right-0 opacity-10">
        <svg viewBox="0 0 1440 320" className="w-full" preserveAspectRatio="none">
          <path
            fill="currentColor"
            className="text-white"
            d="M0,320 L0,200 L120,140 L240,180 L360,100 L480,160 L600,80 L720,120 L840,60 L960,100 L1080,40 L1200,90 L1320,50 L1440,80 L1440,320 Z"
          />
        </svg>
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
        <div className="max-w-4xl">
          {subtitle && (
            <div className="flex items-center gap-2 mb-6">
              <div className="h-px w-8 bg-gold-400" />
              <span className="text-gold-400 text-sm font-semibold uppercase tracking-widest">
                {subtitle}
              </span>
            </div>
          )}

          <h1 className="text-display-lg md:text-display-xl lg:text-display-2xl font-serif text-white mb-6 leading-tight">
            {title}
          </h1>

          {description && (
            <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl leading-relaxed">
              {description}
            </p>
          )}

          {(primaryCta || secondaryCta) && (
            <div className="flex flex-col sm:flex-row gap-4">
              {primaryCta && (
                <Button asChild size="lg" variant="primary">
                  <Link href={primaryCta.href}>
                    {primaryCta.label}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              )}
              {secondaryCta && (
                <Button asChild size="lg" variant="outline-white">
                  <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
                </Button>
              )}
            </div>
          )}

          {/* Stats row */}
          {stats && stats.length > 0 && (
            <div className="mt-16 flex flex-wrap gap-8 md:gap-16">
              {stats.map((stat, i) => (
                <div key={i}>
                  <div className="text-3xl md:text-4xl font-serif font-bold text-white">
                    {stat.value}
                  </div>
                  <div className="text-white/60 text-sm mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Scroll indicator */}
      {showScrollIndicator && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-white/50" />
        </div>
      )}
    </section>
  )
}
