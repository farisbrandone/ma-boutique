import dbConnect, { disconnect } from "@/app/lib/mongodb";
import { auth } from "@/auth";
import OrderTrue from "@/models/OrderTrue";
import ProductTrue from "@/models/ProductTrue";
import Sale from "@/models/Sales";
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
        productId,
        dateFrom,
        dateTo,
        minAmount,
        maxAmount,
      } = Object.fromEntries(params.entries());

      const sortOrders = sortOrder === "asc" ? 1 : -1;
      const skip = (Number(page) - 1) * Number(limit);
      const sort = { [sortBy]: sortOrders };

      const filter: any = {};

      if (productId) filter.product = productId;
      if (dateFrom && dateTo) {
        filter.date = {
          $gte: new Date(dateFrom),
          $lte: new Date(dateTo),
        };
      }

      if (minAmount) filter.amount = { $gte: parseFloat(minAmount) };
      if (maxAmount)
        filter.amount = { ...filter.amount, $lte: parseFloat(maxAmount) };

      // Query with pagination
      const [sales, total] = await Promise.all([
        Sale.find(filter)
          .populate("ProductTrue")
          .populate({
            path: "OrderTrue",
            select: "status customerInfo",
          })
          .sort(sort as any)
          .skip(Number(skip))
          .limit(Number(limit)),
        Sale.countDocuments(filter),
      ]);

      const totalPages = Math.ceil(total / Number(limit));

      await disconnect();
      return NextResponse.json(
        {
          data: sales,
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
    const order = await OrderTrue.findById(body.orderId);

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

    const product = await ProductTrue.findById(body.product);

    if (!product) {
      await disconnect();
      return NextResponse.json(
        {
          message: "Product not found",
        },
        {
          status: 400,
        }
      );
    }

    const saleData = {
      ...body,
      amount: body.quantity * product.price * (1 - product.discount / 100),
    };

    const newSale = new Sale(saleData);
    const savedSale = await newSale.save();
    await updateProductInventory(body.product, -body.quantity, body.quantity);

    // Update product's sold count
    await ProductTrue.findByIdAndUpdate(body.product, {
      $inc: { sold: body.quantity },
    });

    const populatedSale = await Sale.findById(savedSale._id)
      .populate("product")
      .populate({
        path: "order",
        select: "status customerInfo",
      });

    await disconnect();
    return NextResponse.json(
      {
        message: "Order created succssfully",
        sale: populatedSale,
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
        status: 400,
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
