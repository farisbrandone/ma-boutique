import * as toto from "cloudinary";
import { NextResponse } from "next/server";
const cloudinary = toto.v2;
export function GET() {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp: timestamp,
    },

    process.env.CLOUDINARY_SECRET as string
  );
  return NextResponse.json(
    {
      signature,
      timestamp,
    },
    {
      status: 200,
    }
  );
}
