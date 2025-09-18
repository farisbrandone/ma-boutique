import { auth } from "@/auth";

import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  if (false) {
    console.log(req);
  }
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
