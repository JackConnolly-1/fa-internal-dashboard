'use client'

import { Treemap, ResponsiveContainer, Tooltip } from 'recharts'

// Navy/gold design-system shades cycled across tiles
const PALETTE = [
  '#0C2140',
  '#BB8956',
  '#1d4a88',
  '#c99970',
  '#4f7fbf',
  '#9a6425',
  '#163769',
  '#e3c4ae',
  '#255da5',
  '#80a5d2',
]

const fmtK = (v: number) =>
  v >= 1_000_000 ? `$${(v / 1_000_000).toFixed(1)}M` : v >= 1_000 ? `$${(v / 1_000).toFixed(0)}K` : `$${v}`

// Greedily wrap a label into lines that fit the given character budget
function wrapLines(text: string, maxChars: number): string[] {
  const words = String(text).split(/\s+/)
  const lines: string[] = []
  let cur = ''
  for (const w of words) {
    if (!cur) cur = w
    else if ((cur + ' ' + w).length <= maxChars) cur += ' ' + w
    else {
      lines.push(cur)
      cur = w
    }
  }
  if (cur) lines.push(cur)
  return lines
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function TreemapContent(props: any) {
  const { x, y, width, height, index, name, value, depth, total } = props
  if (depth !== 1 || width <= 0 || height <= 0) return null
  const fill = PALETTE[index % PALETTE.length]
  const pct = total ? (value / total) * 100 : 0

  const fontSize = 11
  const lineHeight = 13
  const pad = 6
  const showLabel = width > 46 && height > 22

  let lines: string[] = []
  if (showLabel) {
    const maxChars = Math.max(3, Math.floor((width - pad * 2) / (fontSize * 0.6)))
    lines = wrapLines(name, maxChars)
    const maxLines = Math.max(1, Math.floor((height - 8) / lineHeight))
    if (lines.length > maxLines) {
      lines = lines.slice(0, maxLines)
      lines[lines.length - 1] = lines[lines.length - 1].replace(/.$/, '…')
    }
  }
  const showPct = showLabel && height > 14 + (lines.length - 1) * lineHeight + 18

  return (
    <g style={{ animation: 'treemap-in 0.5s ease-out both', animationDelay: `${index * 60}ms` }}>
      <rect x={x} y={y} width={width} height={height} fill={fill} stroke="#fff" strokeWidth={2} />
      {showLabel && (
        <text x={x + pad} y={y + 14} fill="#ffffff" fontSize={fontSize} fontWeight={300}>
          {lines.map((ln, i) => (
            <tspan key={i} x={x + pad} dy={i === 0 ? 0 : lineHeight}>
              {ln}
            </tspan>
          ))}
        </text>
      )}
      {showPct && (
        <text
          x={x + pad}
          y={y + 14 + (lines.length - 1) * lineHeight + 15}
          fill="rgba(255,255,255,0.8)"
          fontSize={10}
          fontWeight={300}
        >
          {pct.toFixed(1)}%
        </text>
      )}
    </g>
  )
}

export function SectorTreemap({ data }: { data: { name: string; value: number }[] }) {
  if (!data.length) {
    return (
      <div className="h-72 flex items-center justify-center text-navy-700 text-sm">No data.</div>
    )
  }
  const total = data.reduce((s, d) => s + d.value, 0)
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <Treemap
          data={data}
          dataKey="value"
          stroke="#fff"
          isAnimationActive={false}
          content={<TreemapContent total={total} /> as any}
        >
          <Tooltip
            formatter={(value: any) => [fmtK(Number(value)), 'Invested']}
            contentStyle={{ border: '1px solid #d9e6f3', borderRadius: '10px', fontSize: '12px' }}
          />
        </Treemap>
      </ResponsiveContainer>
    </div>
  )
}
