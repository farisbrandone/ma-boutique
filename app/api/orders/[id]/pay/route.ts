import dbConnect, { disconnect } from "@/app/lib/mongodb";

import Order from "@/models/Order";

import { NextResponse } from "next/server";
import { Params } from "../route";
import { auth } from "@/auth";

export const GET = async (req: Request, { params }: Params) => {
  const session = await auth();
  const { id } = params;

  const body = await req.json();

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

  const order = await Order.findById(id);
  if (order) {
    if (order.isPaid) {
      return NextResponse.json(
        {
          message: "Error: order is already paid",
        },
        {
          status: 400,
        }
      );
    }
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: body.id,
      status: body.status,
      email_address: body.email_address,
    };

    const paidOrder = await order.save();
    await disconnect();

    return NextResponse.json(
      {
        message: "Order paid successfully",
        order: paidOrder,
      },
      {
        status: 200,
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
