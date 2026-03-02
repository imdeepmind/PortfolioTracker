"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "@/components/items/DashboardLayout";
import HoldingCard from "@/components/items/HoldingCard";
import ConfirmationModal from "@/components/items/ConfirmationModal";
import { PageSpinner } from "@/components/bits/Spinner";
import PageHeader from "@/components/bits/PageHeader";
import EmptyState from "@/components/bits/EmptyState";
import Button from "@/components/bits/Button";

interface Holding {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
  totalAmountInvested: number;
  totalPortfolioSize: number;
}

const PlusIcon = (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

export default function HoldingsListPage() {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

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

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/holdings/${deleteTarget.id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete");
      }
      setHoldings((prev) => prev.filter((h) => h._id !== deleteTarget.id));
      toast.success(`"${deleteTarget.name}" deleted successfully`);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to delete holding");
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
            <svg className="w-10 h-10 text-indigo-400/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {holdings.map((holding) => (
            <HoldingCard
              key={holding._id}
              id={holding._id}
              name={holding.name}
              description={holding.description}
              createdAt={holding.createdAt}
              totalAmountInvested={holding.totalAmountInvested}
              totalPortfolioSize={holding.totalPortfolioSize}
              onDelete={() => setDeleteTarget({ id: holding._id, name: holding.name })}
            />
          ))}
        </div>
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
