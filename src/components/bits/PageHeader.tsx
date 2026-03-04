import React from 'react';

interface PageHeaderProps {
  title: string;
  titleSuffix?: React.ReactNode;
  subtitle?: string;
  action?: React.ReactNode;
}

export default function PageHeader({ title, titleSuffix, subtitle, action }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold text-white">
          {title}
          {titleSuffix && <> {titleSuffix}</>}
        </h1>
        {subtitle && <p className="text-gray-400 mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
