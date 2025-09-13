import dbConnect, { disconnect } from "@/app/lib/mongodb";
import { auth } from "@/auth";
import OrderTrue from "@/models/OrderTrue";
import ProductTrue from "@/models/ProductTrue";
import { NextResponse } from "next/server";
const handler = async (req: Request) => {
  const session = await auth();
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
    try {
      await dbConnect();

      const parsedUrl = new URL(req.url);
      const params = parsedUrl.searchParams;
      const {
        page = "1",
        limit = "10",
        sortBy = "createdAt",
        sortOrder,
        status,
        productId,
        dateFrom,
        dateTo,
      } = Object.fromEntries(params.entries());

      const sortOrders = sortOrder === "asc" ? 1 : -1;
      const skip = (Number(page) - 1) * Number(limit);
      const sort = { [sortBy]: sortOrders };

      // Filtering
      const filter: any = {};
      if (status) filter.status = status;
      if (productId) filter.product = productId;
      if (dateFrom && dateTo) {
        filter.createdAt = {
          $gte: new Date(dateFrom),
          $lte: new Date(dateTo),
        };
      }
      // Query with pagination
      const [orders, total] = await Promise.all([
        OrderTrue.find(filter)
          .populate("product")
          .sort(sort)
          .skip(skip)
          .limit(limit),
        OrderTrue.countDocuments(filter),
      ]);

      const totalPages = Math.ceil(total / Number(limit));

      await disconnect();
      return NextResponse.json(
        {
          data: orders,
          pagination: {
            currentPage: page,
            totalPages,
            totalItems: total,
            itemsPerPage: limit,
          },
        },
        {
          status: 200,
        }
      );
    } catch (error) {
      console.log(error);
      return NextResponse.json(
        {
          message: "server error",
        },
        {
          status: 500,
        }
      );
    }
  }
  if (req.method === "POST") {
    return postHandler(req);
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

const postHandler = async (req: Request) => {
  try {
    await dbConnect();

    const body = await req.json();
    const product = await ProductTrue.findById(body.product._id);

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

    if (product.stock < body.quantity) {
      return NextResponse.json(
        {
          message: "Insufficient stock",
        },
        {
          status: 400,
        }
      );
    }

    const newOrder = new OrderTrue(body);
    const savedOrder = await newOrder.save();

    await updateProductInventory(body.product, -body.quantity, body.quantity);

    const orderSaved = await savedOrder.populate("product");

    await disconnect();
    return NextResponse.json(
      {
        message: "Order created succssfully",
        order: orderSaved,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.log({ error });
    await disconnect();
    return NextResponse.json(
      {
        message: "Problem to post data",
      },
      {
        status: 404,
      }
    );
  }
};

export { handler as GET, handler as POST };

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
