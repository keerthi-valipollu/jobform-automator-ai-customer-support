# AI Customer Support Agent

## Jobform Automator — Next.js Developer Assignment

A customer support web application for handling e-commerce refund requests using Next.js, mock CRM data, refund policy validation, and an AI response layer.

## Overview

This application allows customers to submit refund requests using their Order ID. The system checks the order against customer CRM data and validates the refund request using a strict refund policy.

The application has two main sections:

* **Customer Support** — Submit refund requests and receive the decision.
* **Admin Dashboard** — View agent activity and processing status.

## Features

* Next.js App Router application
* Customer support chat interface
* Mock CRM database with 15 customer profiles
* Strict 7-day refund policy
* Refund eligibility validation
* Order existence validation
* Refund reason validation
* AI customer response layer
* Fallback response when the AI service is unavailable
* Admin activity and processing status logs
* Handles approved, denied, and unknown-order requests

## Refund Policy

The application follows these rules:

1. Refund requests must be made within 7 days of delivery.
2. The order must exist in the CRM database.
3. The product must be eligible for return.
4. A valid refund reason must be provided.
5. Requests after 7 days are denied.
6. Orders that cannot be found are never approved.
7. Changed-my-mind requests are not eligible.
8. The application checks the refund policy before approving a refund.

## Architecture

```text
Customer
   ↓
Customer Support UI
   ↓
POST /api/refund
   ↓
Refund Agent
   ↓
CRM + Refund Policy Tool
   ↓
Refund Eligibility Decision
   ↓
AI Customer Response
   ↓
Customer + Admin Dashboard
```

## Project Structure

```text
app/
├── api/
│   └── refund/
│       └── route.ts
└── page.tsx

lib/
├── aiAgent.ts
├── mockData.ts
├── refundPolicy.ts
└── refundTools.ts
```

### Main Files

* `app/page.tsx` — Customer chat interface and Admin Dashboard
* `app/api/refund/route.ts` — Refund API endpoint
* `lib/mockData.ts` — Mock CRM customer data
* `lib/refundPolicy.ts` — Refund policy rules
* `lib/refundTools.ts` — Refund eligibility validation
* `lib/aiAgent.ts` — AI response layer

## Example Test Cases

### 1. Valid Ref
