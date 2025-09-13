// lib/paypal/payment-handler.ts
import { MongoClient } from "mongodb";

export async function handlePaymentCompleted(paymentResource: any) {
  const client = await MongoClient.connect(process.env.MONGODB_URI!);

  try {
    // 1. Verify payment exists and isn't processed
    const existingPayment = await client
      .db()
      .collection("payments")
      .findOne({ payment_id: paymentResource.id });

    if (existingPayment) {
      console.warn(`Payment ${paymentResource.id} already processed`);
      return;
    }

    // 2. Update database
    await client.db().collection("payments").insertOne({
      payment_id: paymentResource.id,
      amount: paymentResource.amount.value,
      currency: paymentResource.amount.currency_code,
      status: "completed",
      payer_email: paymentResource.payer.email_address,
      created_at: new Date(),
      updated_at: new Date(),
    });

    // 3. Trigger fulfillment workflow
    await sendOrderConfirmation(paymentResource);
  } finally {
    await client.close();
  }
}

async function sendOrderConfirmation(payment: any) {
  // Implement your email/SMS notification logic here
  console.log(`Sending confirmation for payment ${payment.id}`);
}
