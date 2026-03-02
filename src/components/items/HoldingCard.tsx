"use client";

import React from "react";
import Link from "next/link";
import GlassCard from "@/components/bits/GlassCard";
import IconButton from "@/components/bits/IconButton";
import Spinner from "@/components/bits/Spinner";
import { formatDate } from "@/lib/constants";

interface HoldingCardProps {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  deleting?: boolean;
  onDelete: () => void;
}

export default function HoldingCard({
  id,
  name,
  description,
  createdAt,
  deleting = false,
  onDelete,
}: HoldingCardProps) {
  return (
    <GlassCard padding="md" className="hover:bg-white/[0.06] transition-all duration-200 group">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h3 className="text-white font-semibold text-lg truncate">{name}</h3>
          {description && (
            <p className="text-gray-400 text-sm mt-1 line-clamp-2">{description}</p>
          )}
          <p className="text-gray-500 text-xs mt-3">
            Added {formatDate(createdAt)}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href={`/holdings/${id}/transactions`}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/20 transition-all duration-200 text-xs font-medium"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
            </svg>
            Transactions
          </Link>

          <Link
            href={`/holdings/${id}/edit`}
            className="p-2.5 rounded-lg bg-white/[0.06] border border-white/[0.1] text-gray-400 hover:text-white hover:bg-white/[0.1] transition-all duration-200"
            title="Edit"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </Link>

          <IconButton
            variant="danger"
            onClick={onDelete}
            disabled={deleting}
            title="Delete"
            icon={
              deleting ? (
                <Spinner size="sm" />
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              )
            }
          />
        </div>
      </div>
    </GlassCard>
  );
}
