"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import DashboardLayout from "@/components/items/DashboardLayout";
import GlassCard from "@/components/bits/GlassCard";
import Input from "@/components/bits/Input";
import Textarea from "@/components/bits/Textarea";
import Button from "@/components/bits/Button";
import BackLink from "@/components/bits/BackLink";

export default function NewHoldingPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/holdings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to create holding");
        return;
      }

      toast.success("Holding created successfully");
      router.push("/holdings");
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <BackLink href="/holdings">Back to Holdings</BackLink>
          <h1 className="text-3xl font-bold text-white">New Holding</h1>
          <p className="text-gray-400 mt-1">Add a new holding to your portfolio</p>
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

            <div className="flex items-center gap-3 pt-2">
              <Button type="submit" loading={loading} loadingText="Creating..." size="lg">
                Create Holding
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
