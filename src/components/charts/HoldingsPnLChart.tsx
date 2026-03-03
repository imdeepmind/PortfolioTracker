"use client";

import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell
} from "recharts";
import GlassCard from "@/components/bits/GlassCard";

interface HoldingPnLData {
  name: string;
  pnlPercent: number;
}

interface HoldingsPnLChartProps {
  data: HoldingPnLData[];
}

export default function HoldingsPnLChart({ data }: HoldingsPnLChartProps) {
  return (
    <GlassCard padding="md" className="w-full h-full flex flex-col">
      <h3 className="text-lg font-semibold text-white mb-4">Holdings Performance (%)</h3>
      <div className="flex-1 min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
            <XAxis
              type="number"
              stroke="rgba(255,255,255,0.4)"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#fff" }}
              tickFormatter={(value) => `${value}%`}
            />
            <YAxis
              dataKey="name"
              type="category"
              stroke="rgba(255,255,255,0.7)"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#fff" }}
              width={250}
              interval={0}
            />
            <Tooltip
              cursor={false}
              contentStyle={{
                backgroundColor: "rgba(17, 17, 48, 0.9)",
                borderColor: "rgba(255, 255, 255, 0.1)",
                borderRadius: "12px",
                color: "#fff",
                backdropFilter: "blur(8px)",
              }}
              itemStyle={{ color: "#e2e8f0" }}
              formatter={(value: any) => [`${value}%`, "Return"]}
            />
            <Bar dataKey="pnlPercent" radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.pnlPercent >= 0 ? '#34d399' : '#f87171'} fillOpacity={0.8} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}
