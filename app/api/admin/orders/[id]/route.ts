import dbConnect, { disconnect } from "@/app/lib/mongodb";
import Order from "@/models/Order";
import { NextResponse } from "next/server";
import { Params } from "@/app/api/orders/[id]/route";
import { auth } from "@/auth";
export const GET = async (req: Request, { params }: Params) => {
  const session = await auth();
  const { id } = params;
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

  await dbConnect();

  const order = await Order.findById(id);
  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    const devliveredOrder = await order.save();
    await disconnect();

    return NextResponse.json(
      {
        message: "Order delivered successfully",
        order: devliveredOrder,
      },
      {
        status: 200, // Custom status code
      }
    );
  } else {
    await disconnect();
    return NextResponse.json(
      {
        message: "Error: order not found",
      },
      {
        status: 404,
      }
    );
  }
};
