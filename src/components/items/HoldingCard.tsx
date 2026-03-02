"use client";

import React from "react";
import Link from "next/link";
import GlassCard from "@/components/bits/GlassCard";
import { formatCurrency, formatDate } from "@/lib/constants";

interface HoldingCardProps {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  totalAmountInvested: number;
  totalPortfolioSize: number;
  onDelete: () => void;
}

export default function HoldingCard({
  id,
  name,
  description,
  createdAt,
  totalAmountInvested,
  totalPortfolioSize,
  onDelete,
}: HoldingCardProps) {
  const profit = totalPortfolioSize - totalAmountInvested;
  const profitPercent =
    totalAmountInvested !== 0 ? (profit / totalAmountInvested) * 100 : 0;
  const isPositive = profit >= 0;
  const hasData = totalAmountInvested !== 0 || totalPortfolioSize !== 0;

  return (
    <GlassCard padding="md" className="hover:bg-white/[0.06] transition-all duration-200 group flex flex-col">
      {/* Top row: action buttons */}
      <div className="flex items-center justify-end">
        <div className="flex items-center gap-1 shrink-0">
          <Link
            href={`/holdings/${id}/transactions`}
            className="p-1.5 rounded-md text-gray-500 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all duration-200"
            title="Transactions"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
            </svg>
          </Link>
          <Link
            href={`/holdings/${id}/edit`}
            className="p-1.5 rounded-md text-gray-500 hover:text-white hover:bg-white/[0.1] transition-all duration-200"
            title="Edit"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </Link>
          <button
            onClick={onDelete}
            className="p-1.5 rounded-md text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 cursor-pointer"
            title="Delete"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Name and description */}
      <div className="flex items-center gap-1 shrink-0 mb-3">
        <div className="min-w-0 flex-1">
          <Link href={`/holdings/${id}/transactions`}>
            <h3 className="text-white font-semibold text-lg truncate hover:text-indigo-300 transition-colors cursor-pointer">
              {name}
            </h3>
          </Link>
          {description && (
            <p className="text-gray-500 text-xs mt-1 line-clamp-1">{description}</p>
          )}
        </div>

      </div> 

      {/* Financial stats */}
      <div className="border-t border-white/[0.06] pt-3 mt-auto">
        <div className="grid grid-cols-3 gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">Invested</p>
            <p className="text-sm font-medium text-gray-300">
              {hasData ? formatCurrency(totalAmountInvested) : "—"}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">Value</p>
            <p className="text-sm font-medium text-gray-300">
              {hasData ? formatCurrency(totalPortfolioSize) : "—"}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">Profit</p>
            {hasData ? (
              <p className={`text-sm font-semibold ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
                {isPositive ? "+" : ""}{profitPercent.toFixed(1)}%
              </p>
            ) : (
              <p className="text-sm font-medium text-gray-300">—</p>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <p className="text-gray-600 text-[10px] mt-3">Added {formatDate(createdAt)}</p>
    </GlassCard>
  );
}
