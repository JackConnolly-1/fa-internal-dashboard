// Pure-SVG pie (server-renderable, prints cleanly — no client charting lib).
export function ReportPie({
  data,
  size = 300,
}: {
  data: { label: string; value: number; color: string }[]
  size?: number
}) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1
  const cx = size / 2
  const cy = size / 2
  const r = size / 2 - 2
  let angle = -Math.PI / 2

  const slices = data.map((d) => {
    const frac = d.value / total
    const a0 = angle
    const a1 = angle + frac * 2 * Math.PI
    angle = a1
    const x0 = cx + r * Math.cos(a0)
    const y0 = cy + r * Math.sin(a0)
    const x1 = cx + r * Math.cos(a1)
    const y1 = cy + r * Math.sin(a1)
    const large = frac > 0.5 ? 1 : 0
    const path = `M ${cx} ${cy} L ${x0.toFixed(2)} ${y0.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${x1.toFixed(2)} ${y1.toFixed(2)} Z`
    const mid = (a0 + a1) / 2
    const lx = cx + r * 0.62 * Math.cos(mid)
    const ly = cy + r * 0.62 * Math.sin(mid)
    return { path, color: d.color, pct: Math.round(frac * 100), lx, ly }
  })

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img">
      {slices.map((s, i) => (
        <path key={i} d={s.path} fill={s.color} stroke="#fff" strokeWidth={2} />
      ))}
      {slices.map((s, i) =>
        s.pct >= 4 ? (
          <text
            key={`t${i}`}
            x={s.lx.toFixed(2)}
            y={s.ly.toFixed(2)}
            fontSize={12}
            fontWeight={700}
            fill="#fff"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {s.pct}%
          </text>
        ) : null
      )}
    </svg>
  )
}
