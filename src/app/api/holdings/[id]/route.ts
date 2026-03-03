import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import Holding from "@/models/Holding";

// GET single holding
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await dbConnect();

    const holding = await Holding.findOne({
      _id: id,
      user: (session.user as { id: string }).id,
    });

    if (!holding) {
      return NextResponse.json(
        { error: "Holding not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(holding);
  } catch (error) {
    console.error("Get holding error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT update holding
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { name, description, risk } = await req.json();

    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Holding name is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const holding = await Holding.findOneAndUpdate(
      { _id: id, user: (session.user as { id: string }).id },
      {
        name: name.trim(),
        description: description?.trim() || "",
        ...(risk && { risk }),
      },
      { new: true }
    );

    if (!holding) {
      return NextResponse.json(
        { error: "Holding not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(holding);
  } catch (error) {
    console.error("Update holding error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE holding
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await dbConnect();

    const holding = await Holding.findOneAndDelete({
      _id: id,
      user: (session.user as { id: string }).id,
    });

    if (!holding) {
      return NextResponse.json(
        { error: "Holding not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Holding deleted successfully" });
  } catch (error) {
    console.error("Delete holding error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
