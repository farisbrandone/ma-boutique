import dbConnect, { disconnect } from "@/app/lib/mongodb";
import User from "@/models/User";
import bcryptjs from "bcryptjs";
import { NextResponse } from "next/server";
export const POST = async (req: Request) => {
  if (req.method !== "POST") {
    return;
  }

  const { name, email, password } = await req.json();
  console.log({ name, email, password });
  if (
    !name ||
    !email ||
    !email.includes("@") ||
    !password ||
    password.trim().length < 5
  ) {
    return NextResponse.json(
      {
        message: `Validation error`,
      },
      {
        status: 422,
      }
    );
  }

  await dbConnect();

  const existingUser = await User.findOne({ email: email });

  if (existingUser) {
    await disconnect();
    return NextResponse.json(
      {
        message: `User exists already`,
      },
      {
        status: 422,
      }
    );
  }

  const newUser = new User({
    name,
    email,
    password: bcryptjs.hashSync(password),
    isAdmin: false,
  });

  const user = await newUser.save();

  await disconnect();

  return NextResponse.json(
    {
      message: "Created user",
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    {
      status: 201, // Custom status code
    }
  );
};
