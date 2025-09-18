import dbConnect, { disconnect } from "@/app/lib/mongodb";

import { NextResponse } from "next/server";

import CarouselSlide from "@/models/CarouselSlide";

const handler = async (req: Request) => {
  /*  const session = await auth();
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

  if (req.method === "GET") {
    try {
      console.log("sousou1");
      await dbConnect();
      const slides = await CarouselSlide.find().sort({ order: 1 });
      console.log("sousou2");
      //const products = await Product.find({});
      await disconnect();
      return NextResponse.json(
        {
          slides,
        },
        {
          status: 200,
        }
      );
    } catch (error) {
      console.log(error);
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
    const imageUrl = bodyData.get("imageUrl");
    const altText = bodyData.get("altText");
    console.log({
      imageUrl,
      altText,
    });
    const slide = new CarouselSlide({
      imageUrl,
      altText,
    });

    const newSlide = await slide.save();

    await disconnect();
    return NextResponse.json(
      {
        message: "Slide image created succssfully",
        slide: newSlide,
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
        message: "Problem to post data",
      },
      {
        status: 404,
      }
    );
  }
};

export { handler as GET, handler as POST };
