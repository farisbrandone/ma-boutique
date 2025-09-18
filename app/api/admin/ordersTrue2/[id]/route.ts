import { Params } from "@/app/api/orders/[id]/route";
import dbConnect, { disconnect } from "@/app/lib/mongodb";

import OrderTrue from "@/models/OrderTrue";
import ProductTrue from "@/models/ProductTrue";
import { NextResponse } from "next/server";

const handler = async (req: Request, { params }: Params) => {
  /* const session = await auth(); */
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
    const order = await OrderTrue.findById(id);

    if (!order) {
      await disconnect();
      return NextResponse.json(
        {
          message: "Order not found",
        },
        {
          status: 404,
        }
      );
    }

    if (order.status === "validated") {
      await updateProductInventory(
        order.product,
        order.quantity,
        -order.quantity
      );
    }

    await OrderTrue.findByIdAndDelete(id);

    await disconnect();
    return NextResponse.json(
      {
        message: "Order deleted successfully",
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
        status: 500,
      }
    );
  }
};

const getHandler = async (req: Request, id: string) => {
  try {
    await dbConnect();

    console.log({ id });

    const order = await OrderTrue.findById(id);
    await disconnect();

    if (!order) {
      return NextResponse.json(
        {
          message: "Order not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        order,
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
        status: 500,
      }
    );
  }
};

const putHandler = async (req: Request, id: string) => {
  try {
    await dbConnect();

    const body = await req.json();
    const order = await OrderTrue.findById(id);
    if (!order) {
      await disconnect();
      return NextResponse.json(
        {
          message: "Order not found",
        },
        {
          status: 404,
        }
      );
    }

    // Handle status changes
    const newStatus = body.status;
    const oldStatus = order.status;

    if (newStatus && newStatus !== oldStatus) {
      // Cancelling an order - restock products
      if (newStatus === "cancelled" && oldStatus !== "cancelled") {
        await updateProductInventory(
          order.product,
          order.quantity,
          -order.quantity
        );
      }

      // Re-validating a cancelled order
      if (newStatus === "validated" && oldStatus === "cancelled") {
        // Check if product still has sufficient stock
        const product = await ProductTrue.findById(order.product);
        if (product.stock < order.quantity) {
          await disconnect();
          return NextResponse.json(
            {
              message: "Insufficient stock to revalidate order",
            },
            {
              status: 400,
            }
          );
        }

        await updateProductInventory(
          order.product,
          -order.quantity,
          order.quantity
        );
      }
    }

    const updatedOrder = await OrderTrue.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    }).populate("product");

    await disconnect();
    return NextResponse.json(
      {
        order: updatedOrder,
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

const updateProductInventory = async (
  productId: string,
  quantityChange: number,
  soldChange: number
) => {
  try {
    await ProductTrue.findByIdAndUpdate(productId, {
      $inc: {
        stock: quantityChange,
        sold: soldChange,
      },
    });
  } catch (error) {
    console.error("Error updating product inventory:", error);
  }
};
