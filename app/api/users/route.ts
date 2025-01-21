import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const user = await prisma.user.create({
      data: {
        ...body,
        name: body.name,
        email: body.email,
        password: body.password,
        role: body.role || "USER",
        walletBalance: 5,
      },
    });
    return NextResponse.json(user);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
