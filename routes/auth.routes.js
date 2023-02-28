let router = require("express").Router();
let log = require("../helper/logger");
let response = require("../helper/response");
let otpHelper = require("../helper/otp");
let encryptToken = require("../helper/token");
let sms = require("../helper/sms");
let mail = require("./sendmail/notify");
let authController = require("../controller/auth");
const commonController = require("../controller/commonController");
const ERRORS = require("../helper/message");
const _ = require("lodash");
const mongoose = require("mongoose");
const user = mongoose.model("User");
const Role = mongoose.model("Role");
const Access = mongoose.model("Access");
const CompanyDetail = mongoose.model("CompanyDetail");
const SubscriptionPurchase = mongoose.model("SubscriptionPurchase");
const SubContractor = mongoose.model("SubContractor");
var config = require("../config.json");
const auth = require("../helper/auth");
var md5 = require("md5");

////////////incription salt rounds and incription type

var bcrypt = require("bcrypt");
const saltRounds = 10;
/////////////////////////////////////////////////////////

router.post("/register", auth, async (req, res) => {
  try {
    // check if the user is normal user to proceed else terminate
    if (
      req.body.designation !== "ClientAdmin" ||
      req.body.designation !== "SuperAdmin"
    ) {
      // go to commonController and call by subscriptionPurchase schima and userid to get subscription data
      const subscriptionData = await commonController.getBy(
        SubscriptionPurchase,
        { userId: req.userId }
      );

      // go to commonController and call by User schima and userid as client admin id to get user data
      const userData = await commonController.getBy(user, {
        clientAdminId: req.userId,
      });

      // check for the limit of user creation if not reached then register the new user from authController by calling Register function
      if (subscriptionData[0].employeePurchased == userData.length) {
        response.errorMsgResponse(res, 200, ERRORS.USER_CREATION_LIMIT);
      } else {
        const registrationData = await authController.register(req.body);
        response.successResponse(res, 200, registrationData);
      }
    } else {
      response.errorMsgResponse(
        res,
        301,
        ERRORS.CLIENT_ADMIN_CANNOT_BE_REEGISTER
      );
    }
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, ERRORS.SOMETHING_WENT_WRONG);
  }
});

// adding new subscription using authController calling register function
router.post("/subscription", (req, res) => {
  authController
    .register(req.body)
    .then((resData) => {
      response.successResponse(res, 200, resData);
    })
    .catch((error) => {
      response.errorMsgResponse(res, 301, error);
    });
});

/**
 * @swagger
 * /authentication/login:
 *   post:
 *     tags:
 *       - Users
 *     description: user Login from this Api
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: login
 *         description: login
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - email
 *             - password
 *           properties:
 *             email:
 *               type: string
 *             password:
 *               type: string
 *     responses:
 *       200:
 *         description: Returns success message
 *       301:
 *        description: Something went wrong, please try after sometime
 *       505:
 *        description: Enter Correct email and password
 */
// get user data
router.post("/login", async (req, res) => {
  try {
    // console.log("req", req.get("User-Agent"));

    //get authenticationData from authController from login
    const authControllerData = await authController.login(req.body);
    // console.log(authControllerData);
    if (authControllerData) {
      let userValidData = _.pick(authControllerData, [
        "_id",
        "firstName",
        "lastName",
        "mobileNumber",
        "email",
        "role",
        "company",
        "department",
        "avatar",
      ]);

      // get encription token data by calng encrypt method from token form helper functions.
      // prepare the response object before beening send to the Front end.
      const encryptTokenData = await encryptToken.encrypt(req, userValidData);
      if (encryptTokenData) {
        userValidData["accessToken"] = encryptTokenData.token;
        response.successResponse(res, 200, userValidData);
      } else {
        response.errorMsgResponse(res, 301, ERRORS.SOMETHING_WENT_WRONG);
      }
    } else {
      response.errorMsgResponse(res, 505, ERRORS.ENTER_CORRECT_USER_PASS);
    }
  } catch (error) {
    log.error("error", error);
    response.errorMsgResponse(res, 505, ERRORS.ENTER_CORRECT_USER_PASS);
  }
});

