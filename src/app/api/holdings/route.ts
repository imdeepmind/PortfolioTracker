import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import Holding from "@/models/Holding";

// GET all holdings for the current user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const holdings = await Holding.find({
      user: (session.user as { id: string }).id,
    }).sort({ createdAt: -1 });

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

    const { name, description } = await req.json();

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
