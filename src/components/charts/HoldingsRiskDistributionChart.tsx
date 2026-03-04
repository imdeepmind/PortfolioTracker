'use client';

import React from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import GlassCard from '@/components/bits/GlassCard';

interface HoldingData {
  name: string;
  value: number;
}

interface HoldingsRiskDistributionChartProps {
  data: HoldingData[];
}

const COLORS = ['#f87171', '#fbbf24', '#34d399'];

export default function HoldingsRiskDistributionChart({
  data,
}: HoldingsRiskDistributionChartProps) {
  return (
    <GlassCard padding="md" className="w-full h-full flex flex-col">
      <h3 className="text-lg font-semibold text-white mb-4">Holdings Risk Distribution</h3>
      <div className="flex-1 min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={110}
              paddingAngle={2}
              dataKey="value"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth={1}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(17, 17, 48, 0.9)',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                color: '#fff',
                backdropFilter: 'blur(8px)',
              }}
              itemStyle={{ color: '#e2e8f0' }}
              formatter={(value: number | string | undefined, name: string | undefined) => [
                `${value || 0}%`,
                name || 'Share',
              ]}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}
