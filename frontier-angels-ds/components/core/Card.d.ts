import { ReactNode, CSSProperties } from 'react';

export interface CardProps {
  /** Visual style */
  variant?: 'default' | 'navy' | 'navy-subtle' | 'gold' | 'gold-subtle' | 'outline' | 'featured';
  /** Internal padding */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Drop shadow intensity */
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  /** Lift on hover */
  hoverable?: boolean;
  onClick?: () => void;
  style?: CSSProperties;
  children?: ReactNode;
}
