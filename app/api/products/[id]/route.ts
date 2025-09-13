import dbConnect, { disconnect } from "@/app/lib/mongodb";
import Product from "@/models/Product";

import { Params } from "../../orders/[id]/route";
import { NextResponse } from "next/server";

const handler = async (req: Request, { params }: Params) => {
  const { id } = params;
  if (req.method === "GET") {
    return getHandler(req, id);
  } else if (req.method === "PUT") {
    return putHandler(req, id);
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

const getHandler = async (req: Request, id: string) => {
  await dbConnect();

  const product = await Product.findById(id);
  await disconnect();
  return NextResponse.json(
    {
      product,
    },
    {
      status: 200,
    }
  );
};

function calculateRatings(
  star5: number,
  star4: number,
  star3: number,
  star2: number,
  star1: number
) {
  return (
    (5 * star5 + 4 * star4 + 3 * star3 + 2 * star2 + 1 * star1) /
    (star5 + star4 + star3 + star2 + star1)
  );
}

const putHandler = async (req: Request, id: string) => {
  await dbConnect();
  const body = await req.json();
  console.log("put called....");
  const product = await Product.findById(id);
  console.log("product is:-", product);
  if (product) {
    const star5 = product.ratings[0];
    const star4 = product.ratings[1];
    const star3 = product.ratings[2];
    const star2 = product.ratings[3];
    const star1 = product.ratings[4];

    if (body.rating === 5) {
      product.ratings[0] = star5 + 1;
    } else if (body.rating === 4) {
      product.ratings[1] = star4 + 1;
    } else if (body.rating === 3) {
      product.ratings[2] = star3 + 1;
    } else if (body.rating === 2) {
      product.ratings[3] = star2 + 1;
    } else {
      product.ratings[4] = star1 + 1;
    }

    product.totalRatings = product.totalRatings + 1;

    product.rating = calculateRatings(
      product.ratings[0],
      product.ratings[1],
      product.ratings[2],
      product.ratings[3],
      product.ratings[4]
    );

    console.log("final product", product);
    await product.save();
    await disconnect();
    return NextResponse.json(
      {
        message: "Ratings updated successfully",
      },
      {
        status: 200,
      }
    );
  } else {
    await disconnect();
    return NextResponse.json(
      {
        message: "Product not found",
      },
      {
        status: 404,
      }
    );
  }
};

export { handler as GET, handler as PUT, handler as POST };
