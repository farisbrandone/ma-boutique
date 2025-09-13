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
      const { status, orderId, productId } = Object.fromEntries(
        params.entries()
      );
      const query: any = {};
      if (status) query.status = status;
      if (orderId) query._id = orderId;
      if (productId) query.product = productId;

      const orders = await OrderTrue.find(query)
        .populate("product")
        .sort({ createdAt: -1 });

      //const products = await Product.find({});
      await disconnect();
      return NextResponse.json(
        {
          orders,
        },
        {
          status: 200,
        }
      );
    } catch (error) {
      await disconnect();
      return NextResponse.json(
        {
          message: "Sever error and Problem to post data",
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

    const { productId, quantity, customerInfo } = await req.json();
    const product = await ProductTrue.findById(productId);

    if (!product) {
      await disconnect();
      return NextResponse.json(
        {
          message: "Produit non trouvé",
        },
        {
          status: 404,
        }
      );
    }

    if (product.stock < quantity) {
      await disconnect();
      return NextResponse.json(
        {
          message: "Stock insuffisant",
        },
        {
          status: 404,
        }
      );
    }

    const totalAmount = product.price * quantity;

    const order = new OrderTrue({
      product: productId,
      quantity,
      totalAmount,
      customerInfo,
      status: "pending",
    });

    await order.save();
    await disconnect();
    return NextResponse.json(
      {
        order,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    await disconnect();
    return NextResponse.json(
      {
        message: "Problem to post order",
      },
      {
        status: 500,
      }
    );
  }
};

export { handler as GET, handler as POST };
