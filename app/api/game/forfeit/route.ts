import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json();

    const { betId } = body;
    if (!betId) {
      return NextResponse.json({ error: "betId is required" }, { status: 400 });
    }

    // Find the active bet for the user
    const bet = await prisma.bet.findFirst({
      where: { userId: user.id, status: "PENDING", id: betId },
      orderBy: { createdAt: "desc" },
    });

    if (!bet) {
      return NextResponse.json(
        { success: false, message: "No pending bet found" },
        { status: 404 }
      );
    }

    // Update bet status to LOST
    await prisma.bet.update({
      where: { id: bet.id },
      data: { status: "LOST" },
    });

    return NextResponse.json(
      { success: true, message: "Bet forfeited" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing bet forfeiture:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error instanceof Error ? error.message : error,
      },
      { status: 500 }
    );
  }
}
