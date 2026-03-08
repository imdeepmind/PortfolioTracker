'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import DashboardLayout from '@/components/items/DashboardLayout';
import GlassCard from '@/components/bits/GlassCard';
import Input from '@/components/bits/Input';
import Select from '@/components/bits/Select';
import Button from '@/components/bits/Button';
import BackLink from '@/components/bits/BackLink';

interface Holding {
  _id: string;
  name: string;
}

export default function BulkInsertTransactionPage() {
  const router = useRouter();
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [selectedHolding, setSelectedHolding] = useState('');
  const [amount, setAmount] = useState('');
  const [totalPortfolioSize, setTotalPortfolioSize] = useState('');
  const [dateTime, setDateTime] = useState(new Date().toISOString().slice(0, 16));
  const [loading, setLoading] = useState(false);
  const [fetchingHoldings, setFetchingHoldings] = useState(true);

  useEffect(() => {
    const fetchHoldings = async () => {
      try {
        const res = await fetch('/api/holdings');
        if (!res.ok) throw new Error('Failed to fetch holdings');
        const data = await res.json();
        setHoldings(data);
        if (data.length > 0) {
          setSelectedHolding(data[0]._id);
        }
      } catch {
        toast.error('Failed to load holdings');
      } finally {
        setFetchingHoldings(false);
      }
    };

    fetchHoldings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // No backend API integration for now as per requirements
    setTimeout(() => {
      toast.success('Bulk transaction recorded successfully (Mock)');
      router.push('/holdings');
      setLoading(false);
    }, 1000);
  };

  const holdingOptions = holdings.map((h) => ({
    value: h._id,
    label: h.name,
  }));

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <BackLink href="/holdings">Back to Holdings</BackLink>
          <h1 className="text-3xl font-bold text-white">Bulk Insert Transaction</h1>
          <p className="text-gray-400 mt-1">Record multiple or complex investment transactions</p>
        </div>

        <GlassCard>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Select
              id="holding"
              label="Select Holding"
              options={holdingOptions}
              value={selectedHolding}
              onChange={(e) => setSelectedHolding(e.target.value)}
              disabled={fetchingHoldings}
              required
            />

            <Input
              id="amount"
              label="Amount Investing"
              helperText="How much are you investing in this transaction?"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
            />

            <Input
              id="totalPortfolioSize"
              label="Total Portfolio Value"
              helperText="Total value of this holding (total invested + capital gains received)"
              type="number"
              step="0.01"
              value={totalPortfolioSize}
              onChange={(e) => setTotalPortfolioSize(e.target.value)}
              placeholder="0.00"
              required
            />

            <Input
              id="dateTime"
              label="Date & Time"
              type="datetime-local"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
            />

            <div className="flex items-center gap-3 pt-2">
              <Button type="submit" loading={loading} loadingText="Recording..." size="lg">
                Record Transaction
              </Button>
              <Button href="/holdings" variant="secondary" size="lg">
                Cancel
              </Button>
            </div>
          </form>
        </GlassCard>
      </div>
    </DashboardLayout>
  );
}
