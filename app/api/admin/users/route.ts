import dbConnect, { disconnect } from "@/app/lib/mongodb";
import { auth } from "@/auth";
import User from "@/models/User";
import { NextResponse } from "next/server";

const handler = async (req: Request) => {
  const session = await auth();
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
  await dbConnect();

  const users = await User.find({});
  await disconnect();
  return NextResponse.json(
    {
      users,
    },
    {
      status: 200,
    }
  );
};

export { handler as GET };
