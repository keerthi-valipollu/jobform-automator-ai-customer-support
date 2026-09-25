export const refundPolicy = {
  returnWindowDays: 7,

  eligibleReasons: [
    "Product not working",
    "Defective product",
    "Damaged on arrival",
    "Wrong size",
    "Wrong product",
    "Screen damaged",
    "Not working",
    "Color is different",
  ],

  rules: [
    "A refund request must be made within 7 days of delivery.",
    "The order must exist in the CRM database.",
    "The product must be eligible for return.",
    "The customer must provide a valid refund reason.",
    "Requests made after 7 days must be denied.",
    "A refund must never be approved when the order cannot be found.",
    "Changed-my-mind requests are not eligible for a refund.",
    "The AI agent must check the policy before approving a refund.",
  ],
};