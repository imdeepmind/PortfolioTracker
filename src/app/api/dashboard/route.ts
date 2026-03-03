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
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, 1);
    const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const sixMonthsAgoKey = `${sixMonthsAgo.getFullYear()}-${String(sixMonthsAgo.getMonth() + 1).padStart(2, "0")}`;

    // --- Query 1: Latest transaction per holding (current snapshot) ---
    const latestPerHolding = await Transaction.aggregate([
      { $match: { user: userId } },
      { $addFields: { dateTimeParsed: { $toDate: "$dateTime" } } },
      { $sort: { dateTimeParsed: -1 as const } },
      {
        $group: {
          _id: "$holding",
          totalAmountInvested: { $first: "$totalAmountInvested" },
          totalPortfolioSize: { $first: "$totalPortfolioSize" },
        },
      },
    ]);

    const totalAmountInvested = latestPerHolding.reduce(
      (sum, h) => sum + (h.totalAmountInvested || 0),
      0
    );
    const totalPortfolioSize = latestPerHolding.reduce(
      (sum, h) => sum + (h.totalPortfolioSize || 0),
      0
    );
    const totalProfit = totalPortfolioSize - totalAmountInvested;

    // --- Query 2: Monthly data — per month aggregate totals ---
    // For each month, get the latest snapshot per holding and sum of amounts
    const monthlyData: {
      _id: string;
      totalProfit: number;
      totalInvestment: number;
    }[] = await Transaction.aggregate([
      { $match: { user: userId } },
      { $addFields: { dateTimeParsed: { $toDate: "$dateTime" } } },
      { $sort: { dateTimeParsed: 1 as const } },
      {
        $group: {
          _id: {
            holding: "$holding",
            month: {
              $dateToString: { format: "%Y-%m", date: "$dateTimeParsed" },
            },
          },
          lastPortfolio: { $last: "$totalPortfolioSize" },
          lastInvested: { $last: "$totalAmountInvested" },
          monthlyAmount: { $sum: "$amount" },
        },
      },
      {
        $group: {
          _id: "$_id.month",
          totalProfit: {
            $sum: { $subtract: ["$lastPortfolio", "$lastInvested"] },
          },
          totalInvestment: { $sum: "$monthlyAmount" },
        },
      },
      { $sort: { _id: 1 as const } },
    ]);

    // --- Derive metrics from the two queries ---

    // Current month investment
    const currentMonthEntry = monthlyData.find(
      (m) => m._id === currentMonthKey
    );
    const totalInvestmentCurrentMonth =
      currentMonthEntry?.totalInvestment || 0;

    // Current month profit = current total profit - end-of-previous-month profit
    const currentMonthIndex = monthlyData.findIndex(
      (m) => m._id === currentMonthKey
    );
    const previousMonthProfit =
      currentMonthIndex > 0
        ? monthlyData[currentMonthIndex - 1].totalProfit
        : 0;
    const currentMonthProfit = totalProfit - previousMonthProfit;

    // Profit in last 6 months
    const sixMonthIndex = monthlyData.findIndex(
      (m) => m._id >= sixMonthsAgoKey
    );
    const profitBeforeSixMonths =
      sixMonthIndex > 0 ? monthlyData[sixMonthIndex - 1].totalProfit : 0;
    const profitLastSixMonths = totalProfit - profitBeforeSixMonths;

    // Total profitable months (months where profit increased)
    let totalProfitableMonths = 0;
    for (let i = 0; i < monthlyData.length; i++) {
      const currentP = monthlyData[i].totalProfit;
      const prevP = i > 0 ? monthlyData[i - 1].totalProfit : 0;
      if (currentP - prevP > 0) totalProfitableMonths++;
    }

    // Target monthly return: 22% yearly → monthly target on current portfolio
    const yearlyTargetRate = 0.22;
    const monthlyTargetReturn =
      (totalPortfolioSize * yearlyTargetRate) / 12;

    return NextResponse.json({
      totalAmountInvested,
      totalPortfolioSize,
      totalProfit,
      totalInvestmentCurrentMonth,
      currentMonthProfit,
      profitLastSixMonths,
      totalProfitableMonths,
      totalMonths: monthlyData.length,
      monthlyTargetReturn,
    });
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
