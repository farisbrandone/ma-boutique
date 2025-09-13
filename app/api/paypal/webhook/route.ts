/* // pages/api/paypal/webhook.ts
import { NextApiRequest, NextApiResponse } from "next";
import { MongoClient } from "mongodb";
import { verifyWebhook } from "@/app/lib/paypal-security";
import { getRawBody } from "@/app/lib/raw-body";
import { handleSubscriptionActivated } from "@/app/lib/subscription-handler";
import { handlePaymentCompleted } from "@/app/lib/payment-handler";

export const config = { api: { bodyParser: false } };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
 
  const rawBody = await getRawBody(req);
  const event = JSON.parse(rawBody.toString());

  
  const verification = await verifyWebhook(req, rawBody);
  if (!verification) return res.status(401).end();


  const mongoClient = await MongoClient.connect(process.env.MONGODB_URI!);
  const existingEvent = await mongoClient
    .db()
    .collection("paypal_events")
    .findOne({ id: event.id });

  if (existingEvent) return res.status(200).end(); 

  
  try {
    await processWebhookEvent(event);

   
    await mongoClient.db().collection("paypal_events").insertOne({
      id: event.id,
      event_type: event.event_type,
      processed_at: new Date(),
      resource: event.resource,
    });

    res.status(200).end();
  } catch (error: any) {
    
    await mongoClient.db().collection("failed_webhooks").insertOne({
      event,
      error: error.message,
      attempted_at: new Date(),
    });
    res.status(500).end();
  }
}

async function processWebhookEvent(event: any) {
  switch (event.event_type) {
    case "PAYMENT.CAPTURE.COMPLETED":
      await handlePaymentCompleted(event.resource);
      break;
    case "BILLING.SUBSCRIPTION.ACTIVATED":
      await handleSubscriptionActivated(event.resource);
      break;
   
  }
}
 */
