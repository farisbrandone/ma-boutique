import dbConnect, { disconnect } from "@/app/lib/mongodb";
import { auth } from "@/auth";
import Order from "@/models/Order";
import { NextResponse } from "next/server";

export interface Params {
  params: {
    id: string;
  };
}

export const GET = async (req: Request, { params }: Params) => {
  const session = await auth();
  const { id } = params;
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
  await disconnect();
  return NextResponse.json(
    {
      order,
    },
    {
      status: 200,
    }
  );
};
