"use client";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useState } from "react";

interface PayPalButtonProps {
  amount: string;
  currency: string;
  orderId: string;
  onSuccess: () => void;
  onError: (error: string) => void;
}

export default function PayPalButton({ amount, currency, orderId, onSuccess, onError }: PayPalButtonProps) {
  const [processing, setProcessing] = useState(false);

  // Extract numeric amount from string (e.g., "10 USD" -> 10)
  const numericAmount = parseFloat(amount.replace(/[^\d.]/g, ""));

  const createOrder = async () => {
    setProcessing(true);
    try {
      const response = await fetch("/api/paypal/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: numericAmount,
          currency: currency,
          orderId: orderId,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to create PayPal order");
      }
      return data.orderId;
    } catch (error) {
      onError(error instanceof Error ? error.message : "Failed to create order");
      setProcessing(false);
      throw error;
    }
  };

  const onApprove = async (data: any) => {
    try {
      const response = await fetch("/api/paypal/capture-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: data.orderID,
          dbOrderId: orderId,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Payment failed");
      }

      onSuccess();
    } catch (error) {
      onError(error instanceof Error ? error.message : "Payment processing failed");
    } finally {
      setProcessing(false);
    }
  };

  const onErrorPayPal = (err: any) => {
    onError(err.message || "An error occurred with PayPal");
    setProcessing(false);
  };

  // Use sandbox client ID for development, replace with production ID in production
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "test";

  return (
    <PayPalScriptProvider
      options={{
        clientId: clientId,
        currency: currency,
        intent: "capture",
      }}
    >
      <div className="w-full">
        {processing && (
          <div className="mb-4 p-3 bg-yellow-900/50 border border-yellow-700 rounded text-yellow-200 text-sm text-center">
            جاري معالجة الدفع...
          </div>
        )}
        <PayPalButtons
          createOrder={createOrder}
          onApprove={onApprove}
          onError={onErrorPayPal}
          style={{
            layout: "vertical",
            color: "gold",
            shape: "rect",
            label: "paypal",
          }}
        />
      </div>
    </PayPalScriptProvider>
  );
}
