import { Params } from "@/app/api/orders/[id]/route";
import dbConnect, { disconnect } from "@/app/lib/mongodb";
import { auth } from "@/auth";
import OrderTrue from "@/models/OrderTrue";
import ProductTrue from "@/models/ProductTrue";
import Sale from "@/models/Sales";
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
    const sale = await Sale.findById(id);

    if (!sale) {
      await disconnect();
      return NextResponse.json(
        {
          message: "Sale not found",
        },
        {
          status: 404,
        }
      );
    }

    await ProductTrue.findByIdAndUpdate(sale.product, {
      $inc: { sold: -sale.quantity },
    });

    await Sale.findByIdAndDelete(id);

    await disconnect();
    return NextResponse.json(
      {
        message: "Sale deleted successfully",
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

const getHandler = async (req: Request, id: string) => {
  try {
    await dbConnect();

    console.log({ id });

    const sale = await Sale.findById(id);
    await disconnect();

    if (!sale) {
      return NextResponse.json(
        {
          message: "Sale not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        sale,
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
  try {
    await dbConnect();

    const body = await req.json();
    const sale = await Sale.findById(id);
    if (!sale) {
      await disconnect();
      return NextResponse.json(
        {
          message: "Sale not found",
        },
        {
          status: 404,
        }
      );
    }

    // Handle quantity changes
    if (body.quantity && body.quantity !== sale.quantity) {
      const quantityDiff = body.quantity - sale.quantity;

      // Update product sold count
      await ProductTrue.findByIdAndUpdate(sale.product, {
        $inc: { sold: quantityDiff },
      });
    }

    // Recalculate amount if quantity or product changes
    if (body.quantity || body.product) {
      const productId = body.product || sale.product;
      const product = await ProductTrue.findById(productId);

      if (!product) {
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

      body.amount =
        (body.quantity || sale.quantity) *
        product.price *
        (1 - product.discount / 100);
    }

    const updatedSale = await Sale.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    })
      .populate("product")
      .populate({
        path: "order",
        select: "status customerInfo",
      });

    await disconnect();
    return NextResponse.json(
      {
        sale: updatedSale,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(error);
    await disconnect();
    return NextResponse.json(
      {
        message: "Server error",
      },
      {
        status: 400,
      }
    );
  }
};

export { handler as GET, handler as PUT, handler as DELETE };
