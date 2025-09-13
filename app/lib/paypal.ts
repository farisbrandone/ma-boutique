// lib/paypal.ts
import * as paypals from "@paypal/checkout-server-sdk";

interface typeConfigurePaypal {
  client: paypals.core.PayPalHttpClient;
  paypal: typeof paypals;
  environment: paypals.core.LiveEnvironment | paypals.core.SandboxEnvironment;
}

function configurePayPal(): typeConfigurePaypal {
  const clientId = process.env.PAYPAL_CLIENT_ID!;
  const clientSecret = process.env.PAYPAL_SECRET!;

  const environment =
    process.env.NODE_ENV === "production"
      ? new paypals.core.LiveEnvironment(clientId, clientSecret)
      : new paypals.core.SandboxEnvironment(clientId, clientSecret);

  const client = new paypals.core.PayPalHttpClient(environment);

  return {
    client,
    paypal: paypals, // Export the entire SDK namespace
    environment,
  };
}

export const { client, paypal, environment } = configurePayPal();
