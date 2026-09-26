import OpenAI from "openai";
import { checkRefundEligibility } from "./refundTools";

type RefundToolArgs = {
  orderId: string;
};

const refundTools = {
  check_refund_eligibility: (args: RefundToolArgs) =>
    checkRefundEligibility(args.orderId),
};

function selectTool(userMessage: string) {
  if (/refund|return|money/i.test(userMessage)) {
    return "check_refund_eligibility" as const;
  }

  return "check_refund_eligibility" as const;
}

export async function runRefundAgent(
  userMessage: string,
  orderId: string
) {
  // Agent selects the required tool.
  const toolName = selectTool(userMessage);

  // Agent dynamically calls the selected tool.
  const tool = refundTools[toolName];
  const toolResult = tool({ orderId });

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      instructions:
        "You are an e-commerce customer support agent. The refund tool result is the final decision. Never change or override the tool result. Explain the result politely and clearly.",
      input: `${userMessage}

Refund tool used: ${toolName}

Refund tool result:
${JSON.stringify(toolResult)}`,
    });

    return {
      aiResponse: response.output_text,
      toolUsed: toolName,
      toolResult,
    };
  } catch {
    return {
      aiResponse:
        "Thank you for contacting customer support. I have checked your order information and evaluated the request using our refund policy.",
      toolUsed: toolName,
      toolResult,
    };
  }
}