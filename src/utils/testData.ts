export const testData = {
  validUser: {
    username: process.env.SAUCEDEMO_USERNAME ?? process.env.USERNAME,
    password: process.env.SAUCEDEMO_PASSWORD ?? process.env.PASSWORD,
  },
  invalidUser: {
    username: `invalid_user_${Date.now()}`,
    password: `invalid_pass_${Date.now()}`,
  },
  customer: {
    firstName: `Customer_${Date.now()}`,
    lastName: `QA_${Date.now()}`,
    postalCode: String(Math.floor(100000 + Math.random() * 900000)),
  },
  checkoutExpected: {
    paymentInfoContains: 'SauceCard #31337',
    shippingInfoContains: 'Free Pony Express Delivery!',
    itemTotalContains: 'Item total:',
    totalContains: 'Total:',
    confirmationMessage: 'Thank you for your order!',
  },
};
