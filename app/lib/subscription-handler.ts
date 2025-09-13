// lib/paypal/subscription-handler.ts
import { MongoClient } from "mongodb";

export async function handleSubscriptionActivated(subscriptionResource: any) {
  const client = await MongoClient.connect(process.env.MONGODB_URI!);

  try {
    // 1. Check for existing subscription
    const existingSub = await client
      .db()
      .collection("subscriptions")
      .findOne({ subscription_id: subscriptionResource.id });

    if (existingSub) {
      console.warn(`Subscription ${subscriptionResource.id} already exists`);
      return;
    }

    // 2. Create new subscription record
    await client
      .db()
      .collection("subscriptions")
      .insertOne({
        subscription_id: subscriptionResource.id,
        status: "active",
        plan_id: subscriptionResource.plan_id,
        subscriber: {
          email: subscriptionResource.subscriber.email_address,
          name: subscriptionResource.subscriber.name?.given_name,
        },
        start_date: new Date(subscriptionResource.start_time),
        created_at: new Date(),
        updated_at: new Date(),
      });

    // 3. Grant access to subscriber
    await grantSubscriptionAccess(
      subscriptionResource.subscriber.email_address
    );
  } finally {
    await client.close();
  }
}

async function grantSubscriptionAccess(email: string) {
  // Implement your access granting logic here
  console.log(`Granting access to ${email}`);
}
