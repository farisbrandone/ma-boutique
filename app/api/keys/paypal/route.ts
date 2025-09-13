import { auth } from "@/auth";
import { useSession } from "next-auth/react";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  const session = await auth();
  if (!session) {
    return NextResponse.json(
      {
        message: "Signin required",
      },
      {
        status: 401,
      }
    );
  }

  return NextResponse.json(
    {
      paypalClientId: process.env.PAYPAL_CLIENTID || "sb",
    },
    {
      status: 200,
    }
  );
};
