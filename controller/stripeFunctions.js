require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_API_KEY);
const UTILS = require("../helper/stripeFormatNumbers");
const commonController = require("./commonController");

module.exports = {
  getAllProductsAndPlans() {
    return Promise.all([stripe.products.list({}), stripe.plans.list({})]).then(
      (stripeData) => {
        var products = stripeData[0].data;
        var plans = stripeData[1].data;

        plans = plans
          .sort((a, b) => {
            return a.amount - b.amount;
          })
          .map((plan) => {
            // Format plan price(amount)
            amount = UTILS.formatUSD(plan.amount);
            return { ...plan, amount };
          });

        products.forEach((product) => {
          const filteredPlans = plans.filter((plan) => {
            return plan.product === product.id;
          });

          product.plans = filteredPlans;
        });

        return products;
      }
    );
  },

  createProduct(requestBody) {
    return stripe.products.create({
      name: requestBody.productName,
      type: "service",
    });
  },

  getProduct(requestBody) {
    return Promise.all([stripe.products.list({})]).then((stripeData) => {
      var products = stripeData[0].data;
      return products;
    });
  },

  createPlan(requestBody) {
    return stripe.plans.create({
      nickname: requestBody.planName,
      // amount: UTILS.formatStripeAmount(requestBody.planAmount),
      interval: requestBody.planInterval,
      interval_count: parseInt(requestBody.planIntervalNumber),
      product: requestBody.productId,
      currency: "AUD",
      billing_scheme: "tiered",
      tiers_mode: "graduated",
      tiers: [
        {
          unit_amount: UTILS.formatStripeAmount(requestBody.planAmount),
          up_to: "3",
        },
        {
          unit_amount: UTILS.formatStripeAmount(requestBody.planAmount),
          up_to: "inf",
        },
      ],
      // expand: ["tiers"],
    });
  },

  getPlans(requestBody) {
    return Promise.all([stripe.plans.list({})]).then((stripeData) => {
      var plans = stripeData[0].data;
      return plans;
    });
  },

  async createCustomerAndSubscription(requestBody,priceID) {
    const {
      accountType,
      teamSize,
      companyName,
      companyIndustry,
      companyDepartment,
      companyEmail,
      companyPhone,
      companyFax,
      companyDescription,
      personName,
      personEmail,
      personPhone,
      companyPlan,
    } = requestBody;
 
    const customer = await stripe.customers.create({
      name: companyName,
      email: companyEmail,
      phone: companyPhone,
      metadata: {
        accountType,
        teamSize,
        companyIndustry,
        companyDepartment,
        companyFax,
        companyDescription,
        personName,
        personEmail,
        personPhone,
        companyPlan,
      },
    });
   
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{
        price: priceID,
      }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
    });

    return  {
      subscriptionId: subscription.id,
      clientSecret: subscription.latest_invoice.payment_intent.client_secret,
    }
    
  },
};
