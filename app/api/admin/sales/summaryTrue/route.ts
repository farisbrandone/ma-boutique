import dbConnect from "@/app/lib/mongodb";
import { auth } from "@/auth";
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
    await dbConnect();

    const parsedUrl = new URL(req.url);
    const params = parsedUrl.searchParams;
    const { startDate, endDate } = Object.fromEntries(params.entries());

    if (!startDate || !endDate) {
      return NextResponse.json(
        {
          message: "Les paramètres startDate et endDate sont requis",
        },
        {
          status: 400,
        }
      );
    }

    // Convertir en dates JavaScript
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // Fin de la journée

    // Pipeline d'agrégation
    const summary = await Sale.aggregate([
      // Filtrer par période
      {
        $match: {
          date: {
            $gte: start,
            $lte: end,
          },
        },
      },
      // Grouper et calculer les totaux
      {
        $group: {
          _id: null,
          totalSold: { $sum: "$quantity" },
          revenue: { $sum: "$amount" },
          averageOrderValue: { $avg: "$amount" },
          totalOrders: { $sum: 1 },
        },
      },
      // Projeter les résultats
      {
        $project: {
          _id: 0,
          totalSold: 1,
          revenue: 1,
          averageOrderValue: { $round: ["$averageOrderValue", 2] },
          totalOrders: 1,
        },
      },
    ]);

    // Si aucune vente dans la période
    const result =
      summary.length > 0
        ? summary[0]
        : { totalSold: 0, revenue: 0, averageOrderValue: 0, totalOrders: 0 };

    return NextResponse.json(
      {
        summary: result,
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

const postHandler = async () => {};

export { handler as GET, handler as POST };
