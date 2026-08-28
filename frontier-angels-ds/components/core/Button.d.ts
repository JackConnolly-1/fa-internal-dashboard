import { ButtonHTMLAttributes, ReactNode } from 'react';

/**
 * @startingPoint section="Components" subtitle="Primary, secondary, ghost, accent variants" viewport="700x220"
 */
export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Visual style of the button */
  variant?: 'primary' | 'secondary' | 'ghost' | 'accent' | 'accent-outline' | 'danger';
  /** Size of the button */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Stretch to fill container width */
  fullWidth?: boolean;
  /** Icon placed before label */
  leftIcon?: ReactNode;
  /** Icon placed after label */
  rightIcon?: ReactNode;
  children?: ReactNode;
}
