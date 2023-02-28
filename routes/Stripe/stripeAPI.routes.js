const router = require("express").Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const Plan = mongoose.model("Plan");
const SubscriptionPurchase = mongoose.model("SubscriptionPurchase");
const CompanyDetail = mongoose.model("CompanyDetail");
const LogicalFormFrequency = mongoose.model("LogicalFormFrequency");

const STRIPE_API = require("../../controller/stripeFunctions");
const response = require("../../helper/response");
let passHelper = require("../../helper/otp");
var nodemailer = require("nodemailer");
let encryptToken = require("../../helper/token");
let ERRORS = require("../../helper/message");
const log = require("../../helper/logger");
const mailer = require("../../routes/sendmail/notify");
const cors = require("cors");
const commonController = require("../../controller/commonController");
// var stripe = require("stripe")(process.env.STRIPE_API_KEY);
const stripe = require("stripe")(process.env.STRIPE_API_KEY);
const STRIPE_WEBHOOK_KEY = require("stripe")(process.env.STRIPE_WEBHOOK_KEY);


// Create Product
router.post("/createProduct", async (req, res) => {
  try {
    log.debug("/stripe/createProduct", result);
    const result = await STRIPE_API.createProduct(req.body);
    response.successResponse(res, 200, result);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, "unable to create product");
  }
});
// Create a PaymentIntent
router.post("/createPaymentIntent", async (req, res) => {
  const { items } = req.body;

  try {
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 2000,
      currency: "aed",
      automatic_payment_methods: {
        enabled: true,
      },
    });
    console.log(paymentIntent.client_secret);
    response.successResponse(res, 200, {
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.log(error.message);
  }
});

// Get Product
router.get("/getProduct", async (req, res) => {
  try {
    // log.debug("/stripe/getProduct", result);
    const result = await STRIPE_API.getProduct();
    response.successResponse(res, 200, result);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, "unable to get product");
  }
});

// Create Plan
router.post("/createPlan", async (req, res) => {
  try {
    const result = await STRIPE_API.createPlan(req.body);
    console.log("===========>>>>>>>>>>", result);
    response.successResponse(res, 200, result);
  } catch (error) {
    console.log("===================>>>>>>>>>>>", error);
    response.errorMsgResponse(res, 500, "unable to create plan");
  }
});

// Get Plans
router.get("/getPlans", async (req, res) => {
  try {
    const result = await STRIPE_API.getPlans();
    console.log("===========>>>>>>>>>>", result);
    response.successResponse(res, 200, result);
  } catch (error) {
    response.errorMsgResponse(res, 500, "unable to get product");
  }
});

// Get all plans and products
router.get("/productsAndPlans", async (req, res) => {
  try {
    const result = await STRIPE_API.getAllProductsAndPlans().then(
      (products) => {
        products = products.filter((product) => {
          return product.plans.length > 0;
        });
        console.log("===========>>>>>>>>>>", products);
        response.successResponse(res, 200, products);
      }
    );
  } catch (error) {
    response.errorMsgResponse(res, 500, "unable to get product");
  }
});
/*this code will be integrated in the place where plans will be shown. 
  That means by clicking on the signup button it will redirect the user
  to payment page with the selected plan. */
router.post("/signUp", async (req, res) => {
  try {
    // need to get Price ID
    const { stripeProductPriceID } = await commonController.getOne(Plan, {
      name: req.body.companyPlan,
    });
    const resultOfSubscription = await STRIPE_API.createCustomerAndSubscription(
      req.body,
      stripeProductPriceID
    );
    response.successResponse(res, 200, resultOfSubscription);
  } catch (error) {
    console.log(error.message);
    response.errorMsgResponse(res, 500, "unable to Process");
  }
});

router.post('/webhook', (req, res) => {
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, STRIPE_WEBHOOK_KEY);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      // Then define and call a method to handle the successful payment intent.
      // handlePaymentIntentSucceeded(paymentIntent);
      // add Administrator account 
      break;
    case 'payment_method.attached':
      const paymentMethod = event.data.object;
      // Then define and call a method to handle the successful attachment of a PaymentMethod.
      // handlePaymentMethodAttached(paymentMethod);
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a response to acknowledge receipt of the event
  res.json({received: true});
});

