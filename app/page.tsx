"use client";

import { useState } from "react";

type Message = {
  role: "user" | "agent";
  text: string;
};

type Activity = {
  text: string;
};

type AgentStatus = "Ready" | "Processing" | "Completed";

export default function Home() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);
  const [agentStatus, setAgentStatus] = useState<AgentStatus>("Ready");

  async function sendMessage() {
    if (!message.trim() || loading) return;

    const userMessage = message.trim();
    setAgentStatus("Processing");

    setActivities((previous) => [
      ...previous,
      { text: `Customer request received: ${userMessage}` },
    ]);

    setMessages((previous) => [
      ...previous,
      { role: "user", text: userMessage },
    ]);

    setMessage("");
    setLoading(true);

    setActivities((previous) => [
      ...previous,
      { text: "Checking customer order and refund policy..." },
    ]);

    const orderMatch = userMessage.match(/ORD\d+/i);

    if (!orderMatch) {
      setMessages((previous) => [
        ...previous,
        {
          role: "agent",
          text: "Please provide your Order ID, for example ORD1001.",
        },
      ]);

      setLoading(false);
      setAgentStatus("Completed");
      return;
    }

    try {
      const response = await fetch("/api/refund", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: orderMatch[0],
          message: userMessage,
        }),
      });

      const result = await response.json();

      setActivities((previous) => [
        ...previous,
        {
          text: `Agent tool called: ${
            result.toolUsed || "check_refund_eligibility"
          }`,
        },
      ]);

      setActivities((previous) => [
        ...previous,
        {
          text: result.eligible
            ? "Refund policy check passed."
            : `Refund policy check failed: ${
                result.reason ||
                result.message ||
                "Unable to complete policy check."
              }`,
        },
      ]);

      setMessages((previous) => [
        ...previous,
        {
          role: "agent",
          text: result.customer
            ? `${result.aiResponse}\n\n${
                result.eligible
                  ? "✅ Refund approved."
                  : "❌ Refund denied."
              }\n\n${result.reason}\n\nCustomer: ${
                result.customer.name
              }\nOrder: ${result.customer.orderId}\nAmount: ₹${
                result.customer.amount
              }`
            : result.reason ||
              result.message ||
              "Unable to process the refund request.",
        },
      ]);
    } catch {
      setMessages((previous) => [
        ...previous,
        {
          role: "agent",
          text: "Sorry, something went wrong while checking the refund.",
        },
      ]);
    } finally {
      setLoading(false);
      setAgentStatus("Completed");
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold text-gray-900">
          AI Customer Support Agent
        </h1>

        <p className="mt-2 text-gray-600">
          Jobform Automator — Customer Refund Assistant
        </p>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl bg-white p-5 shadow">
            <h2 className="text-xl font-semibold">Customer Support</h2>

            <div className="mt-4 min-h-80 rounded-lg bg-gray-50 p-4">
              {messages.length === 0 && (
                <p className="text-gray-600">
                  Hello! 👋 I&apos;m your AI customer support agent.
                  <br />
                  <br />
                  Please tell me your refund request and Order ID.
                </p>
              )}

              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`mt-3 whitespace-pre-line rounded-lg p-3 ${
                    msg.role === "user"
                      ? "bg-blue-100 text-gray-800"
                      : "bg-green-100 text-gray-800"
                  }`}
                >
                  <strong>
                    {msg.role === "user" ? "You" : "Agent"}:
                  </strong>{" "}
                  {msg.text}
                </div>
              ))}

              {loading && (
                <p className="mt-3 text-gray-500">
                  Checking refund policy...
                </p>
              )}
            </div>

            <div className="mt-4 flex gap-2">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    sendMessage();
                  }
                }}
                placeholder="Example: I want a refund for ORD1001"
                className="flex-1 rounded-lg border px-4 py-3 outline-none"
              />

              <button
                onClick={sendMessage}
                disabled={loading}
                className="rounded-lg bg-black px-5 py-3 text-white disabled:opacity-50"
              >
                {loading ? "Checking..." : "Send"}
              </button>
            </div>
          </div>

          <div className="rounded-xl bg-white p-5 shadow">
            <h2 className="text-xl font-semibold">Admin Dashboard</h2>

            <div className="mt-4 rounded-lg bg-gray-50 p-4">
              <p className="font-medium">Agent Activity</p>

              <p className="mt-1 text-xs text-green-600">
                ● System active
              </p>

              <p className="mt-2 text-sm font-medium">
                Status: {agentStatus}
              </p>

              <div className="mt-3 space-y-2 text-sm text-gray-600">
                {activities.length === 0 ? (
                  <p>Waiting for customer request...</p>
                ) : (
                  activities.map((activity, index) => (
                    <div
                      key={index}
                      className="rounded-md bg-white p-2"
                    >
                      ✓ {activity.text}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
