import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized - No valid session found",
        },
        { status: 401 }
      );
    }

    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid JSON format",
          error: parseError,
        },
        { status: 400 }
      );
    }

    const { gameId, gameTitle, betAmount, multiplier } = body;
    if (!gameId || !gameTitle || !betAmount) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields",
          receivedData: { gameId, gameTitle, betAmount, multiplier },
        },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    // Check if the user has enough balance
    if (user.walletBalance < betAmount) {
      return NextResponse.json(
        {
          success: false,
          message: "Insufficient balance",
        },
        { status: 400 }
      );
    }

    // Deduct the bet amount from the user's wallet balance
    await prisma.user.update({
      where: { id: user.id },
      data: { walletBalance: user.walletBalance - betAmount },
    });

    // Create bet associated with found user
    const bet = await prisma.bet.create({
      data: {
        userId: user.id,
        gameId: String(gameId),
        gameTitle: String(gameTitle),
        betAmount: Number(betAmount),
        multiplier: multiplier ? Number(multiplier) : 1, // Default multiplier to 1 if not provided
        status: "PENDING",
      },
    });

    // Create a transaction for the bet placement
    // await prisma.transaction.create({
    //   data: {
    //     userId: user.id,
    //     type: "BET_PLACED",
    //     amount: betAmount,
    //     status: "COMPLETED",
    //   },
    // });

    return NextResponse.json({
      success: true,
      bet,
      newBalance: user.walletBalance,
    });
  } catch (error) {
    console.error("Detailed error information:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Server error occurred",
        errorType: error instanceof Error ? error.name : "Unknown",
        details: process.env.NODE_ENV === "development" ? error : undefined,
      },
      { status: 500 }
    );
  }
}
