/* 
import { client, environment ,paypal} from "@/app/lib/paypal";
import { handlePayPalError } from "@/app/lib/paypal-error";

import type { NextApiRequest, NextApiResponse } from "next";
export default async function handler( req: NextApiRequest,
    res: NextApiResponse) {
  const planId = 'P-123456789'; 
  const request = new paypal.billing.SubscriptionsCreateRequest();
  request.requestBody({
    plan_id: planId,
    start_time: new Date(Date.now() + 86400000).toISOString(), 
    subscriber: {
      name: { given_name: 'John', surname: 'Doe' },
      email_address: 'customer@example.com'
    },
    application_context: {
      return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/subscribe/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/subscribe/cancel`
    }
  });

  try {
    const response = await client.execute(request);
    res.json({ approvalUrl: response.result.links.find(l => l.rel === 'approve').href });
  } catch (error) {
    handlePayPalError(error);
    res.status(500).end();
  }
} */
