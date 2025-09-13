import { Params } from "@/app/api/orders/[id]/route";
import dbConnect, { disconnect } from "@/app/lib/mongodb";
import { auth } from "@/auth";
import OrderTrue from "@/models/OrderTrue";
import ProductTrue from "@/models/ProductTrue";
import { NextResponse } from "next/server";

const handler = async (req: Request, { params }: Params) => {
  const session = await auth();
  const { id } = params;

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
  if (req.method === "PATCH") {
    return patchHandler(req, id);
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

const patchHandler = async (req: Request, id: string) => {
  try {
    await dbConnect();
    const order = await OrderTrue.findById(id).populate("product");

    if (!order) {
      await disconnect();
      return NextResponse.json(
        {
          message: "Commande non trouvée",
        },
        {
          status: 404,
        }
      );
    }

    if (order.status !== "pending") {
      await disconnect();
      return NextResponse.json(
        {
          message: "La commande a déjà été traitée",
        },
        {
          status: 400,
        }
      );
    }

    if (order.product.stock < order.quantity) {
      await disconnect();
      return NextResponse.json(
        {
          message: "Stock insuffisant",
        },
        {
          status: 400,
        }
      );
    }

    // Mettre à jour le produit
    await ProductTrue.findByIdAndUpdate(order.product._id, {
      $inc: {
        stock: -order.quantity,
        sold: order.quantity,
      },
    });

    // Mettre à jour la commande
    order.status = "validated";
    await order.save();

    await disconnect();
    return NextResponse.json(
      {
        message: "Order and Product updated successfully",
        order,
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

export { handler as PATCH };
