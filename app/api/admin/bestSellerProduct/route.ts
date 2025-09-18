import dbConnect, { disconnect } from "@/app/lib/mongodb";

import ProductTrue from "@/models/ProductTrue";
import { NextResponse } from "next/server";
const handler = async (req: Request) => {
  /*  const session = await auth();
 
  if (!session) {
    return NextResponse.json(
      {
        message: "Admin signin required",
      },
      {
        status: 401,
      }
    );
  } */
  if (req.method === "GET") {
    try {
      await dbConnect();
      const bestSellers = await ProductTrue.find()
        .sort({ sold: -1 }) // Trier par quantité vendue décroissante
        .limit(10); // Limiter à 10 résultats

      await disconnect();
      return NextResponse.json(
        {
          bestSellers,
        },
        {
          status: 200,
        }
      );
    } catch (error) {
      console.log(error);
      return NextResponse.json(
        {
          message: "Problem to get discount data",
        },
        {
          status: 404,
        }
      );
    }
  } else {
    return NextResponse.json(
      {
        message: "Method not allowed",
      },
      {
        status: 405,
      }
    );
  }
};

export { handler as GET };
