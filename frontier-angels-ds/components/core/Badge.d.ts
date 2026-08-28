import { ReactNode } from 'react';

export interface BadgeProps {
  /** Visual style */
  variant?: 'navy' | 'navy-subtle' | 'gold' | 'gold-subtle' | 'outline' | 'success' | 'warning' | 'error' | 'neutral';
  /** Size */
  size?: 'sm' | 'md' | 'lg';
  /** Show a leading dot indicator */
  dot?: boolean;
  children?: ReactNode;
}
