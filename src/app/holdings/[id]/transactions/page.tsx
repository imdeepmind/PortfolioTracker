"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import DashboardLayout from "@/components/DashboardLayout";

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

export default function TransactionsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: holdingId } = use(params);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [holding, setHolding] = useState<HoldingInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

  const handleDelete = async (txId: string) => {
    if (!confirm("Are you sure you want to delete this transaction?")) return;
    setDeletingId(txId);
    try {
      const res = await fetch(
        `/api/holdings/${holdingId}/transactions/${txId}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Failed to delete");
      setTransactions((prev) => prev.filter((t) => t._id !== txId));
      toast.success("Transaction deleted");
    } catch {
      toast.error("Failed to delete transaction");
    } finally {
      setDeletingId(null);
    }
  };

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(n);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/holdings"
          className="inline-flex items-center gap-1 text-gray-400 hover:text-white transition-colors text-sm mb-4"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Holdings
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Transactions{" "}
              {holding && (
                <span className="text-indigo-400">— {holding.name}</span>
              )}
            </h1>
            <p className="text-gray-400 mt-1">Track investment history over time</p>
          </div>
          <Link
            href={`/holdings/${holdingId}/transactions/new`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all duration-200 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Transaction
          </Link>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex items-center gap-3 text-gray-400">
            <svg className="animate-spin w-6 h-6" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Loading transactions...
          </div>
        </div>
      ) : transactions.length === 0 ? (
        <div className="backdrop-blur-xl bg-white/[0.03] border border-white/[0.06] rounded-2xl p-16 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 mb-6">
            <svg className="w-10 h-10 text-indigo-400/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-200 mb-2">No transactions yet</h2>
          <p className="text-gray-500 max-w-md mx-auto mb-6">
            Record your first transaction to start tracking performance.
          </p>
          <Link
            href={`/holdings/${holdingId}/transactions/new`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all duration-200 shadow-lg shadow-indigo-500/25 text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add first transaction
          </Link>
        </div>
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
                      <td className="px-6 py-4 text-sm text-gray-300 whitespace-nowrap">{formatDate(tx.dateTime)}</td>
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
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/holdings/${holdingId}/transactions/${tx._id}/edit`}
                            className="p-2 rounded-lg bg-white/[0.06] border border-white/[0.1] text-gray-400 hover:text-white hover:bg-white/[0.1] transition-all duration-200"
                            title="Edit"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </Link>
                          <button
                            onClick={() => handleDelete(tx._id)}
                            disabled={deletingId === tx._id}
                            className="p-2 rounded-lg bg-white/[0.06] border border-white/[0.1] text-gray-400 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition-all duration-200 disabled:opacity-50 cursor-pointer"
                            title="Delete"
                          >
                            {deletingId === tx._id ? (
                              <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                              </svg>
                            ) : (
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            )}
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
    </DashboardLayout>
  );
}
