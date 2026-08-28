'use client'

import { useEffect, useState } from 'react'

/**
 * Heading that types its text out character-by-character with a blinking
 * caret. The caret fades once typing completes.
 */
export function TypingHeading({
  text,
  highlight,
  highlightClassName = 'text-gold-600',
  className,
  speed = 55,
}: {
  text: string
  /** A suffix of `text` (e.g. the person's name) to render in a different color */
  highlight?: string
  highlightClassName?: string
  className?: string
  speed?: number
}) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    setCount(0)
    const id = setInterval(() => {
      setCount((c) => {
        if (c >= text.length) {
          clearInterval(id)
          return c
        }
        return c + 1
      })
    }, speed)
    return () => clearInterval(id)
  }, [text, speed])

  const done = count >= text.length
  const revealed = text.slice(0, count)
  const splitIndex = highlight ? Math.max(0, text.length - highlight.length) : text.length
  const before = revealed.slice(0, Math.min(count, splitIndex))
  const after = count > splitIndex ? revealed.slice(splitIndex) : ''

  return (
    <h1 className={className} aria-label={text}>
      <span aria-hidden="true">{before}</span>
      {after && (
        <span aria-hidden="true" className={highlightClassName}>
          {after}
        </span>
      )}
      <span
        aria-hidden="true"
        className={`inline-block w-[3px] align-middle bg-gold-600 transition-opacity ${
          done ? 'opacity-0' : 'animate-pulse'
        }`}
        style={{ height: '0.9em' }}
      />
    </h1>
  )
}
