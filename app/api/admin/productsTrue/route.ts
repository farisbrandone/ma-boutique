import dbConnect, { disconnect } from "@/app/lib/mongodb";
import { auth } from "@/auth";
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
    console.log({ dondon: "dondon" });
    try {
      await dbConnect();
      const parsedUrl = new URL(req.url);
      const params = parsedUrl.searchParams;
      const {
        page = "1",
        pageSize = "10",
        name,
        category,
        sortField,
        sortDirection,
      } = Object.fromEntries(params.entries());
      const query: any = {};
      if (name) query.name = { $regex: name, $options: "i" };
      if (category) query.category = category;

      const sortOptions: any = {};
      if (sortField) {
        sortOptions[sortField] = sortDirection === "desc" ? -1 : 1;
      }

      const total = await ProductTrue.countDocuments(query);
      const productsTrue = await ProductTrue.find(query)
        .sort(sortOptions)
        .limit(parseInt(pageSize))
        .skip((parseInt(page) - 1) * parseInt(pageSize));

      //const products = await Product.find({});
      await disconnect();
      return NextResponse.json(
        {
          productsTrue,
          total,
          page: parseInt(page),
          pageSize: parseInt(pageSize),
          totalPages: Math.ceil(total / parseInt(pageSize)),
        },
        {
          status: 200,
        }
      );
    } catch (error) {
      return NextResponse.json(
        {
          message: "Problem to post data",
        },
        {
          status: 404,
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
    const imageUrl = JSON.parse(bodyData.get("imageUrl") as string);
    console.log({ imageUrl });
    if (imageUrl.length && imageUrl.length === 0) {
      await disconnect();
      return NextResponse.json(
        {
          message: "No image set",
        },
        {
          status: 404,
        }
      );
    }

    const postProduct = new ProductTrue({
      name,
      description,
      category,
      price: parseFloat(price),
      stock: parseInt(stock),
      displayHome: displayHome === "true",
      displaySolde: displaySolde === "true",
      newProduct: newProduct === "true",
      exploreProduct: exploreProduct === "true",
      discount: parseInt(discount) || 0,
      imageUrl: imageUrl || [""],
    });
    console.log("post called....");

    const product = await postProduct.save();
    await disconnect();
    return NextResponse.json(
      {
        message: "Product created succssfully",
        product,
      },
      {
        status: 200,
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
