// types/paypal.d.ts
declare namespace PayPal {
  interface PaymentCaptureResource {
    id: string;
    amount: {
      value: string;
      currency_code: string;
    };
    payer: {
      email_address: string;
      name?: {
        given_name: string;
        surname: string;
      };
    };
  }

  interface SubscriptionResource {
    id: string;
    plan_id: string;
    start_time: string;
    subscriber: {
      email_address: string;
      name?: {
        given_name: string;
        surname: string;
      };
    };
  }
}
