import React from 'react';
import Link from 'next/link';

interface BackLinkProps {
  href: string;
  children: React.ReactNode;
}

export default function BackLink({ href, children }: BackLinkProps) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1 text-gray-400 hover:text-white transition-colors text-sm mb-4"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      {children}
    </Link>
  );
}
