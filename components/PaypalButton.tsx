// components/PayPalButton.tsx
"use client";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

export default function PayPalButton({ amount }: { amount: number }) {
  return (
    <PayPalScriptProvider
      options={{
        clientId: process.env.PAYPAL_CLIENTID || "",
        currency: "USD",
      }}
    >
      <PayPalButtons
        style={{ layout: "vertical" }}
        createOrder={async () => {
          const response = await fetch("/api/paypal/create-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount }),
          });
          const { orderID } = await response.json();
          return orderID;
        }}
        onApprove={async (data) => {
          const response = await fetch("/api/paypal/capture-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderID: data.orderID }),
          });
          const details = await response.json();
          alert(`Transaction completed by ${details.payer.name.given_name}`);
        }}
      />
    </PayPalScriptProvider>
  );
}
