'use client';

import { useEffect, useState, useMemo } from 'react';
import toast from 'react-hot-toast';
import DashboardLayout from '@/components/items/DashboardLayout';
import HoldingCard from '@/components/items/HoldingCard';
import ConfirmationModal from '@/components/items/ConfirmationModal';
import { PageSpinner } from '@/components/bits/Spinner';
import PageHeader from '@/components/bits/PageHeader';
import EmptyState from '@/components/bits/EmptyState';
import Button from '@/components/bits/Button';

interface Holding {
  _id: string;
  name: string;
  description: string;
  risk?: 'low' | 'medium' | 'high';
  createdAt: string;
  totalAmountInvested: number;
  totalPortfolioSize: number;
}

type SortKey = 'name' | 'return' | 'invested' | 'portfolio';
type SortDir = 'asc' | 'desc';

const PlusIcon = (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const sortOptions: { key: SortKey; label: string }[] = [
  { key: 'name', label: 'Name' },
  { key: 'return', label: 'Return %' },
  { key: 'invested', label: 'Invested' },
  { key: 'portfolio', label: 'Portfolio' },
];

export default function HoldingsListPage() {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  const fetchHoldings = async () => {
    try {
      const res = await fetch('/api/holdings');
      if (!res.ok) throw new Error('Failed to fetch holdings');
      const data = await res.json();
      setHoldings(data);
    } catch {
      toast.error('Failed to load holdings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHoldings();
  }, []);

  const sortedHoldings = useMemo(() => {
    const sorted = [...holdings].sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case 'name':
          cmp = a.name.localeCompare(b.name);
          break;
        case 'return': {
          const retA = a.totalAmountInvested
            ? ((a.totalPortfolioSize - a.totalAmountInvested) / a.totalAmountInvested) * 100
            : 0;
          const retB = b.totalAmountInvested
            ? ((b.totalPortfolioSize - b.totalAmountInvested) / b.totalAmountInvested) * 100
            : 0;
          cmp = retA - retB;
          break;
        }
        case 'invested':
          cmp = a.totalAmountInvested - b.totalAmountInvested;
          break;
        case 'portfolio':
          cmp = a.totalPortfolioSize - b.totalPortfolioSize;
          break;
      }
      return sortDir === 'desc' ? -cmp : cmp;
    });
    return sorted;
  }, [holdings, sortKey, sortDir]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/holdings/${deleteTarget.id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete');
      }
      setHoldings((prev) => prev.filter((h) => h._id !== deleteTarget.id));
      toast.success(`"${deleteTarget.name}" deleted successfully`);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete holding');
      throw error;
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Holdings"
        subtitle="Manage your portfolio holdings"
        action={
          <Button href="/holdings/new" icon={PlusIcon}>
            New Holding
          </Button>
        }
      />

      {loading ? (
        <PageSpinner text="Loading holdings..." />
      ) : holdings.length === 0 ? (
        <EmptyState
          icon={
            <svg
              className="w-10 h-10 text-indigo-400/60"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          }
          title="No holdings yet"
          description="Get started by adding your first holding to track."
          action={
            <Button href="/holdings/new" icon={PlusIcon}>
              Add your first holding
            </Button>
          }
        />
      ) : (
        <>
          {/* Sort bar */}
          <div className="flex items-center gap-2 mb-5 flex-wrap">
            <span className="text-xs text-gray-500 uppercase tracking-wider mr-1">Sort by</span>
            {sortOptions.map((opt) => {
              const isActive = sortKey === opt.key;
              return (
                <button
                  key={opt.key}
                  onClick={() => handleSort(opt.key)}
                  className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/20'
                      : 'bg-white/[0.04] text-gray-400 border border-white/[0.06] hover:bg-white/[0.08] hover:text-white'
                  }`}
                >
                  {opt.label}
                  {isActive && (
                    <svg
                      className={`w-3 h-3 transition-transform ${sortDir === 'desc' ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 15l7-7 7 7"
                      />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sortedHoldings.map((holding) => (
              <HoldingCard
                key={holding._id}
                id={holding._id}
                name={holding.name}
                description={holding.description}
                risk={holding.risk}
                createdAt={holding.createdAt}
                totalAmountInvested={holding.totalAmountInvested}
                totalPortfolioSize={holding.totalPortfolioSize}
                onDelete={() => setDeleteTarget({ id: holding._id, name: holding.name })}
              />
            ))}
          </div>
        </>
      )}

      <ConfirmationModal
        isOpen={!!deleteTarget}
        title="Delete Holding"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </DashboardLayout>
  );
}
