import { Building2 } from 'lucide-react'

/**
 * Renders a company logo in a fixed, padded white box (object-contain so any
 * aspect ratio fits without cropping or touching the edges), or a building-icon
 * placeholder when there's no logo. Used everywhere companies are listed.
 */
export function CompanyLogo({
  src,
  alt,
  size = 44,
  className = '',
}: {
  src?: string
  alt: string
  size?: number
  className?: string
}) {
  const boxStyle = { width: size, height: size }

  if (!src) {
    return (
      <div
        style={boxStyle}
        className={`rounded-lg bg-navy-50 flex items-center justify-center flex-shrink-0 ${className}`}
      >
        <Building2 size={Math.round(size * 0.45)} className="text-navy-400" />
      </div>
    )
  }

  return (
    <div
      style={boxStyle}
      className={`rounded-lg bg-white border border-navy-100 flex items-center justify-center overflow-hidden p-1.5 flex-shrink-0 ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="max-w-full max-h-full object-contain" />
    </div>
  )
}
