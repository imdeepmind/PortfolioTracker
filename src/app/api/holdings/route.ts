import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import Holding from "@/models/Holding";
import "@/models/Transaction";
import mongoose from "mongoose";

// GET all holdings for the current user with latest transaction data
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;

    await dbConnect();

    const holdings = await Holding.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: "transactions",
          let: { holdingId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$holding", "$$holdingId"] },
              },
            },
            { $sort: { dateTime: -1 } },
            { $limit: 1 },
            {
              $project: {
                totalAmountInvested: 1,
                totalPortfolioSize: 1,
              },
            },
          ],
          as: "latestTransaction",
        },
      },
      {
        $addFields: {
          latestTx: { $arrayElemAt: ["$latestTransaction", 0] },
        },
      },
      {
        $project: {
          name: 1,
          description: 1,
          risk: 1,
          createdAt: 1,
          totalAmountInvested: {
            $ifNull: ["$latestTx.totalAmountInvested", 0],
          },
          totalPortfolioSize: {
            $ifNull: ["$latestTx.totalPortfolioSize", 0],
          },
        },
      },
    ]);

    return NextResponse.json(holdings);
  } catch (error) {
    console.error("Get holdings error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST create a new holding
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, description, risk } = await req.json();

    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Holding name is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const holding = await Holding.create({
      name: name.trim(),
      description: description?.trim() || "",
      risk: risk || "high",
      user: (session.user as { id: string }).id,
    });

    return NextResponse.json(holding, { status: 201 });
  } catch (error) {
    console.error("Create holding error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