//login using social media by getting the user data from social then validating it
router.post("/login/by/social", (req, res) => {
  authController
    .loginWithSocial(req.body)
    .then((resData) => {
      var userValidData = _.pick(resData, [
        "_id",
        "firstName",
        "lastName",
        "mobileNumber",
        "email",
        "designation",
      ]);
      encryptToken.encrypt(req, userValidData).then((resToken) => {
        console.log("resToken", resToken.token);
        userValidData["token"] = resToken.token;
        var responseData = _.pick(userValidData, [
          "firstName",
          "lastName",
          "mobileNumber",
          "email",
          "designation",
          "token",
        ]);
        var responseobj = {
          id: resData._id,
          firstName: resData.firstName,
          lastName: resData.lastName,
          email: resData.email,
          accessToken: userValidData.token,
          loginType: resData.loginType,
        };
        response.successResponse(res, 200, responseobj);
      });
    })
    .catch((error) => {
      log.error("error", error);
      response.errorMsgResponse(res, 301, ERRORS.SOMETHING_WENT_WRONG);
    });
});

// resending OTP to mobile
router.get("/resend/otp/:mobile", (req, res) => {
  log.debug("/resend/otp/:mobile", req.params.mobile);
  if (req.params.mobile) {
    commonController //get the first user with this mobile number
      .getOne(user, {
        mobileNumber: req.params.mobile,
      })
      .then((resData) => {
        if (resData) {
          var otp = otpHelper.generateOTP(); // calls the otp generant function from the otp helper then update the user's with the new otp.
          commonController
            .updateBy(user, resData._id, {
              otp: otp,
            })
            .then((updatedOTP) => {
              sms(req.params.mobile, otp) // sending via SMS
                .then((resOTP) => {
                  response.successResponse(res, 200, "Successfully send otp");
                })
                .catch((error) => {
                  log.error("error", error);
                  response.errorMsgResponse(res, 301, ERRORS.MOBILE_NOT_FOUND);
                });
            })
            .catch((error) => {
              log.error("error", error);
              response.errorMsgResponse(res, 301, ERRORS.MOBILE_NOT_FOUND);
            });
        } else {
          response.errorMsgResponse(res, 301, ERRORS.MOBILE_NOT_FOUND);
        }
      })
      .catch((error) => {
        log.error("error", error);
        response.errorMsgResponse(res, 301, error);
      });
  } else {
    response.errorMsgResponse(res, 301, ERRORS.MOBILE_NOT_FOUND);
  }
});

// resend and verifing Email
router.get("/resend/email/:email", (req, res) => {
  log.debug("/resend/email/:email", req.params.otp);
  var encryptedEmail = md5(req.params.email); // encrypt using md5
  if (req.params.email) {
    commonController
      .updateWithObject(
        // update the user's encrypeted email with new one.
        user,
        {
          email: req.params.email,
        },
        {
          encryptedEmail: encryptedEmail,
        }
      )
      .then((updatedOTP) => {
        var mailConfig = {
          // Email configurathions  // has possible error
          from: config.auth.user,
          email: req.params.email,
          subject: "Verify your mail",
          out:
            "hi, <a href='" +
            config.emailVerifyURL +
            encryptedEmail +
            "'>click here</a> to verify your mail",
        };
        mail
          .sendMail(mailConfig)
          .then((resMail) => {
            log.info(resMail);
            response.successResponse(res, 200, "Successfully send Email");
          })
          .catch((error) => {
            log.error(error);
            response.errorMsgResponse(res, 301, ERRORS.SOMETHING_WENT_WRONG);
          });
      })
      .catch((error) => {
        log.debug("error", error);
        response.errorMsgResponse(res, 301, ERRORS.SOMETHING_WENT_WRONG);
      });
  } else {
    response.errorMsgResponse(res, 301, ERRORS.EMAIL_NOT_FOUND);
  }
});

