'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import DashboardLayout from '@/components/items/DashboardLayout';
import GlassCard from '@/components/bits/GlassCard';
import Input from '@/components/bits/Input';
import Textarea from '@/components/bits/Textarea';
import Select, { RISK_OPTIONS } from '@/components/bits/Select';
import Button from '@/components/bits/Button';
import BackLink from '@/components/bits/BackLink';
import { PageSpinner } from '@/components/bits/Spinner';

export default function EditHoldingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [risk, setRisk] = useState('high');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchHolding = async () => {
      try {
        const res = await fetch(`/api/holdings/${id}`);
        if (!res.ok) throw new Error('Failed to fetch holding');
        const data = await res.json();
        setName(data.name);
        setDescription(data.description || '');
        setRisk(data.risk || 'high');
      } catch {
        toast.error('Failed to load holding');
        router.push('/holdings');
      } finally {
        setFetching(false);
      }
    };
    fetchHolding();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/holdings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, risk }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Failed to update holding');
        return;
      }

      toast.success('Holding updated successfully');
      router.push('/holdings');
    } catch {
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <DashboardLayout>
        <PageSpinner text="Loading holding..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <BackLink href="/holdings">Back to Holdings</BackLink>
          <h1 className="text-3xl font-bold text-white">Edit Holding</h1>
          <p className="text-gray-400 mt-1">Update the details of your holding</p>
        </div>

        <GlassCard>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              id="name"
              label="Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Apple Inc., Bitcoin, Real Estate Fund"
              required
              maxLength={100}
            />

            <Textarea
              id="description"
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Optional description for this holding..."
              maxLength={500}
            />

            <Select
              id="risk"
              label="Risk Level"
              value={risk}
              onChange={(e) => setRisk(e.target.value)}
              options={RISK_OPTIONS}
            />

            <div className="flex items-center gap-3 pt-2">
              <Button type="submit" loading={loading} loadingText="Saving..." size="lg">
                Save Changes
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
