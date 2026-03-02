"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import DashboardLayout from "@/components/DashboardLayout";

export default function EditTransactionPage({
  params,
}: {
  params: Promise<{ id: string; txId: string }>;
}) {
  const { id: holdingId, txId } = use(params);
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [totalPortfolioSize, setTotalPortfolioSize] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const res = await fetch(
          `/api/holdings/${holdingId}/transactions/${txId}`
        );
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setAmount(data.amount.toString());
        setTotalPortfolioSize(data.totalPortfolioSize.toString());
        setDateTime(new Date(data.dateTime).toISOString().slice(0, 16));
      } catch {
        toast.error("Failed to load transaction");
        router.push(`/holdings/${holdingId}/transactions`);
      } finally {
        setFetching(false);
      }
    };
    fetchTransaction();
  }, [holdingId, txId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(
        `/api/holdings/${holdingId}/transactions/${txId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: parseFloat(amount),
            totalPortfolioSize: parseFloat(totalPortfolioSize),
            dateTime,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to update transaction");
        return;
      }

      toast.success("Transaction updated successfully");
      router.push(`/holdings/${holdingId}/transactions`);
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20">
          <div className="flex items-center gap-3 text-gray-400">
            <svg className="animate-spin w-6 h-6" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Loading transaction...
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/holdings/${holdingId}/transactions`}
            className="inline-flex items-center gap-1 text-gray-400 hover:text-white transition-colors text-sm mb-4"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Transactions
          </Link>
          <h1 className="text-3xl font-bold text-white">Edit Transaction</h1>
          <p className="text-gray-400 mt-1">Update transaction details</p>
        </div>

        {/* Form */}
        <div className="backdrop-blur-xl bg-white/[0.04] border border-white/[0.08] rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-2">
                Amount Investing <span className="text-red-400">*</span>
              </label>
              <p className="text-xs text-gray-500 mb-2">
                How much was invested in this transaction?
              </p>
              <input
                id="amount"
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/[0.1] text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
                placeholder="0.00"
                required
              />
            </div>

            <div>
              <label htmlFor="totalPortfolioSize" className="block text-sm font-medium text-gray-300 mb-2">
                Total Portfolio Value <span className="text-red-400">*</span>
              </label>
              <p className="text-xs text-gray-500 mb-2">
                Total value of this holding (total invested + capital gains received)
              </p>
              <input
                id="totalPortfolioSize"
                type="number"
                step="0.01"
                value={totalPortfolioSize}
                onChange={(e) => setTotalPortfolioSize(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/[0.1] text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
                placeholder="0.00"
                required
              />
            </div>

            <div>
              <label htmlFor="dateTime" className="block text-sm font-medium text-gray-300 mb-2">
                Date &amp; Time
              </label>
              <input
                id="dateTime"
                type="datetime-local"
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/[0.1] text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 cursor-pointer"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Saving...
                  </span>
                ) : (
                  "Save Changes"
                )}
              </button>
              <Link
                href={`/holdings/${holdingId}/transactions`}
                className="px-6 py-3 rounded-xl bg-white/[0.06] border border-white/[0.1] text-gray-300 hover:text-white hover:bg-white/[0.1] transition-all duration-200 font-medium"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
