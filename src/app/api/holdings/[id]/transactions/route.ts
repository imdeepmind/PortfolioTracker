import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import Transaction from "@/models/Transaction";
import Holding from "@/models/Holding";

// GET all transactions for a holding
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: holdingId } = await params;
    const userId = (session.user as { id: string }).id;

    await dbConnect();

    const holding = await Holding.findOne({ _id: holdingId, user: userId });
    if (!holding) {
      return NextResponse.json({ error: "Holding not found" }, { status: 404 });
    }

    const transactions = await Transaction.find({
      holding: holdingId,
      user: userId,
    }).sort({ dateTime: -1 });

    return NextResponse.json({ transactions, holding });
  } catch (error) {
    console.error("Get transactions error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST create a new transaction
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: holdingId } = await params;
    const userId = (session.user as { id: string }).id;
    const { amount, totalPortfolioSize, dateTime } = await req.json();

    if (amount === undefined || amount === null) {
      return NextResponse.json(
        { error: "Amount is required" },
        { status: 400 }
      );
    }

    if (totalPortfolioSize === undefined || totalPortfolioSize === null) {
      return NextResponse.json(
        { error: "Total portfolio size is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const holding = await Holding.findOne({ _id: holdingId, user: userId });
    if (!holding) {
      return NextResponse.json({ error: "Holding not found" }, { status: 404 });
    }

    // Get the latest transaction to calculate cumulative totalAmountInvested
    const lastTransaction = await Transaction.findOne({
      holding: holdingId,
      user: userId,
    }).sort({ dateTime: -1 });

    const previousTotal = lastTransaction
      ? lastTransaction.totalAmountInvested
      : 0;
    const totalAmountInvested = previousTotal + Number(amount);

    const transaction = await Transaction.create({
      user: userId,
      holding: holdingId,
      amount: Number(amount),
      totalAmountInvested,
      totalPortfolioSize: Number(totalPortfolioSize),
      dateTime: dateTime ? new Date(dateTime) : new Date(),
    });

    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    console.error("Create transaction error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
