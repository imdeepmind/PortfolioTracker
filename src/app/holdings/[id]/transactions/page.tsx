"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import DashboardLayout from "@/components/items/DashboardLayout";
import ConfirmationModal from "@/components/items/ConfirmationModal";
import { PageSpinner } from "@/components/bits/Spinner";
import PageHeader from "@/components/bits/PageHeader";
import EmptyState from "@/components/bits/EmptyState";
import Button from "@/components/bits/Button";
import BackLink from "@/components/bits/BackLink";
import { formatCurrency, formatDateTime } from "@/lib/constants";

interface Transaction {
  _id: string;
  amount: number;
  totalAmountInvested: number;
  totalPortfolioSize: number;
  dateTime: string;
}

interface HoldingInfo {
  _id: string;
  name: string;
}

const PlusIcon = (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

export default function TransactionsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: holdingId } = use(params);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [holding, setHolding] = useState<HoldingInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const fetchTransactions = async () => {
    try {
      const res = await fetch(`/api/holdings/${holdingId}/transactions`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setTransactions(data.transactions);
      setHolding(data.holding);
    } catch {
      toast.error("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [holdingId]);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(
        `/api/holdings/${holdingId}/transactions/${deleteTarget}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Failed to delete");
      setTransactions((prev) => prev.filter((t) => t._id !== deleteTarget));
      toast.success("Transaction deleted");
    } catch {
      toast.error("Failed to delete transaction");
      throw new Error("Delete failed");
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <DashboardLayout>
      <BackLink href="/holdings">Back to Holdings</BackLink>

      <PageHeader
        title={holding?.name ?? "Transactions"}
        subtitle={`Track ${holding?.name ?? ""} investments history over time`}
        action={
          <Button href={`/holdings/${holdingId}/transactions/new`} icon={PlusIcon}>
            New Transaction
          </Button>
        }
      />

      {loading ? (
        <PageSpinner text="Loading transactions..." />
      ) : transactions.length === 0 ? (
        <EmptyState
          icon={
            <svg className="w-10 h-10 text-indigo-400/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
            </svg>
          }
          title="No transactions yet"
          description="Record your first transaction to start tracking performance."
          action={
            <Button href={`/holdings/${holdingId}/transactions/new`} icon={PlusIcon}>
              Add first transaction
            </Button>
          }
        />
      ) : (
        <div className="backdrop-blur-xl bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-6 py-4">Date</th>
                  <th className="text-right text-xs font-semibold text-gray-400 uppercase tracking-wider px-6 py-4">Amount</th>
                  <th className="text-right text-xs font-semibold text-gray-400 uppercase tracking-wider px-6 py-4">Total Invested</th>
                  <th className="text-right text-xs font-semibold text-gray-400 uppercase tracking-wider px-6 py-4">Portfolio Value</th>
                  <th className="text-right text-xs font-semibold text-gray-400 uppercase tracking-wider px-6 py-4">Gain / Loss</th>
                  <th className="text-right text-xs font-semibold text-gray-400 uppercase tracking-wider px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => {
                  const gainLoss = tx.totalPortfolioSize - tx.totalAmountInvested;
                  const gainLossPercent =
                    tx.totalAmountInvested !== 0
                      ? (gainLoss / tx.totalAmountInvested) * 100
                      : 0;
                  const isPositive = gainLoss >= 0;

                  return (
                    <tr key={tx._id} className="border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-300 whitespace-nowrap">{formatDateTime(tx.dateTime)}</td>
                      <td className="px-6 py-4 text-sm text-white text-right font-medium whitespace-nowrap">{formatCurrency(tx.amount)}</td>
                      <td className="px-6 py-4 text-sm text-gray-300 text-right whitespace-nowrap">{formatCurrency(tx.totalAmountInvested)}</td>
                      <td className="px-6 py-4 text-sm text-gray-300 text-right whitespace-nowrap">{formatCurrency(tx.totalPortfolioSize)}</td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 text-sm font-medium ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
                          {isPositive ? "+" : ""}{formatCurrency(gainLoss)}
                          <span className="text-xs opacity-70">({isPositive ? "+" : ""}{gainLossPercent.toFixed(1)}%)</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/holdings/${holdingId}/transactions/${tx._id}/edit`}
                            className="p-1.5 rounded-md text-gray-500 hover:text-white hover:bg-white/[0.1] transition-all duration-200"
                            title="Edit"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </Link>
                          <button
                            onClick={() => setDeleteTarget(tx._id)}
                            className="p-1.5 rounded-md text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 cursor-pointer"
                            title="Delete"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={!!deleteTarget}
        title="Delete Transaction"
        message="Are you sure you want to delete this transaction? This action cannot be undone."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </DashboardLayout>
  );
}
