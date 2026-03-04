import React from 'react';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="backdrop-blur-xl bg-white/[0.03] border border-white/[0.06] rounded-2xl p-16 text-center">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 mb-6">
        {icon}
      </div>
      <h2 className="text-xl font-semibold text-gray-200 mb-2">{title}</h2>
      <p className="text-gray-500 max-w-md mx-auto mb-6">{description}</p>
      {action}
    </div>
  );
}