// Verify Email
router.get("/verify/email/:email", (req, res) => {
  log.debug("req", md5(req.params.email));
  authController
    .verifyEmail(md5(req.params.email)) // verify that the encypted mail is the same as in the database if true set its verfied state to 'verfied'
    .then((resData) => {
      res.redirect(config.appURL);
    })
    .catch((error) => {
      log.error("error", error);
      response.errorMsgResponse(res, 301, error);
    });
});

// mobile verification
router.get("/verify/mobile/:mobile/:otp", (req, res) => {
  log.debug("/verify/mobile/:mobile/:otp", req.params.otp);
  if (req.params.otp) {
    authController
      .verifyMobile(req.params.mobile, req.params.otp) // verfies that the otp is the same as in the database
      .then((resData) => {
        response.successResponse(res, 200, "Mobile Number Verified");
      })
      .catch((error) => {
        log.error("error", error);
        response.errorMsgResponse(res, 301, error);
      });
  } else {
    response.errorMsgResponse(res, 301, ERRORS.WRONG_OTP);
  }
});

// verify password by sending otp by mail to conferm user
router.post("/forgot/password/:email", (req, res) => {
  const email = req.params.email;
  user
    .findOne({
      //get the user with this email to verify
      email: email,
    })
    .then((validData) => {
      if (validData) {
        console.log("inside if statement");
        if (email) {
          let otp = otpHelper.generateOTP();
          console.log("otp ", otp);
          console.log("===>>", email);

          const subject = `Reset password mail`;

          const body = `Hii 
        ${email}, your request to reset your password has been approved. 
        please 
        Use this One Time Password as key ${otp}.

                            Save time, do it online`;

          let emailSend = mail.sendMail(email, subject, body);

          commonController
            .updateWithObject(user, { email: email }, { otp: otp })
            .then((updatedOTP) => {
              response.successResponse(res, 200, "otp sent");
            })
            .catch((error) => {
              log.debug("error", error);
              response.errorMsgResponse(res, 301, ERRORS.SOMETHING_WENT_WRONG);
            });
        } else {
          response.errorMsgResponse(res, 301, ERRORS.EMAIL_NOT_FOUND);
        }
      } else {
        response.errorMsgResponse(res, 301, "your email is not found ");
      }
    })
    .catch((error) => {
      log.error("error", error);
      response.errorMsgResponse(res, 301, error);
    });
});

// resetting password using email and otp send to the user and hashing the password
router.post("/otp/forget/password/:email/:otp", (req, res) => {
  user
    .findOne({
      email: req.params.email,
    })
    .then((validData) => {
      if (validData) {
        //incrypting password
        bcrypt.genSalt(saltRounds, function (err, salt) {
          bcrypt.hash(req.body.password, salt, function (err, hash) {
            user
              .findOneAndUpdate(
                {
                  email: req.params.email,
                  otp: req.params.otp,
                },
                {
                  password: hash,
                  otp: null,
                  isEmailVerified: "Verified",
                }
              )
              .then((resData) => {
                console.log("hash", hash);
                // console.log("resData", resData.password);
                response.successResponse(
                  res,
                  200,
                  "password updated Now you can login"
                );
              })
              .catch((error) => {
                console.log("error", error);
                response.errorMsgResponse(
                  res,
                  301,
                  ERRORS.SOMETHING_WENT_WRONG
                );
              });
          });
        });
      } else {
        response.errorMsgResponse(res, 301, ERRORS.SOMETHING_WENT_WRONG);
      }
    })
    .catch((error) => {
      console.log("error", error);
      response.errorMsgResponse(res, 301, ERRORS.SOMETHING_WENT_WRONG);
    });
});

