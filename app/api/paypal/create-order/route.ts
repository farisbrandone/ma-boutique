// pages/api/paypal/create-order.ts
import { NextResponse } from "next/server";
import { client, paypal } from "../../../lib/paypal";

export default async function handler(req: Request) {
  const body = await req.json();
  if (req.method !== "POST") {
    return NextResponse.json({
      status: 405,
    });
  }

  const request = new paypal.orders.OrdersCreateRequest();
  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: body.amount.toString(),
        },
      },
    ],
  });

  try {
    const response = await client.execute(request);
    return NextResponse.json(
      {
        orderID: response.result.id,
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
