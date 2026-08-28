import React from 'react';

/**
 * Button component for Frontier Angels.
 * Supports primary (navy fill), secondary (outlined), ghost, and accent (gold) variants.
 */
export function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  leftIcon = null,
  rightIcon = null,
  onClick,
  children,
  type = 'button',
}) {
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontFamily: 'var(--font-body)',
    fontWeight: 'var(--weight-semibold)',
    letterSpacing: 'var(--tracking-wide)',
    textTransform: 'uppercase',
    border: '2px solid transparent',
    borderRadius: 'var(--radius-button)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'var(--transition-colors), var(--transition-shadow), transform var(--duration-fast) var(--ease-spring)',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    width: fullWidth ? '100%' : 'auto',
    opacity: disabled ? 0.5 : 1,
    outline: 'none',
  };

  const sizes = {
    xs: { padding: '5px 12px', fontSize: '11px' },
    sm: { padding: '8px 16px', fontSize: '12px' },
    md: { padding: '11px 22px', fontSize: '13px' },
    lg: { padding: '14px 28px', fontSize: '14px' },
    xl: { padding: '18px 36px', fontSize: '15px' },
  };

  const variants = {
    primary: {
      background: 'var(--navy-900)',
      color: '#ffffff',
      borderColor: 'var(--navy-900)',
    },
    secondary: {
      background: 'transparent',
      color: 'var(--navy-900)',
      borderColor: 'var(--navy-900)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--navy-900)',
      borderColor: 'transparent',
    },
    accent: {
      background: 'var(--gold-600)',
      color: '#ffffff',
      borderColor: 'var(--gold-600)',
    },
    'accent-outline': {
      background: 'transparent',
      color: 'var(--gold-600)',
      borderColor: 'var(--gold-600)',
    },
    danger: {
      background: 'var(--color-error)',
      color: '#ffffff',
      borderColor: 'var(--color-error)',
    },
  };

  const [hovered, setHovered] = React.useState(false);
  const [pressed, setPressed] = React.useState(false);

  const hoverStyles = hovered && !disabled ? {
    primary:        { background: 'var(--navy-800)', borderColor: 'var(--navy-800)', boxShadow: 'var(--shadow-md)' },
    secondary:      { background: 'var(--navy-50)', boxShadow: 'var(--shadow-sm)' },
    ghost:          { background: 'var(--navy-50)' },
    accent:         { background: 'var(--gold-700)', borderColor: 'var(--gold-700)', boxShadow: 'var(--shadow-md)' },
    'accent-outline': { background: 'var(--gold-50)' },
    danger:         { background: '#a93226', borderColor: '#a93226' },
  }[variant] : {};

  const pressStyles = pressed && !disabled ? { transform: 'scale(0.97)' } : {};

  const style = {
    ...base,
    ...sizes[size] || sizes.md,
    ...(variants[variant] || variants.primary),
    ...hoverStyles,
    ...pressStyles,
  };

  return (
    <button
      type={type}
      style={style}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false); }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onFocus={(e) => { e.target.style.boxShadow = 'var(--shadow-focus)'; }}
      onBlur={(e) => { e.target.style.boxShadow = ''; }}
    >
      {leftIcon && <span style={{ display: 'flex', alignItems: 'center' }}>{leftIcon}</span>}
      {children}
      {rightIcon && <span style={{ display: 'flex', alignItems: 'center' }}>{rightIcon}</span>}
    </button>
  );
}
