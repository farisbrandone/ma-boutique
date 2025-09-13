import bcryptjs from "bcryptjs";
import User from "@/models/User";
//import { auth } from "@/auth";
import dbConnect, { disconnect } from "@/app/lib/mongodb";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

const handler = async (req: Request) => {
  if (req.method != "PUT") {
    return NextResponse.json(
      {
        message: `${req.method} not supported`,
      },
      {
        status: 400,
      }
    );
  }

  const session = await auth();
  if (!session) {
    return NextResponse.json(
      {
        message: "Signin required",
      },
      {
        status: 401,
      }
    );
  }

  const { name, email, password } = await req.json();

  if (
    !name ||
    !email ||
    !email.includes("@") ||
    !password ||
    password.trim().length < 5
  ) {
    return NextResponse.json(
      {
        message: "Validation error",
      },
      {
        status: 422,
      }
    );
  }

  await dbConnect();

  const toUpdateUser = await User.findById(session?.user._id);

  if (toUpdateUser) {
    toUpdateUser.name = name;
    toUpdateUser.email = email;
    if (password) {
      toUpdateUser.password = bcryptjs.hashSync(password);
    }

    await toUpdateUser.save();

    await disconnect();

    return NextResponse.json(
      {
        message: "User updated",
      },
      {
        status: 200,
      }
    );
  }
};

export { handler as GET };
