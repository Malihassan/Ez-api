const shortid = require("shortid");
const Razorpay = require("razorpay");

// creates new order by initializing the amount 

router.post("/razorpay", async (req, res) => {
  const payment_capture = 1;
  const amount = parseInt(req.body.amount);
  const currency = "INR";

  const razorpay = new Razorpay({
    key_id: config.razorpay.key_id,
    key_secret: config.razorpay.key_secret,
  });

  const options = {
    amount: amount * 100,
    currency,
    receipt: shortid.generate(),
    payment_capture,
  };

  try {
    const response = await razorpay.orders.create(options);
    console.log(response);
    res.json({
      id: response.id,
      currency: response.currency,
      amount: response.amount,
    });
  } catch (error) {
    console.log(error);
  }
});
