import React from 'react';
import Link from 'next/link';
import Spinner from './Spinner';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonBaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  loadingText?: string;
  icon?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

interface ButtonAsButton
  extends
    ButtonBaseProps,
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps> {
  href?: never;
}

interface ButtonAsLink extends ButtonBaseProps {
  href: string;
}

type ButtonProps = ButtonAsButton | ButtonAsLink;

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40',
  secondary:
    'bg-white/[0.06] border border-white/[0.1] text-gray-300 hover:text-white hover:bg-white/[0.1]',
  danger:
    'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-500/25 hover:shadow-red-500/40',
  ghost: 'text-gray-400 hover:text-white hover:bg-white/[0.06]',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  loadingText,
  icon,
  className = '',
  children,
  href,
  ...rest
}: ButtonProps) {
  const baseClasses = `inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  const content = loading ? (
    <>
      <Spinner size="sm" />
      {loadingText || children}
    </>
  ) : (
    <>
      {icon}
      {children}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={baseClasses}>
        {content}
      </Link>
    );
  }

  return (
    <button
      className={baseClasses}
      disabled={loading || (rest as ButtonAsButton).disabled}
      {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {content}
    </button>
  );
}
