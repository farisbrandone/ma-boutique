import dbConnect, { disconnect } from "@/app/lib/mongodb";
import { auth } from "@/auth";
import ProductTrue from "@/models/ProductTrue";
import { NextResponse } from "next/server";
const handler = async (req: Request) => {
  /* const session = await auth();
  if (!session ) {
    return NextResponse.json(
      {
        message: "Admin signin required",
      },
      {
        status: 401,
      }
    );
  } */
  console.log("pipi");
  if (req.method === "GET") {
    try {
      await dbConnect();
      const parsedUrl = new URL(req.url);
      const params = parsedUrl.searchParams;
      const { displaySolde, displayHome, newProduct, exploreProduct } =
        Object.fromEntries(params.entries());

      console.log({ displaySolde, displayHome, newProduct, exploreProduct });
      const query: any = {};

      if (Boolean(displaySolde)) query.displaySolde = Boolean(displaySolde);
      if (Boolean(displayHome)) query.displayHome = Boolean(displayHome);
      if (Boolean(newProduct)) query.newProduct = Boolean(newProduct);
      if (Boolean(exploreProduct))
        query.exploreProduct = Boolean(exploreProduct);

      const productsDisplay = await ProductTrue.find(query).limit(10);

      await disconnect();
      return NextResponse.json(
        {
          productsDisplay,
        },
        {
          status: 200,
        }
      );
    } catch (error) {
      console.log(error);
      return NextResponse.json(
        {
          message: "Problem to get discount data",
        },
        {
          status: 404,
        }
      );
    }
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

export { handler as GET };
