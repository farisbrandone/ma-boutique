import dbConnect, { disconnect } from "@/app/lib/mongodb";

import Order from "@/models/Order";

import { NextResponse } from "next/server";
import { auth } from "@/auth";

export const POST = async (req: Request) => {
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

  await dbConnect();
  const body = await req.json();
  const newOrder = new Order({
    ...body,
    isPaid: false,
    paidAt: Date.now(),
    paymentResult: {
      id: "",
      status: "",
      email_address: "",
    },
    user: session?.user._id,
  });
  const order = await newOrder.save();
  await disconnect();
  return NextResponse.json(
    {
      order,
    },
    {
      status: 201,
    }
  );
};