/**
 * @swagger
 * /authentication/getProfile:
 *   get:
 *     tags:
 *       - Users
 *     description: get Profile details for user
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: authorization
 *         description: authorization token (get from login) ***JWT amknfififl**
 *         in: header
 *         required: true
 *     responses:
 *       200:
 *         description: Returns success responsage
 */

// getting user profile
router.get("/getProfile", auth, async (req, res) => {
  try {
    const userData = await commonController.getSingleRecordByPopulate(
      user,
      { _id: mongoose.Types.ObjectId(req.userId) },
      { path: "role", select: "permissions title" }
    );
    //delete password
    let userValidData = _.pick(userData, [
      "_id",
      "firstName",
      "lastName",
      "mobileNumber",
      "email",
      "role",
      "company",
      "department",
      "avatar",
    ]);
    response.successResponse(res, 200, userValidData);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 301, ERRORS.SOMETHING_WENT_WRONG);
  }
});

router.get("/clientAdmin/getUserProfile/:id", auth, async (req, res) => {
  log.debug("/clientAdmin/getUserProfile/:id");
  try {
    // if (req.designation == "ClientAdmin") {
    const result = await commonController.getByPopulate(
      user,
      { _id: req.params.id },
      ["position", "department", "roleId"]
    );
    response.successResponse(res, 200, result);
    // } else {
    //   response.errorMsgResponse(res, 401, ERRORS.UNAUTHORIZED);
    // }
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 301, error);
  }
});

router.put("/clientAdmin/updateProfile/:id", auth, async (req, res) => {
  try {
    if (req.designation == "ClientAdmin") {
      // can be done with ONE FUNCTION ONLY BY ADDING NEW CONDITION to return the new instance after updating
      const updatedData = await commonController.updateBy(
        user,
        req.params.id,
        req.body
      );
      if (updatedData) {
        const userData = await commonController.getOne(user, {
          _id: req.params.id,
        });
        response.successResponse(res, 200, userData);
      } else {
        response.errorMsgResponse(res, 301, ERRORS.SOMETHING_WENT_WRONG);
      }
    } else {
      response.errorMsgResponse(res, 401, ERRORS.UNAUTHORIZED);
    }
  } catch (error) {
    response.errorMsgResponse(res, 301, ERRORS.SOMETHING_WENT_WRONG);
  }
});

// reset password using email address
router.post("/mail/forget/password/:email/:password", (req, res) => {
  user
    .findOne({
      email: req.params.email,
    })
    .then((validData) => {
      if (validData) {
        bcrypt.genSalt(saltRounds, function (err, salt) {
          bcrypt.hash(req.body.password, salt, function (err, hash) {
            user
              .findOneAndUpdate(
                {
                  email: req.params.email,
                  password: req.params.password,
                },
                {
                  password: hash,
                  isEmailVerified: "Verified",
                }
              )
              .then((resData) => {
                console.log("hash", hash);
                // console.log("resData", resData.password);
                response.successResponse(
                  res,
                  200,
                  "password updated Now you can login"
                );
              })
              .catch((error) => {
                console.log("error", error);
                response.errorMsgResponse(
                  res,
                  301,
                  ERRORS.SOMETHING_WENT_WRONG
                );
              });
          });
        });
      } else {
        response.errorMsgResponse(res, 301, ERRORS.SOMETHING_WENT_WRONG);
      }
    })
    .catch((error) => {
      console.log("error", error);
      response.errorMsgResponse(res, 301, ERRORS.SOMETHING_WENT_WRONG);
    });
});

// getting user data by using its rule
router.get("/get/user/access/by/:id", async (req, res) => {
  try {
    const userData = await commonController.getBy(user, {
      _id: req.params.id,
    });
    if (userData) {
      const roleData = userData[0].roleId;
      const accessData = await commonController.getBy(Access, {
        roleId: roleData,
      });
      response.successResponse(res, 200, accessData);
    } else {
      log.error(error);
      response.errorMsgResponse(res, 500, ERRORS.UNABLE_TO_FETCH_ACCESS);
    }
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, ERRORS.UNABLE_TO_FETCH_ACCESS);
  }
});

