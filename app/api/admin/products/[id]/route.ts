import { Params } from "@/app/api/orders/[id]/route";
import dbConnect, { disconnect } from "@/app/lib/mongodb";
import { auth } from "@/auth";

import Product from "@/models/Product";

import { NextResponse } from "next/server";

const handler = async (req: Request, { params }: Params) => {
  const session = await auth();
  const { id } = params;
  console.log({ id });
  if (!session /* || (session && !session.user.isAdmin) */) {
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
    return getHandler(req, id);
  } else if (req.method === "PUT") {
    return putHandler(req, id);
  } else if (req.method === "DELETE") {
    return deleteHandler(req, id);
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

const deleteHandler = async (req: Request, id: string) => {
  await dbConnect();

  const product = await Product.findById(id);
  if (product) {
    await product.remove();
    await disconnect();
    return NextResponse.json(
      {
        message: "Product deleted successfully",
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

const getHandler = async (req: Request, id: string) => {
  await dbConnect();
  const url = new URL(req.url);

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

const putHandler = async (req: Request, id: string) => {
  await dbConnect();
  const body = await req.json();
  console.log({ zonzon: id });

  const product = await Product.findById(id);
  if (product) {
    product.name = body.name;
    product.slug = body.slug;
    product.price = body.price;
    product.category = body.category;
    product.image = body.image;
    product.brand = body.brand;
    product.countInStock = body.countInStock;
    product.description = body.description;
    await product.save();
    await disconnect();
    return NextResponse.json(
      {
        message: "Product updated successfully",
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

export { handler as GET, handler as POST, handler as PUT, handler as DELETE };
