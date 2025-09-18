import dbConnect, { disconnect } from "@/app/lib/mongodb";
import { auth } from "@/auth";

import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";

import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  if (false) {
    console.log(req);
  }
  const session = await auth();
  if (!session || (session && !session.user.isAdmin)) {
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

  const ordersCount = await Order.countDocuments();
  const productsCount = await Product.countDocuments();
  const usersCount = await User.countDocuments();

  const ordersPriceGroup = await Order.aggregate([
    {
      $group: {
        _id: null,
        sales: { $sum: "$totalPrice" },
      },
    },
  ]);

  const ordersPrice =
    ordersPriceGroup.length > 0 ? ordersPriceGroup[0].sales : 0;

  const salesDate = await Order.aggregate([
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m",
            date: "$createdAt",
          },
        },
        totalSales: { $sum: "$totalPrice" },
      },
    },
  ]);

  await disconnect();

  return NextResponse.json(
    {
      ordersPrice,
      ordersCount,
      productsCount,
      usersCount,
      salesDate,
    },
    {
      status: 200,
    }
  );
};
