import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

export default function Spinner({ size = 'md', className = '' }: SpinnerProps) {
  return (
    <svg className={`animate-spin ${sizeMap[size]} ${className}`} viewBox="0 0 24 24">
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

export function PageSpinner({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="flex items-center gap-3 text-gray-400">
        <Spinner size="lg" />
        {text}
      </div>
    </div>
  );
}
