import Order from "@/models/Order";
import { NextResponse } from "next/server";

import dbConnect, { disconnect } from "@/app/lib/mongodb";
import { auth } from "@/auth";
const GET = async (req: Request) => {
  const session = await auth();
  if (!session || (session && !session.user.isAdmin)) {
    return NextResponse.json(
      {
        message: "Admin signin required",
      },
      {
        status: 401,
      }
    );
  }
  if (req.method === "GET") {
    await dbConnect();
    const orders = await Order.find({}).populate("user", "name");
    await disconnect();
    console.log(orders);

    return NextResponse.json(
      {
        orders,
      },
      {
        status: 200, // Custom status code
      }
    );
  } else {
    return NextResponse.json(
      {
        message: "Method not allowed",
      },
      {
        status: 400,
      }
    );
  }
};

export default GET;
