# SauceDemo Automation Project

This project automates the end-to-end purchase flow on SauceDemo using Playwright with the Page Object Model (POM) structure.

## Objective

The goal is to validate the full order flow for a customer who buys the highest-priced and lowest-priced items from the product catalog and verifies the total, checkout confirmation, and proof-of-purchase details.

## What This Project Covers

- Login to the application
- Read product prices dynamically from the inventory page
- Identify the highest and lowest priced products automatically
- Add both products to the cart
- Validate that the cart total matches the sum of the selected prices
- Complete the checkout process
- Confirm successful order placement
- Validate the receipt details (product names and total amount)

## Tech Stack

- Playwright
- TypeScript
- Page Object Model (POM)
- Structured logging
- HTML test reporting

## Project Structure

- `src/pages/` — page objects for login, products, cart, and checkout
- `src/base/` — shared base page logic
- `src/utils/` — logger and test data utilities
- `tests/` — automated test scripts
- `playwright.config.ts` — Playwright configuration

## Prerequisites

- Node.js 18+
- npm
- Internet access to open the SauceDemo website

## Setup

1. Install dependencies:

    ```bash
    npm install
    ```

2. Create a `.env` file in the project root with valid SauceDemo credentials:

    ```env
    SAUCEDEMO_USERNAME=standard_user
    SAUCEDEMO_PASSWORD=secret_sauce
    ```

## Run Tests

Run the full suite:

```bash
npm test
```

Run the checkout flow specifically:

```bash
npx playwright test tests/checkout.spec.ts
```

Open the Playwright report:

```bash
npm run report
```

## Validation Criteria Automated

The test includes real assertions for:

- Cart total equals the sum of the highest and lowest priced products
- Order completion is confirmed after checkout
- Product names and bill amount are validated in the receipt/proof-of-purchase output

## Assumption

SauceDemo does not provide a real PDF file in the standard checkout flow, so the proof-of-purchase validation is implemented using a receipt-style verification artifact to confirm the expected product names and total amount as part of the business requirement.

## Result

This project is ready to demonstrate the complete shopping and checkout flow with dynamic product selection and validation logic.