// get all employees for certain admin if the user is admin
router.get("/get/all/created/employees", auth, async (req, res) => {
  try {
    log.debug("/get/all/created/employees");
    if (req.designation !== "User") {
      const result = await commonController.getBy(user, {
        clientAdminId: req.userId,
      });
      response.successResponse(res, 200, result);
    } else {
      const userData = await commonController.getBy(user, { _id: req.userId }); // check for the 500times for the user
      if (userData) {
        const userResult = await commonController.getBy(user, {
          //get data using adminid from normal user
          clientAdminId: userData[0].clientAdminId,
        });
        response.successResponse(res, 200, userResult);
      } else {
        log.debug(error);
        response.errorMsgResponse(res, 500, MESSAGE.SOMETHING_WENT_WRONG);
      }
    }
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, ERRORS.UNABLE_TO_FETCH_EMPLOYEES);
  }
});

// update user using id and body if the user is a client admin
router.put("/update/user/by/:id", auth, async (req, res) => {
  try {
    if (req.designation == "ClientAdmin") {
      const result = await commonController.updateBy(
        user,
        req.params.id,
        req.body
      );
      response.successResponse(res, 200, ERRORS.EMPLOYEE_UPDATED_SUCCESSFULLY);
    } else {
      response.errorMsgResponse(res, 401, ERRORS.UNAUTHORIZED);
    }
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 401, ERRORS.UNAUTHORIZED);
  }
});

// update first login data by id
router.put("/update/firstLogin", auth, async (req, res) => {
  try {
    const data = req.userId;
    const result = await commonController.updateBy(user, data, req.body);
    response.successResponse(res, 200, ERRORS.SETUP_SUCCESSFULLY_COMPLETED);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, ERRORS.SOMETHING_WENT_WRONG);
  }
});

// use match to get CLientAdmin then matches the data from companydetails using the id
router.get("/superAdmin/getAll/clientAdmin", auth, async (req, res) => {
  try {
    if (req.designation == "SuperAdmin") {
      const userData = await user.aggregate([
        { $match: { designation: { $eq: "ClientAdmin" } } },
        {
          $lookup: {
            from: "companydetails",
            localField: "_id",
            foreignField: "userId",
            as: "companydetail",
          },
        },
      ]);
      response.successResponse(res, 200, userData);
    } else {
      response.errorMsgResponse(res, 401, ERRORS.UNAUTHORIZED);
    }
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, ERRORS.SOMETHING_WENT_WRONG);
  }
});

// get client admin data and populate the ruleid to get its details
router.get(
  "/superAdmin/getAll/users/by/clientAdmin/:id",
  auth,
  async (req, res) => {
    try {
      if (req.designation == "SuperAdmin") {
        const userData = await user
          .find({
            clientAdminId: req.params.id,
          })
          .populate("roleId");
        response.successResponse(res, 200, userData);
      } else {
        response.errorMsgResponse(res, 401, ERRORS.UNAUTHORIZED);
      }
    } catch (error) {
      log.error(error);
      response.errorMsgResponse(res, 500, ERRORS.SOMETHING_WENT_WRONG);
    }
  }
);

//get all subContractor if the user is superadmin else unauthorized
router.get(
  "/superAdmin/getAll/subContractors/by/clientAdmin/:id",
  auth,
  async (req, res) => {
    try {
      if (req.designation == "SuperAdmin") {
        const contractorData = await SubContractor.find({
          clientAdminId: req.params.id,
        });
        response.successResponse(res, 200, contractorData);
      } else {
        response.errorMsgResponse(res, 401, ERRORS.UNAUTHORIZED);
      }
    } catch (error) {
      log.error(error);
      response.errorMsgResponse(res, 500, ERRORS.SOMETHING_WENT_WRONG);
    }
  }
);

module.exports = router;
