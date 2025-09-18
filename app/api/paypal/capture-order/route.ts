// pages/api/paypal/capture-order.ts
import { NextResponse } from "next/server";
import { client, paypal /* , environment */ } from "../../../lib/paypal";

export default async function handler(req: Request) {
  if (req.method !== "POST") {
    return NextResponse.json({
      status: 405,
    });
  }

  const { orderID } = await req.json();
  const request = new paypal.orders.OrdersCaptureRequest(orderID);
  // request.requestBody({});

  try {
    const response = await client.execute(request);
    return NextResponse.json(
      {
        ...response.result,
      },
      {
        status: 200,
      }
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        error: err.message,
      },
      {
        status: 500,
      }
    );
  }
}
