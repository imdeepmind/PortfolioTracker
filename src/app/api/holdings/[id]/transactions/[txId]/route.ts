import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import Transaction from "@/models/Transaction";
import Holding from "@/models/Holding";

// GET single transaction
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; txId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: holdingId, txId } = await params;
    const userId = (session.user as { id: string }).id;

    await dbConnect();

    const holding = await Holding.findOne({ _id: holdingId, user: userId });
    if (!holding) {
      return NextResponse.json({ error: "Holding not found" }, { status: 404 });
    }

    const transaction = await Transaction.findOne({
      _id: txId,
      holding: holdingId,
      user: userId,
    });

    if (!transaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(transaction);
  } catch (error) {
    console.error("Get transaction error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT update transaction
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; txId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: holdingId, txId } = await params;
    const userId = (session.user as { id: string }).id;
    const { amount, totalPortfolioSize, dateTime } = await req.json();

    await dbConnect();

    const holding = await Holding.findOne({ _id: holdingId, user: userId });
    if (!holding) {
      return NextResponse.json({ error: "Holding not found" }, { status: 404 });
    }

    const currentTx = await Transaction.findOne({
      _id: txId,
      holding: holdingId,
      user: userId,
    });

    if (!currentTx) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    const newDateTime = dateTime ? new Date(dateTime) : currentTx.dateTime;

    // Find the transaction right before this one to recalculate totalAmountInvested
    const prevTransaction = await Transaction.findOne({
      holding: holdingId,
      user: userId,
      dateTime: { $lt: newDateTime },
      _id: { $ne: txId },
    }).sort({ dateTime: -1 });

    const previousTotal = prevTransaction
      ? prevTransaction.totalAmountInvested
      : 0;
    const newAmount = amount !== undefined ? Number(amount) : currentTx.amount;
    const totalAmountInvested = previousTotal + newAmount;

    const transaction = await Transaction.findOneAndUpdate(
      { _id: txId, holding: holdingId, user: userId },
      {
        amount: newAmount,
        totalAmountInvested,
        totalPortfolioSize:
          totalPortfolioSize !== undefined
            ? Number(totalPortfolioSize)
            : currentTx.totalPortfolioSize,
        dateTime: newDateTime,
      },
      { new: true }
    );

    return NextResponse.json(transaction);
  } catch (error) {
    console.error("Update transaction error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE transaction
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; txId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: holdingId, txId } = await params;
    const userId = (session.user as { id: string }).id;

    await dbConnect();

    const transaction = await Transaction.findOneAndDelete({
      _id: txId,
      holding: holdingId,
      user: userId,
    });

    if (!transaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error("Delete transaction error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
