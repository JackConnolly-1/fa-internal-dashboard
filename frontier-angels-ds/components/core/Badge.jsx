import React from 'react';

/**
 * Badge / tag component for Frontier Angels.
 * Used for fund labels, status indicators, and category tags.
 */
export function Badge({
  variant = 'navy',
  size = 'md',
  dot = false,
  children,
}) {
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    fontFamily: 'var(--font-body)',
    fontWeight: 'var(--weight-semibold)',
    letterSpacing: 'var(--tracking-wider)',
    textTransform: 'uppercase',
    borderRadius: 'var(--radius-badge)',
    border: '1px solid transparent',
    lineHeight: 1,
  };

  const sizes = {
    sm: { padding: '3px 7px', fontSize: '9px' },
    md: { padding: '4px 9px', fontSize: '10px' },
    lg: { padding: '6px 12px', fontSize: '11px' },
  };

  const variants = {
    navy: {
      background: 'var(--navy-900)',
      color: '#ffffff',
    },
    'navy-subtle': {
      background: 'var(--navy-100)',
      color: 'var(--navy-800)',
    },
    gold: {
      background: 'var(--gold-600)',
      color: '#ffffff',
    },
    'gold-subtle': {
      background: 'var(--gold-100)',
      color: 'var(--gold-800)',
    },
    outline: {
      background: 'transparent',
      color: 'var(--navy-900)',
      borderColor: 'var(--navy-300)',
    },
    success: {
      background: '#e6f4ed',
      color: '#1e6b41',
    },
    warning: {
      background: '#fef3e2',
      color: '#8a4f0a',
    },
    error: {
      background: '#fce8e6',
      color: '#8b1a14',
    },
    neutral: {
      background: 'var(--neutral-100)',
      color: 'var(--neutral-700)',
    },
  };

  const dotColor = {
    navy: '#80a5d2',
    'navy-subtle': 'var(--navy-600)',
    gold: '#ffffff',
    'gold-subtle': 'var(--gold-600)',
    outline: 'var(--navy-500)',
    success: '#2a7d4f',
    warning: '#c97c1a',
    error: '#c0392b',
    neutral: 'var(--neutral-500)',
  }[variant] || '#fff';

  const style = {
    ...base,
    ...sizes[size] || sizes.md,
    ...(variants[variant] || variants.navy),
  };

  return (
    <span style={style}>
      {dot && (
        <span style={{
          width: '5px',
          height: '5px',
          borderRadius: '50%',
          background: dotColor,
          flexShrink: 0,
        }} />
      )}
      {children}
    </span>
  );
}
