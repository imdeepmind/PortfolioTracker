"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "@/components/items/DashboardLayout";
import StatCard from "@/components/bits/StatCard";
import { PageSpinner } from "@/components/bits/Spinner";
import { formatCurrency } from "@/lib/constants";

// Import Charts
import PortfolioOverviewChart from "@/components/charts/PortfolioOverviewChart";
import HoldingsDistributionChart from "@/components/charts/HoldingsRiskDistributionChart";
import MonthlyPnLChart from "@/components/charts/MonthlyPnLChart";
import HoldingsPnLChart from "@/components/charts/HoldingsPnLChart";
import HoldingDetailChart from "@/components/charts/HoldingDetailChart";

interface DashboardData {
  totalAmountInvested: number;
  totalPortfolioSize: number;
  totalProfit: number;
  totalInvestmentCurrentMonth: number;
  currentMonthProfit: number;
  profitLastSixMonths: number;
  totalProfitableMonths: number;
  totalMonths: number;
  monthlyTargetReturn: number;
}

// Hardcoded Chart Mock Data
const mockPortfolioOverviewData = [
  { month: "Jan", totalInvestment: 100000, portfolioValue: 102000, monthlyInvestment: 20000 },
  { month: "Feb", totalInvestment: 120000, portfolioValue: 128000, monthlyInvestment: 20000 },
  { month: "Mar", totalInvestment: 150000, portfolioValue: 155000, monthlyInvestment: 30000 },
  { month: "Apr", totalInvestment: 170000, portfolioValue: 185000, monthlyInvestment: 20000 },
  { month: "May", totalInvestment: 200000, portfolioValue: 212000, monthlyInvestment: 30000 },
  { month: "Jun", totalInvestment: 220000, portfolioValue: 245000, monthlyInvestment: 20000 },
  { month: "Jul", totalInvestment: 250000, portfolioValue: 270000, monthlyInvestment: 30000 },
  { month: "Aug", totalInvestment: 270000, portfolioValue: 265000, monthlyInvestment: 20000 },
  { month: "Sep", totalInvestment: 300000, portfolioValue: 310000, monthlyInvestment: 30000 },
  { month: "Oct", totalInvestment: 320000, portfolioValue: 345000, monthlyInvestment: 20000 },
  { month: "Nov", totalInvestment: 350000, portfolioValue: 380000, monthlyInvestment: 30000 },
  { month: "Dec", totalInvestment: 380000, portfolioValue: 420000, monthlyInvestment: 30000 },
];

const mockHoldingsRiskDistData = [
  { name: "High", value: 50 },
  { name: "Medium", value: 30 },
  { name: "Low", value: 20 },
];

const mockMonthlyPnlData = [
  { month: "Jan", pnl: 2000, pnlPercent: 2.0 },
  { month: "Feb", pnl: 6000, pnlPercent: 5.0 },
  { month: "Mar", pnl: -3000, pnlPercent: -1.9 },
  { month: "Apr", pnl: 10000, pnlPercent: 5.4 },
  { month: "May", pnl: 7000, pnlPercent: 3.3 },
  { month: "Jun", pnl: 13000, pnlPercent: 5.3 },
  { month: "Jul", pnl: 5000, pnlPercent: 1.9 },
  { month: "Aug", pnl: -25000, pnlPercent: -8.6 },
  { month: "Sep", pnl: 15000, pnlPercent: 4.8 },
  { month: "Oct", pnl: 15000, pnlPercent: 4.3 },
  { month: "Nov", pnl: 5000, pnlPercent: 1.3 },
  { month: "Dec", pnl: 10000, pnlPercent: 2.4 },
];

const mockHoldingsPnlData = [
  { name: "Reliance Ind.", pnlPercent: 25.4 },
  { name: "TCS", pnlPercent: 18.2 },
  { name: "HDFC Bank", pnlPercent: -5.6 },
  { name: "Infosys", pnlPercent: 12.1 },
  { name: "ITC", pnlPercent: -2.3 },
];

interface HoldingDataPoint {
  month: string;
  totalInvestment: number;
  portfolioValue: number;
  monthlyInvestment: number;
}

