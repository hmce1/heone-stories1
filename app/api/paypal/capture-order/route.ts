import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { orderId, dbOrderId } = await request.json();

    if (!orderId || !dbOrderId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
    const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
    const PAYPAL_API_URL = process.env.PAYPAL_API_URL || "https://api-m.sandbox.paypal.com";

    // If PayPal credentials are not set, simulate successful payment for development
    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      // Update order in database
      await prisma.order.update({
        where: { id: dbOrderId },
        data: {
          status: "PROCESSING",
          paymentMethod: "paypal",
        },
      });

      return NextResponse.json({ success: true, orderId: dbOrderId });
    }

    // Capture PayPal order
    const response = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders/${orderId}/capture`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString("base64")}`,
      },
    });

    const data = await response.json();

    if (!response.ok || data.status !== "COMPLETED") {
      return NextResponse.json(
        { error: data.message || "Payment capture failed" },
        { status: response.status }
      );
    }

    // Update order in database
    await prisma.order.update({
      where: { id: dbOrderId },
      data: {
        status: "PROCESSING",
        paymentMethod: "paypal",
      },
    });

    return NextResponse.json({ success: true, orderId: dbOrderId });
  } catch (error) {
    console.error("Error capturing PayPal order:", error);
    return NextResponse.json(
      { error: "Failed to capture payment" },
      { status: 500 }
    );
  }
}
