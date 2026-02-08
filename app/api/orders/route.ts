import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      fullName,
      whatsappNumber,
      country,
      city,
      proposedNovelTitle,
      whyWriteNovel,
      voiceMessagePreferred,
      packageName,
      price,
    } = body;

    // Validate required fields
    if (!fullName || !whatsappNumber || !country || !city || !packageName || !price) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Determine currency based on country
    const isMorocco = country === "المغرب";
    const currency = isMorocco ? "MAD" : "USD";

    // Create order
    const order = await prisma.order.create({
      data: {
        fullName,
        whatsappNumber,
        country,
        city,
        proposedNovelTitle: proposedNovelTitle || null,
        whyWriteNovel: whyWriteNovel || null,
        voiceMessagePreferred: voiceMessagePreferred === "yes" || voiceMessagePreferred === true,
        packageName,
        price,
        currency,
        status: "PENDING",
      },
    });

    return NextResponse.json(
      { success: true, orderId: order.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const skip = (page - 1) * limit;

    const where = status ? { status: status as any } : {};

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
