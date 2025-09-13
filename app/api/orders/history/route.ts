import dbConnect, { disconnect } from "@/app/lib/mongodb";
import { auth } from "@/auth";
import Order from "@/models/Order";
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

  await dbConnect();

  const orders = await Order.find({
    user: session?.user._id,
  });
  await disconnect();
  return NextResponse.json(
    {
      orders,
    },
    {
      status: 200,
    }
  );
};
