'use client';

import React from 'react';
import {
  Bar,
  ComposedChart,
  Line,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from 'recharts';
import GlassCard from '@/components/bits/GlassCard';
import { formatCurrency } from '@/lib/constants';

interface PnLDataPoint {
  month: string;
  pnl: number;
  pnlPercent: number;
}

interface MonthlyPnLChartProps {
  data: PnLDataPoint[];
}

export default function MonthlyPnLChart({ data }: MonthlyPnLChartProps) {
  return (
    <GlassCard padding="md" className="w-full h-full flex flex-col">
      <h3 className="text-lg font-semibold text-white mb-4">Monthly Profit & Loss</h3>
      <div className="flex-1 min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis
              dataKey="month"
              stroke="rgba(255,255,255,0.4)"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#fff' }}
              dy={10}
            />
            <YAxis
              yAxisId="left"
              stroke="rgba(255,255,255,0.4)"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#fff' }}
              tickFormatter={formatCurrency}
              width={100}
              domain={([dataMin, dataMax]) => {
                const max = Math.max(Math.abs(dataMin), Math.abs(dataMax));
                return [-max, max];
              }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="rgba(255,255,255,0.4)"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#fff' }}
              tickFormatter={(value) => `${value}%`}
              width={60}
              domain={([dataMin, dataMax]) => {
                const max = Math.max(Math.abs(dataMin), Math.abs(dataMax));
                return [-max, max];
              }}
            />
            <Tooltip
              cursor={false}
              contentStyle={{
                backgroundColor: 'rgba(17, 17, 48, 0.9)',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                color: '#fff',
                backdropFilter: 'blur(8px)',
              }}
              itemStyle={{ color: '#e2e8f0' }}
              formatter={(value: number | string | undefined, name: string | undefined) => {
                if (name === 'pnlPercent') return [`${value || 0}%`, 'P&L %'];
                return [formatCurrency(Number(value || 0)), 'P&L'];
              }}
            />
            <Bar yAxisId="left" dataKey="pnl" name="pnl" radius={[4, 4, 4, 4]}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.pnl >= 0 ? '#34d399' : '#f87171'}
                  fillOpacity={0.8}
                />
              ))}
            </Bar>
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="pnlPercent"
              name="pnlPercent"
              stroke="#818cf8"
              strokeWidth={3}
              dot={{ r: 4, fill: '#818cf8', strokeWidth: 0 }}
              activeDot={{ r: 6 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}
