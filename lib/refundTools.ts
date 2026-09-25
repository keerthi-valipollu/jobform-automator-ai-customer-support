import { customers } from "./mockData";
import { refundPolicy } from "./refundPolicy";

export function checkRefundEligibility(orderId: string) {
  const customer = customers.find(
    (customer) => customer.orderId.toLowerCase() === orderId.toLowerCase()
  );

  if (!customer) {
    return {
      eligible: false,
      reason: "Order not found in the CRM database.",
    };
  }

  const deliveryDate = new Date(customer.deliveryDate);
  const requestDate = new Date(customer.returnRequestedDate);

  const differenceInTime =
    requestDate.getTime() - deliveryDate.getTime();

  const daysAfterDelivery = Math.floor(
    differenceInTime / (1000 * 60 * 60 * 24)
  );

  if (daysAfterDelivery > refundPolicy.returnWindowDays) {
    return {
      eligible: false,
      reason: `Refund request was made ${daysAfterDelivery} days after delivery. The policy allows only ${refundPolicy.returnWindowDays} days.`,
      customer,
    };
  }

  if (customer.refundReason === "Changed my mind") {
    return {
      eligible: false,
      reason: "Changed-my-mind requests are not eligible for a refund.",
      customer,
    };
  }

  if (!refundPolicy.eligibleReasons.includes(customer.refundReason)) {
    return {
      eligible: false,
      reason: "The refund reason is not covered by the refund policy.",
      customer,
    };
  }

  return {
    eligible: true,
    reason: "Refund request satisfies the current refund policy.",
    customer,
  };
}