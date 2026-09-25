import { NextResponse } from "next/server";
import { checkRefundEligibility } from "@/lib/refundTools";
import { askAI } from "@/lib/aiAgent";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const orderId = body.orderId;
    const userMessage = body.message || "";

    if (!orderId) {
      return NextResponse.json(
        {
          success: false,
          message: "Order ID is required.",
        },
        { status: 400 }
      );
    }

    const result = checkRefundEligibility(orderId);
    const aiResponse = await askAI(userMessage);

    return NextResponse.json({
      success: true,
      ...result,
      aiResponse,
    });
  } catch  (error){
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",

      },
      { status: 500 }
    );
  }
}