router.post("/processPayment", (req, res) => {
  var product = {
    name: req.body.productName,
  };

  var plan = {
    id: req.body.planId,
    name: req.body.planName,
    amount: req.body.planAmount,
    interval: req.body.planInterval,
    interval_count: req.body.planIntervalCount,
  };

  STRIPE_API.createCustomerAndSubscription(req.body)
    .then(() => {
      res.render("signup.html", {
        product: product,
        plan: plan,
        success: true,
      });
    })
    .catch((err) => {
      res.render("signup.html", { product: product, plan: plan, error: true });
    });
});

// ======================================================================

router.post("/charge", async (req, res) => {
  try {
    const { id, amount, email } = req.body;
    // let email = emails;
    const pass = passHelper.generatePassword();

    const userData = {
      designation: "ClientAdmin",
      email: email,
      mobileNumber: req.body.phone,
      password: pass,
    };

    const resultUser = await User.findOne({ email: email });
    log.debug(resultUser);
    if (resultUser) {
      response.errorMsgResponse(res, 301, ERRORS.USER_ALREADY_REGISTERED);
    } else {
      const payment = await stripe.paymentIntents.create({
        amount: amount,
        currency: "AUD",
        description: "Your Company desctiption",
        // payment_method: id,
        confirm: true,
        payment_method_data: {
          type: "card",
          card: {
            token: id,
          },
        },
      });

      if (payment) {
        const subject = "WHS Subscription Purchased";

        const body = `Hii 
        ${email}, you have successfully purchased the subscription of 
        our management for ${req.body.employeePurchased} users and your 
        subscription type is ${req.body.subscriptionType}.

        Your dummy password is ${pass}

        Please reset your password using this dummy password. Redirection link is below:

        http://54.201.160.69:3152/#/resetPassword/${Buffer.from(email).toString(
          "base64"
        )}

                            Save time, do it online`;

        let emailSend = mailer.sendMail(email, subject, body);

        let user = new User(userData);
        const userResult = await user.save();

        console.log(
          `http://54.201.160.69:3152/#/resetPassword/${Buffer.from(
            email
          ).toString("base64")}`
        );

        const data = {
          companyName: req.body.companyName,
          email: email,
          phone: req.body.phone,
          companyABN: req.body.companyABN,
          streetAddress: req.body.streetAddress,
          suburb: req.body.suburb,
          website: req.body.website,
          amount: req.body.amount,
          employeePurchased: req.body.employeePurchased,
          subscriptionType: req.body.subscriptionType,
          stripeToken: req.body.id,
          userId: user._id,
          couponId: req.body.couponId,
        };

        const FormFrequencyData = [
          {
            formName: "Hazards Reported",
            frequency: "daily",
            enable: true,
            clientAdminId: user._id,
          },
          {
            formName: "Accident Report",
            frequency: "daily",
            enable: true,
            clientAdminId: user._id,
          },
          {
            formName: "Toolbox Talk",
            frequency: "daily",
            enable: true,
            clientAdminId: user._id,
          },
          {
            formName: "Site Inspection",
            frequency: "daily",
            enable: true,
            clientAdminId: user._id,
          },
          {
            formName: "Risk Assessment and SWMS",
            frequency: "daily",
            enable: true,
            clientAdminId: user._id,
          },
        ];

        const resultData = new SubscriptionPurchase(data);
        const result = await resultData.save();

        const companyResult = new CompanyDetail(data);
        const companyResultData = await companyResult.save();

        const responseObj = await LogicalFormFrequency.insertMany(
          FormFrequencyData
        );
      } else {
        response.errorMsgResponse(res, 200, "unable to verify Email");
      }
      response.successResponse(res, 200, "Payment Successful");
    }
  } catch (error) {
    console.log("error", error);
    response.errorMsgResponse(res, 500, "Payment Failed");
  }
});

module.exports = router;
