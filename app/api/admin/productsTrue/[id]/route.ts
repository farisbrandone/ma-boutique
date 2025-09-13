import { Params } from "@/app/api/orders/[id]/route";
import dbConnect, { disconnect } from "@/app/lib/mongodb";
import { auth } from "@/auth";
import ProductTrue from "@/models/ProductTrue";
import { NextResponse } from "next/server";

const handler = async (req: Request, { params }: Params) => {
  const session = await auth();
  const { id } = params;
  console.log({ id });
  /* if (!session ) {
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
    return getHandler(req, id);
  } else if (req.method === "PUT") {
    return putHandler(req, id);
  } else if (req.method === "PATCH") {
    return patchHandler(req, id);
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
  try {
    await dbConnect();
    await ProductTrue.findByIdAndDelete(id);

    await disconnect();
    return NextResponse.json(
      {
        message: "Product deleted successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
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
  try {
    await dbConnect();

    console.log({ id });

    const product = await ProductTrue.findById(id);
    await disconnect();

    if (!product) {
      return NextResponse.json(
        {
          message: "Product not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        product,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    await disconnect();
    return NextResponse.json(
      {
        message: "Server error",
      },
      {
        status: 500,
      }
    );
  }
};

const putHandler = async (req: Request, id: string) => {
  await dbConnect();
  const bodyData = await req.formData();

  const name = bodyData.get("name");
  const description = bodyData.get("description");
  const category = bodyData.get("category");
  const price = bodyData.get("price") as string;
  const stock = bodyData.get("stock") as string;
  const displayHome = bodyData.get("displayHome");
  const displaySolde = bodyData.get("displaySolde");
  const newProduct = bodyData.get("newProduct");
  const exploreProduct = bodyData.get("exploreProduct");
  const discount = bodyData.get("discount") as string;
  const imageUrl = bodyData.get("imageUrl");

  const product = await ProductTrue.findById(id);
  if (product) {
    product.name = name;
    product.description = description;
    product.category = category;
    product.price = parseFloat(price);
    product.stock = parseInt(stock);
    product.displayHome = displayHome === "true";
    product.displaySolde = displaySolde === "true";
    product.newProduct = newProduct === "true";
    product.exploreProduct = exploreProduct === "true";
    product.discount = parseInt(discount) || 0;
    product.imageUrl = imageUrl || "";
    await product.save();
    await disconnect();
    return NextResponse.json(
      {
        message: "Product updated successfully",
        product,
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

const patchHandler = async (req: Request, id: string) => {
  try {
    await dbConnect();
    const update = await req.json();

    const product = await ProductTrue.findByIdAndUpdate(id, update, {
      new: true,
    });
    if (product) {
      await disconnect();
      return NextResponse.json(
        {
          message: "Product updated successfully",
          product,
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
  } catch (error) {
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

export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as DELETE,
  handler as PATCH,
};
