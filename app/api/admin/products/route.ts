import dbConnect, { disconnect } from "@/app/lib/mongodb";
import { auth } from "@/auth";
import Product from "@/models/Product";
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
    await dbConnect();

    const products = await Product.find({});
    await disconnect();
    return NextResponse.json(
      {
        products,
      },
      {
        status: 200,
      }
    );
  }
  if (req.method === "POST") {
    return postHandler();
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

const postHandler = async () => {
  await dbConnect();
  const newProduct = new Product({
    name: "sample name",
    slug: "sample-name-" + Math.random(),
    image: "/image/default-image.jpg",
    price: 0,
    category: "sample category",
    brand: "sample brand",
    countInStock: 0,
    description: "sample description",
    rating: 0,
    ratings: [0, 0, 0, 0, 0],
    totalRatings: 0,
    numReviews: 0,
    reviews: [],
    isFeatured: false,
    banner: "",
  });

  console.log("post called....");
  console.log(newProduct);

  const product = await newProduct.save();
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
};

export { handler as GET, handler as POST };
