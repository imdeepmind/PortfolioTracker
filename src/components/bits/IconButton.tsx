import React from 'react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  variant?: 'default' | 'danger';
  size?: 'sm' | 'md';
}

const variantStyles = {
  default:
    'bg-white/[0.06] border border-white/[0.1] text-gray-400 hover:text-white hover:bg-white/[0.1]',
  danger:
    'bg-white/[0.06] border border-white/[0.1] text-gray-400 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20',
};

const sizeStyles = {
  sm: 'p-2',
  md: 'p-2.5',
};

export default function IconButton({
  icon,
  variant = 'default',
  size = 'md',
  className = '',
  ...rest
}: IconButtonProps) {
  return (
    <button
      className={`rounded-lg transition-all duration-200 disabled:opacity-50 cursor-pointer ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...rest}
    >
      {icon}
    </button>
  );
}
