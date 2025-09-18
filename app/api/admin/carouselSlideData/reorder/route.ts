import dbConnect, { disconnect } from "@/app/lib/mongodb";
import { auth } from "@/auth";

import { NextResponse } from "next/server";

import CarouselSlide from "@/models/CarouselSlide";

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

    const { newOrder } = await req.json();

    // Mettre à jour l'ordre de toutes les slides
    const bulkOps = newOrder.map((id: string, index: number) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { order: index } },
      },
    }));

    await CarouselSlide.bulkWrite(bulkOps);

    await disconnect();
    return NextResponse.json(
      {
        message: "Ordre mis à jour avec succès",
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
        status: 500,
      }
    );
  }
};

export { handler as POST };
