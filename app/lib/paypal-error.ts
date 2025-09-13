// lib/paypal-errors.ts
export class PayPalError extends Error {
  constructor(
    public readonly code: string,
    public readonly details: Record<string, unknown> = {},
    public readonly originalError?: unknown
  ) {
    super(`PayPal Error ${code}`);
  }
}

export function handlePayPalError(error: unknown) {
  if (error instanceof PayPalError) {
    console.error(`PayPal Error ${error.code}:`, error.details);

    // Specific error handling
    switch (error.code) {
      case "ORDER_ALREADY_CAPTURED":
        return { recoverable: false, userMessage: "Payment already processed" };
      case "INSTRUMENT_DECLINED":
        return { recoverable: true, userMessage: "Payment method declined" };
    }
  }

  // Fallback for unhandled errors
  return { recoverable: false, userMessage: "Payment processing failed" };
}
