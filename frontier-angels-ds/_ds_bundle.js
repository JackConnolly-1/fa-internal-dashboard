/* @ds-bundle: {"format":3,"namespace":"FrontierAngelsDesignSystem_d1a40d","components":[{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"}],"sourceHashes":{"components/core/Badge.jsx":"5ad117a607aa","components/core/Button.jsx":"f82ce53077db","components/core/Card.jsx":"896934eada7e"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.FrontierAngelsDesignSystem_d1a40d = window.FrontierAngelsDesignSystem_d1a40d || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Badge.jsx
try { (() => {
/**
 * Badge / tag component for Frontier Angels.
 * Used for fund labels, status indicators, and category tags.
 */
function Badge({
  variant = 'navy',
  size = 'md',
  dot = false,
  children
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
    lineHeight: 1
  };
  const sizes = {
    sm: {
      padding: '3px 7px',
      fontSize: '9px'
    },
    md: {
      padding: '4px 9px',
      fontSize: '10px'
    },
    lg: {
      padding: '6px 12px',
      fontSize: '11px'
    }
  };
  const variants = {
    navy: {
      background: 'var(--navy-900)',
      color: '#ffffff'
    },
    'navy-subtle': {
      background: 'var(--navy-100)',
      color: 'var(--navy-800)'
    },
    gold: {
      background: 'var(--gold-600)',
      color: '#ffffff'
    },
    'gold-subtle': {
      background: 'var(--gold-100)',
      color: 'var(--gold-800)'
    },
    outline: {
      background: 'transparent',
      color: 'var(--navy-900)',
      borderColor: 'var(--navy-300)'
    },
    success: {
      background: '#e6f4ed',
      color: '#1e6b41'
    },
    warning: {
      background: '#fef3e2',
      color: '#8a4f0a'
    },
    error: {
      background: '#fce8e6',
      color: '#8b1a14'
    },
    neutral: {
      background: 'var(--neutral-100)',
      color: 'var(--neutral-700)'
    }
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
    neutral: 'var(--neutral-500)'
  }[variant] || '#fff';
  const style = {
    ...base,
    ...(sizes[size] || sizes.md),
    ...(variants[variant] || variants.navy)
  };
  return /*#__PURE__*/React.createElement("span", {
    style: style
  }, dot && /*#__PURE__*/React.createElement("span", {
    style: {
      width: '5px',
      height: '5px',
      borderRadius: '50%',
      background: dotColor,
      flexShrink: 0
    }
  }), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
/**
 * Button component for Frontier Angels.
 * Supports primary (navy fill), secondary (outlined), ghost, and accent (gold) variants.
 */
function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  leftIcon = null,
  rightIcon = null,
  onClick,
  children,
  type = 'button'
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
    outline: 'none'
  };
  const sizes = {
    xs: {
      padding: '5px 12px',
      fontSize: '11px'
    },
    sm: {
      padding: '8px 16px',
      fontSize: '12px'
    },
    md: {
      padding: '11px 22px',
      fontSize: '13px'
    },
    lg: {
      padding: '14px 28px',
      fontSize: '14px'
    },
    xl: {
      padding: '18px 36px',
      fontSize: '15px'
    }
  };
  const variants = {
    primary: {
      background: 'var(--navy-900)',
      color: '#ffffff',
      borderColor: 'var(--navy-900)'
    },
    secondary: {
      background: 'transparent',
      color: 'var(--navy-900)',
      borderColor: 'var(--navy-900)'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--navy-900)',
      borderColor: 'transparent'
    },
    accent: {
      background: 'var(--gold-600)',
      color: '#ffffff',
      borderColor: 'var(--gold-600)'
    },
    'accent-outline': {
      background: 'transparent',
      color: 'var(--gold-600)',
      borderColor: 'var(--gold-600)'
    },
    danger: {
      background: 'var(--color-error)',
      color: '#ffffff',
      borderColor: 'var(--color-error)'
    }
  };
  const [hovered, setHovered] = React.useState(false);
  const [pressed, setPressed] = React.useState(false);
  const hoverStyles = hovered && !disabled ? {
    primary: {
      background: 'var(--navy-800)',
      borderColor: 'var(--navy-800)',
      boxShadow: 'var(--shadow-md)'
    },
    secondary: {
      background: 'var(--navy-50)',
      boxShadow: 'var(--shadow-sm)'
    },
    ghost: {
      background: 'var(--navy-50)'
    },
    accent: {
      background: 'var(--gold-700)',
      borderColor: 'var(--gold-700)',
      boxShadow: 'var(--shadow-md)'
    },
    'accent-outline': {
      background: 'var(--gold-50)'
    },
    danger: {
      background: '#a93226',
      borderColor: '#a93226'
    }
  }[variant] : {};
  const pressStyles = pressed && !disabled ? {
    transform: 'scale(0.97)'
  } : {};
  const style = {
    ...base,
    ...(sizes[size] || sizes.md),
    ...(variants[variant] || variants.primary),
    ...hoverStyles,
    ...pressStyles
  };
  return /*#__PURE__*/React.createElement("button", {
    type: type,
    style: style,
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => {
      setHovered(false);
      setPressed(false);
    },
    onMouseDown: () => setPressed(true),
    onMouseUp: () => setPressed(false),
    onFocus: e => {
      e.target.style.boxShadow = 'var(--shadow-focus)';
    },
    onBlur: e => {
      e.target.style.boxShadow = '';
    }
  }, leftIcon && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center'
    }
  }, leftIcon), children, rightIcon && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center'
    }
  }, rightIcon));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
