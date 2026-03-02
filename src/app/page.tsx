"use client";

import DashboardLayout from "@/components/items/DashboardLayout";

export default function HomePage() {
  return (
    <DashboardLayout>
      <div className="text-center pt-6">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-4">
          Your Portfolio Dashboard
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Track your investments, monitor performance, and make informed decisions — all in one place.
        </p>
      </div>

      {/* Empty state card */}
      <div className="mt-16 backdrop-blur-xl bg-white/[0.03] border border-white/[0.06] rounded-2xl p-16 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 mb-6">
          <svg className="w-10 h-10 text-indigo-400/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-200 mb-2">No portfolio data yet</h2>
        <p className="text-gray-500 max-w-md mx-auto">
          Your dashboard is ready. Portfolio tracking features will be added here soon.
        </p>
      </div>
    </DashboardLayout>
  );
}
