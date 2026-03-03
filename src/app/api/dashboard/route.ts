import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import Transaction from "@/models/Transaction";
import mongoose from "mongoose";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = new mongoose.Types.ObjectId(
      (session.user as { id: string }).id
    );

    await dbConnect();

    const now = new Date();
    const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, 1);
    const sixMonthsAgoKey = `${sixMonthsAgo.getFullYear()}-${String(sixMonthsAgo.getMonth() + 1).padStart(2, "0")}`;

    // --- Single Aggregation Pipeline ---
    // 1. Group by month and holding to get the last snapshot of each holding per month
    // 2. Lookup holding details
    // 3. Group by month to gather all holding snapshots for that month
    const aggregatedData = await Transaction.aggregate([
      { $match: { user: userId } },
      { $sort: { dateTime: 1 } },
      {
        $group: {
          _id: {
            month: { $dateToString: { format: "%Y-%m", date: { $toDate: "$dateTime" } } },
            holding: "$holding"
          },
          lastPortfolio: { $last: "$totalPortfolioSize" },
          lastInvested: { $last: "$totalAmountInvested" },
          monthlyAmount: { $sum: "$amount" }
        }
      },
      {
        $lookup: {
          from: "holdings",
          localField: "_id.holding",
          foreignField: "_id",
          as: "holdingDetails"
        }
      },
      { $unwind: "$holdingDetails" },
      {
        $group: {
          _id: "$_id.month",
          holdings: {
            $push: {
              holdingId: "$_id.holding",
              name: "$holdingDetails.name",
              risk: { $ifNull: ["$holdingDetails.risk", "high"] },
              portfolioSize: "$lastPortfolio",
              amountInvested: "$lastInvested",
              monthlyInvestment: "$monthlyAmount",
              profit: { $subtract: ["$lastPortfolio", "$lastInvested"] }
            }
          },
          totalMonthlyInvestment: { $sum: "$monthlyAmount" }
        }
      },
      { $sort: { _id: 1 as const } }
    ]);

    // --- Post-processing for accurate carry-over and overall totals ---
    const monthlyStats: any[] = [];
    const latestStates: Record<string, { portfolioSize: number, amountInvested: number, name: string, risk: string }> = {};

    for (const monthData of aggregatedData) {
      const monthKey = monthData._id;
      
      // Update latest states for holdings that had transactions this month
      monthData.holdings.forEach((h: any) => {
        latestStates[h.holdingId.toString()] = {
          name: h.name,
          risk: h.risk,
          portfolioSize: h.portfolioSize,
          amountInvested: h.amountInvested
        };
      });

      // Calculate overall cumulative totals at the end of this month
      let totalPortfolioSize = 0;
      let totalAmountInvested = 0;
      const allHoldingsSnapshot: any[] = [];

      Object.entries(latestStates).forEach(([id, state]) => {
        totalPortfolioSize += state.portfolioSize;
        totalAmountInvested += state.amountInvested;
        allHoldingsSnapshot.push({
          holdingId: id,
          ...state,
          profit: state.portfolioSize - state.amountInvested
        });
      });

      monthlyStats.push({
        month: monthKey,
        totalPortfolioSize,
        totalAmountInvested,
        totalProfit: totalPortfolioSize - totalAmountInvested,
        totalMonthlyInvestment: monthData.totalMonthlyInvestment,
        holdings: allHoldingsSnapshot
      });
    }

    // --- Derive dashboard overall statistics ---
    const lastMonth = monthlyStats[monthlyStats.length - 1] || { 
      totalAmountInvested: 0, 
      totalPortfolioSize: 0, 
      totalProfit: 0 
    };

    const totalAmountInvested = lastMonth.totalAmountInvested;
    const totalPortfolioSize = lastMonth.totalPortfolioSize;
    const totalProfit = totalPortfolioSize - totalAmountInvested;

    // Current month investment
    const currentMonthEntry = monthlyStats.find(m => m.month === currentMonthKey);
    const totalInvestmentCurrentMonth = currentMonthEntry?.totalMonthlyInvestment || 0;

    // Current month profit
    const currentMonthIndex = monthlyStats.findIndex(m => m.month === currentMonthKey);
    const previousMonthProfit = currentMonthIndex > 0 ? monthlyStats[currentMonthIndex - 1].totalProfit : 0;
    const currentMonthProfit = totalProfit - previousMonthProfit;

    // Profit in last 6 months
    const sixMonthsAgoIndex = monthlyStats.findIndex(m => m.month >= sixMonthsAgoKey);
    const profitBeforeSixMonths = sixMonthsAgoIndex > 0 ? monthlyStats[sixMonthsAgoIndex - 1].totalProfit : 0;
    const profitLastSixMonths = totalProfit - profitBeforeSixMonths;

    // Total profitable months (where cumulative profit increased)
    let totalProfitableMonths = 0;
    for (let i = 0; i < monthlyStats.length; i++) {
      const curr = monthlyStats[i].totalProfit;
      const prev = i > 0 ? monthlyStats[i - 1].totalProfit : 0;
      if (curr > prev) totalProfitableMonths++;
    }

    // Target monthly return (yearly 22%)
    const yearlyTargetRate = 0.22;
    const monthlyTargetReturn = (totalPortfolioSize * yearlyTargetRate) / 12;

    return NextResponse.json({
      totalAmountInvested,
      totalPortfolioSize,
      totalProfit,
      totalInvestmentCurrentMonth,
      currentMonthProfit,
      profitLastSixMonths,
      totalProfitableMonths,
      totalMonths: monthlyStats.length,
      monthlyTargetReturn,
      monthlyData: monthlyStats // Include new detailed data for charts
    });
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
