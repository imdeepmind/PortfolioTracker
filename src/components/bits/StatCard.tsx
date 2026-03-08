import React from 'react';

interface StatCardProps {
  label: string;
  value: string;
  subValue?: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
}

const trendColors = {
  up: 'text-emerald-400',
  down: 'text-red-400',
  neutral: 'text-gray-300',
};

export default function StatCard({
  label,
  value,
  subValue,
  icon,
  trend = 'neutral',
}: StatCardProps) {
  return (
    <div className="backdrop-blur-xl bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5 hover:bg-white/[0.06] transition-all duration-200 group">
      <div className="flex items-start justify-between mb-4">
        <div className="p-2.5 rounded-xl bg-primary-500/10 border border-primary-500/20 text-primary-400 group-hover:bg-primary-500/15 transition-colors">
          {icon}
        </div>
      </div>
      <p className="text-[11px] uppercase tracking-wider text-gray-500 mb-1.5">{label}</p>
      <p className={`text-xl font-bold ${trendColors[trend]}`}>{value}</p>
      {subValue && <p className="text-xs text-gray-500 mt-1">{subValue}</p>}
    </div>
  );
}
