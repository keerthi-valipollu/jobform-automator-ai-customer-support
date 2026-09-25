import OpenAI from "openai";

export async function askAI(userMessage: string) {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      instructions:
        "You are a helpful e-commerce customer support agent. Be polite, clear, and concise. Never approve or deny a refund yourself. The refund policy result provided by the application is the final decision.",
      input: userMessage,
    });

    return response.output_text;
  } catch (error) {
    console.log("OpenAI unavailable, using fallback response.");

    return "Thank you for contacting customer support. I have received your refund request and checked the available order information. The refund decision shown below is based on our refund policy.";
  }
}