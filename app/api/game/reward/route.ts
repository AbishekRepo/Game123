import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { BetStatus } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized - No valid session found" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { gameStatus } = body;

    if (!gameStatus || !["WON", "LOST"].includes(gameStatus)) {
      return NextResponse.json(
        { success: false, message: "Invalid game status" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Fetch the latest pending bet for the user
    const bet = await prisma.bet.findFirst({
      where: { userId: user.id, status: "PENDING" },
      orderBy: { createdAt: "desc" },
    });

    if (!bet) {
      return NextResponse.json(
        { success: false, message: "No pending bet found" },
        { status: 404 }
      );
    }

    let updatedWalletBalance = user.walletBalance;
    let betStatus = "LOST";
    let betResult = 0;

    if (gameStatus === "WON") {
      updatedWalletBalance += bet.betAmount * 2;
      betStatus = "WON";
      betResult = bet.betAmount * 2;
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { walletBalance: updatedWalletBalance },
      }),
      prisma.bet.update({
        where: { id: bet.id },
        data: { status: betStatus as BetStatus, result: betResult },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: `Bet ${betStatus.toLowerCase()} successfully`,
      newBalance: updatedWalletBalance,
    });
  } catch (error) {
    console.error("Error updating wallet:", error);
    return NextResponse.json(
      { success: false, message: "Server error occurred" },
      { status: 500 }
    );
  }
}
