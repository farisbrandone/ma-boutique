import { Params } from "@/app/api/orders/[id]/route";
import dbConnect, { disconnect } from "@/app/lib/mongodb";
import { auth } from "@/auth";
import CarouselSlide from "@/models/CarouselSlide";
import ProductTrue from "@/models/ProductTrue";
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
    const slide = await CarouselSlide.findById(id);
    if (!slide) {
      await disconnect();
      return NextResponse.json(
        {
          message: "Slide not found",
        },
        {
          status: 404,
        }
      );
    }
    await CarouselSlide.findByIdAndDelete(id);
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
        status: 500,
      }
    );
  }
};

const getHandler = async (req: Request, id: string) => {
  try {
    await dbConnect();

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

  const altText = bodyData.get("altText");
  const order = bodyData.get("order");
  const isActive = bodyData.get("isActive");
  const imageUrl = bodyData.get("imageUrl");
  let update = { altText, order, isActive, imageUrl };

  const slide = await CarouselSlide.findById(id);
  if (slide) {
    const updatedSlide = await CarouselSlide.findByIdAndUpdate(id, update, {
      new: true,
    });
    await disconnect();
    return NextResponse.json(
      {
        message: "Product updated successfully",
        updatedSlide,
      },
      {
        status: 200,
      }
    );
  } else {
    await disconnect();
    return NextResponse.json(
      {
        message: "Slide image not found",
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