const mockHoldingDetailData: Record<string, HoldingDataPoint[]> = {
  "Reliance Ind.": [
    { month: "Jan", totalInvestment: 30000, portfolioValue: 31000, monthlyInvestment: 5000 },
    { month: "Feb", totalInvestment: 35000, portfolioValue: 38000, monthlyInvestment: 5000 },
    { month: "Mar", totalInvestment: 40000, portfolioValue: 45000, monthlyInvestment: 5000 },
    { month: "Apr", totalInvestment: 50000, portfolioValue: 58000, monthlyInvestment: 10000 },
    { month: "May", totalInvestment: 55000, portfolioValue: 65000, monthlyInvestment: 5000 },
    { month: "Jun", totalInvestment: 60000, portfolioValue: 75240, monthlyInvestment: 5000 },
  ],
  "TCS": [
    { month: "Jan", totalInvestment: 20000, portfolioValue: 20500, monthlyInvestment: 20000 },
    { month: "Feb", totalInvestment: 25000, portfolioValue: 27000, monthlyInvestment: 5000 },
    { month: "Mar", totalInvestment: 30000, portfolioValue: 31000, monthlyInvestment: 5000 },
    { month: "Apr", totalInvestment: 35000, portfolioValue: 37500, monthlyInvestment: 5000 },
    { month: "May", totalInvestment: 40000, portfolioValue: 44000, monthlyInvestment: 5000 },
    { month: "Jun", totalInvestment: 45000, portfolioValue: 53750, monthlyInvestment: 5000 },
  ],
  "HDFC Bank": [
    { month: "Jan", totalInvestment: 15000, portfolioValue: 14500, monthlyInvestment: 5000 },
    { month: "Feb", totalInvestment: 20000, portfolioValue: 19000, monthlyInvestment: 5000 },
    { month: "Mar", totalInvestment: 25000, portfolioValue: 23000, monthlyInvestment: 5000 },
    { month: "Apr", totalInvestment: 30000, portfolioValue: 28500, monthlyInvestment: 5000 },
    { month: "May", totalInvestment: 35000, portfolioValue: 34000, monthlyInvestment: 5000 },
    { month: "Jun", totalInvestment: 40000, portfolioValue: 37760, monthlyInvestment: 5000 },
  ]
};

export default function HomePage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch("/api/dashboard");
        if (!res.ok) throw new Error("Failed to fetch dashboard data");
        const json = await res.json();
        setData(json);
      } catch {
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const profitTrend = (v: number): "up" | "down" | "neutral" =>
    v > 0 ? "up" : v < 0 ? "down" : "neutral";

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-1">
          Overview of your portfolio performance
        </p>
      </div>

      {loading ? (
        <PageSpinner text="Loading dashboard..." />
      ) : !data ? (
        <div className="backdrop-blur-xl bg-white/[0.03] border border-white/[0.06] rounded-2xl p-16 text-center">
          <p className="text-gray-500">Unable to load dashboard data.</p>
        </div>
      ) : (
        <>
          {/* Stat Cards - Adjusted to 8 cols on ultrawide */}
          <div className="grid gap-4 grid-cols-1 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-8 relative z-10">
            <StatCard
              label="Total Amount Invested"
              value={formatCurrency(data.totalAmountInvested)}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />

            <StatCard
              label="Total Portfolio Size"
              value={formatCurrency(data.totalPortfolioSize)}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              }
            />

            <StatCard
              label="Total Profit"
              value={`${data.totalProfit >= 0 ? "+" : ""}${formatCurrency(data.totalProfit)}`}
              subValue={
                data.totalAmountInvested > 0
                  ? `${data.totalProfit >= 0 ? "+" : ""}${((data.totalProfit / data.totalAmountInvested) * 100).toFixed(1)}% return`
                  : undefined
              }
              trend={profitTrend(data.totalProfit)}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              }
            />

            <StatCard
              label="Investment This Month"
              value={formatCurrency(data.totalInvestmentCurrentMonth)}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              }
            />

            <StatCard
              label="Profit This Month"
              value={`${data.currentMonthProfit >= 0 ? "+" : ""}${formatCurrency(data.currentMonthProfit)}`}
              trend={profitTrend(data.currentMonthProfit)}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              }
            />

            <StatCard
              label="Profit Last 6 Months"
              value={`${data.profitLastSixMonths >= 0 ? "+" : ""}${formatCurrency(data.profitLastSixMonths)}`}
              trend={profitTrend(data.profitLastSixMonths)}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              }
            />

            <StatCard
              label="Profitable Months"
              value={`${data.totalProfitableMonths} / ${data.totalMonths}`}
              subValue={
                data.totalMonths > 0
                  ? `${((data.totalProfitableMonths / data.totalMonths) * 100).toFixed(0)}% win rate`
                  : undefined
              }
              trend={
                data.totalMonths > 0 && data.totalProfitableMonths / data.totalMonths >= 0.5
                  ? "up"
                  : data.totalMonths > 0
                    ? "down"
                    : "neutral"
              }
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />

            <StatCard
              label="Monthly Target (22%/yr)"
              value={formatCurrency(data.monthlyTargetReturn)}
              subValue="Target return per month"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              }
            />
          </div>

          {/* Charts Section */}
          <div className="mt-8 space-y-6 relative z-10 text-white">
            
            {/* Portfolio Overview */}
            <div className="h-[400px]">
              <PortfolioOverviewChart data={mockPortfolioOverviewData} />
            </div>

            {/* Middle row: Holdings Pie + Monthly PnL Bar/Line */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 h-auto xl:h-[400px]">
              <div className="h-[350px] xl:h-full">
                <HoldingsDistributionChart data={mockHoldingsRiskDistData} />
              </div>
              <div className="h-[350px] xl:h-full">
                <MonthlyPnLChart data={mockMonthlyPnlData} />
              </div>
            </div>

            {/* Holdings PnL */}
            <div className="h-[400px]">
              <HoldingsPnLChart data={mockHoldingsPnlData} />
            </div>

            {/* Individual Holding Overviews */}
            <div className="pt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
                {Object.entries(mockHoldingDetailData).map(([name, history]) => (
                  <div key={name} className="h-[400px]">
                    <HoldingDetailChart holdingName={name} data={history} />
                  </div>
                ))}
              </div>
            </div>
            
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
