import React from 'react';

/**
 * Card component for Frontier Angels.
 * Used for portfolio companies, deal listings, team members, etc.
 */
export function Card({
  variant = 'default',
  padding = 'md',
  shadow = 'md',
  hoverable = false,
  onClick,
  children,
  style: extraStyle = {},
}) {
  const [hovered, setHovered] = React.useState(false);

  const base = {
    background: '#ffffff',
    borderRadius: 'var(--radius-card)',
    fontFamily: 'var(--font-body)',
    transition: 'var(--transition-shadow), transform var(--duration-base) var(--ease-default)',
    cursor: onClick || hoverable ? 'pointer' : 'default',
    overflow: 'hidden',
    position: 'relative',
  };

  const paddings = {
    none: { padding: 0 },
    sm:   { padding: '16px' },
    md:   { padding: '24px' },
    lg:   { padding: '32px' },
  };

  const shadows = {
    none: {},
    sm:   { boxShadow: 'var(--shadow-sm)' },
    md:   { boxShadow: 'var(--shadow-md)' },
    lg:   { boxShadow: 'var(--shadow-lg)' },
  };

  const variants = {
    default: {
      border: '1px solid var(--color-border)',
    },
    navy: {
      background: 'var(--navy-900)',
      color: '#ffffff',
      border: 'none',
    },
    'navy-subtle': {
      background: 'var(--navy-50)',
      border: '1px solid var(--navy-100)',
    },
    gold: {
      background: 'var(--gold-600)',
      color: '#ffffff',
      border: 'none',
    },
    'gold-subtle': {
      background: 'var(--gold-50)',
      border: '1px solid var(--gold-200)',
    },
    outline: {
      background: 'transparent',
      border: '2px solid var(--navy-200)',
    },
    featured: {
      background: '#ffffff',
      border: '2px solid var(--gold-600)',
      boxShadow: 'var(--shadow-gold)',
    },
  };

  const hoverExtra = hovered && (hoverable || onClick) ? {
    transform: 'translateY(-2px)',
    boxShadow: 'var(--shadow-xl)',
  } : {};

  const style = {
    ...base,
    ...paddings[padding] || paddings.md,
    ...shadows[shadow] || shadows.md,
    ...(variants[variant] || variants.default),
    ...hoverExtra,
    ...extraStyle,
  };

  return (
    <div
      style={style}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
}
