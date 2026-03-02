"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import DashboardLayout from "@/components/DashboardLayout";

interface Holding {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
}

export default function HoldingsListPage() {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchHoldings = async () => {
    try {
      const res = await fetch("/api/holdings");
      if (!res.ok) throw new Error("Failed to fetch holdings");
      const data = await res.json();
      setHoldings(data);
    } catch {
      toast.error("Failed to load holdings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHoldings();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/holdings/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete");
      }
      setHoldings((prev) => prev.filter((h) => h._id !== id));
      toast.success(`"${name}" deleted successfully`);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to delete holding");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Holdings</h1>
          <p className="text-gray-400 mt-1">Manage your portfolio holdings</p>
        </div>
        <Link
          href="/holdings/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all duration-200 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Holding
        </Link>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex items-center gap-3 text-gray-400">
            <svg className="animate-spin w-6 h-6" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Loading holdings...
          </div>
        </div>
      ) : holdings.length === 0 ? (
        <div className="backdrop-blur-xl bg-white/[0.03] border border-white/[0.06] rounded-2xl p-16 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 mb-6">
            <svg className="w-10 h-10 text-indigo-400/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-200 mb-2">No holdings yet</h2>
          <p className="text-gray-500 max-w-md mx-auto mb-6">
            Get started by adding your first holding to track.
          </p>
          <Link
            href="/holdings/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all duration-200 shadow-lg shadow-indigo-500/25 text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add your first holding
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {holdings.map((holding) => (
            <div
              key={holding._id}
              className="backdrop-blur-xl bg-white/[0.04] border border-white/[0.08] rounded-xl p-5 flex items-center justify-between gap-4 hover:bg-white/[0.06] transition-all duration-200 group"
            >
              <div className="min-w-0 flex-1">
                <h3 className="text-white font-semibold text-lg truncate">{holding.name}</h3>
                {holding.description && (
                  <p className="text-gray-400 text-sm mt-1 line-clamp-1">{holding.description}</p>
                )}
                <p className="text-gray-500 text-xs mt-2">
                  Added {new Date(holding.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={`/holdings/${holding._id}/transactions`}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/20 transition-all duration-200 text-xs font-medium"
                  title="Transactions"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
                  </svg>
                  Transactions
                </Link>
                <Link
                  href={`/holdings/${holding._id}/edit`}
                  className="p-2.5 rounded-lg bg-white/[0.06] border border-white/[0.1] text-gray-400 hover:text-white hover:bg-white/[0.1] transition-all duration-200"
                  title="Edit"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </Link>
                <button
                  onClick={() => handleDelete(holding._id, holding.name)}
                  disabled={deletingId === holding._id}
                  className="p-2.5 rounded-lg bg-white/[0.06] border border-white/[0.1] text-gray-400 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition-all duration-200 disabled:opacity-50 cursor-pointer"
                  title="Delete"
                >
                  {deletingId === holding._id ? (
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