/**
 * Card component for Frontier Angels.
 * Used for portfolio companies, deal listings, team members, etc.
 */
function Card({
  variant = 'default',
  padding = 'md',
  shadow = 'md',
  hoverable = false,
  onClick,
  children,
  style: extraStyle = {}
}) {
  const [hovered, setHovered] = React.useState(false);
  const base = {
    background: '#ffffff',
    borderRadius: 'var(--radius-card)',
    fontFamily: 'var(--font-body)',
    transition: 'var(--transition-shadow), transform var(--duration-base) var(--ease-default)',
    cursor: onClick || hoverable ? 'pointer' : 'default',
    overflow: 'hidden',
    position: 'relative'
  };
  const paddings = {
    none: {
      padding: 0
    },
    sm: {
      padding: '16px'
    },
    md: {
      padding: '24px'
    },
    lg: {
      padding: '32px'
    }
  };
  const shadows = {
    none: {},
    sm: {
      boxShadow: 'var(--shadow-sm)'
    },
    md: {
      boxShadow: 'var(--shadow-md)'
    },
    lg: {
      boxShadow: 'var(--shadow-lg)'
    }
  };
  const variants = {
    default: {
      border: '1px solid var(--color-border)'
    },
    navy: {
      background: 'var(--navy-900)',
      color: '#ffffff',
      border: 'none'
    },
    'navy-subtle': {
      background: 'var(--navy-50)',
      border: '1px solid var(--navy-100)'
    },
    gold: {
      background: 'var(--gold-600)',
      color: '#ffffff',
      border: 'none'
    },
    'gold-subtle': {
      background: 'var(--gold-50)',
      border: '1px solid var(--gold-200)'
    },
    outline: {
      background: 'transparent',
      border: '2px solid var(--navy-200)'
    },
    featured: {
      background: '#ffffff',
      border: '2px solid var(--gold-600)',
      boxShadow: 'var(--shadow-gold)'
    }
  };
  const hoverExtra = hovered && (hoverable || onClick) ? {
    transform: 'translateY(-2px)',
    boxShadow: 'var(--shadow-xl)'
  } : {};
  const style = {
    ...base,
    ...(paddings[padding] || paddings.md),
    ...(shadows[shadow] || shadows.md),
    ...(variants[variant] || variants.default),
    ...hoverExtra,
    ...extraStyle
  };
  return /*#__PURE__*/React.createElement("div", {
    style: style,
    onClick: onClick,
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
    role: onClick ? 'button' : undefined,
    tabIndex: onClick ? 0 : undefined
  }, children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

})();
