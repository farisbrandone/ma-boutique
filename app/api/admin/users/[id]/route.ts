import { Params } from "@/app/api/orders/[id]/route";
import dbConnect, { disconnect } from "@/app/lib/mongodb";
import { auth } from "@/auth";

import User from "@/models/User";
import { NextResponse } from "next/server";

const handler = async (req: Request, { params }: Params) => {
  const session = await auth();
  const { id } = params;
  if (!session || (session && !session.user.isAdmin)) {
    return NextResponse.json(
      {
        message: "Admin signin required",
      },
      {
        status: 401,
      }
    );
  }
  if (req.method === "DELETE") {
    return deleteHandler(req, id);
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

const deleteHandler = async (req: Request, id: string) => {
  await dbConnect();
  const user = await User.findByIdAndDelete(id);
  if (user) {
    await disconnect();
    return NextResponse.json(
      {
        message: "User deleted successfully",
      },
      {
        status: 200,
      }
    );
  } else {
    await disconnect();
    return NextResponse.json(
      {
        message: "User Not Found",
      },
      {
        status: 404,
      }
    );
  }
};

export { handler as GET, handler as POST, handler as PUT, handler as DELETE };
