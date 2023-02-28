let mongoose = require("mongoose");
let connection = require("../helper/database");
let log = require("../helper/logger");
let ERRORS = require("../helper/message");
let otpHelper = require("../helper/otp");
let mail = require("../routes/sendmail/notify");
let User = mongoose.model("User");
const bcrypt = require("bcrypt");
const saltRounds = 10;

module.exports = {
  register: (data) => {
    return new Promise((resolve, reject) => {
      log.debug("register");
      User.findOne({
        email: data.email,
      })
        .then((resUser) => {
          if (resUser) {
            reject(ERRORS.USER_ALREADY_REGISTERED);
          } else {
            const passHelper = otpHelper.generatePassword();
            data["password"] = passHelper;

            var user = new User(data);
            user
              .save()
              .then((resData) => {
                resolve(resData);
              })
              .catch((error) => {
                log.error(error);
                reject(ERRORS.SOMETHING_WENT_WRONG);
              });

            const subject = "WHS employee created";

            const body = `Hii 
        ${data.email}, you are an certified employee.
        please click the link below to reset your password.
        Use this dummy password as key ${passHelper}.

        http://54.201.160.69:3152/#/resetPassword/${Buffer.from(
          data.email
        ).toString("base64")}

                            Save time, do it online`;

            const mailer = mail.sendMail(data.email, subject, body);
          }
        })
        .catch((error) => {
          log.error(error);
          reject(ERRORS.SOMETHING_WENT_WRONG);
        });
    });
  },

  loginWithSocial: (data) => {
    return new Promise((resolve, reject) => {
      var object = {};
      if (data.hasOwnProperty("email")) {
        object["email"] = data.email;
      }
      User.findOne({ ...object, status: { $ne: "deleted" } }).then(
        (resUser) => {
          if (resUser) {
            resolve(resUser);
          } else {
            var obj = {
              email: data && data.email ? data.email : null,
              firstName: data.firstName,
              lastName: data.lastName,
              designation: "Student",
              loginType: data.loginType,
              isEmailVerified: data && data.email ? "Verified" : "Not",
            };
            var user = new User(obj);
            user
              .save()
              .then((resData) => {
                resolve(resData);
              })
              .catch((error) => {
                console.log("error", error);

                reject(error);
              });
          }
        }
      );
    });
  },

  login: (user) => {
    return new Promise((resolve, reject) => {
      // log.info("user", user);
      var object = {};
      if (user.hasOwnProperty("email")) {
        object["email"] = user.email;
      } else {
        object["mobileNumber"] = user.mobileNumber;
      }
      User.findOne({
        ...object, //Spread Oparetor
        status: { $ne: "deleted" },
      })
        .populate({ path: 'role', select: 'permissions title' })
        .then((resData) => {
          // console.log("resData", resData);
          if (!resData) {
            reject({ code: 400 }); //Email not found
          } else {
            if (resData.isEmailVerified !== "Verified") {
              reject(ERRORS.EMAIL_NOT_VERIFIED);
            }
            //  else if (resData.isEmailVerified !== "Verified") {
            //   reject(ERRORS.EMAIL_NOT_VERIFIED);
            // }
            else {
              bcrypt.compare(
                user.password,
                resData.password,
                function (err, result) {
                  if (result) {
                    // console.log(resData, "====<<");
                    resolve(resData);
                  } else {
                    reject(103); //wrong Password
                  }
                }
              );
            }
          }
        })
        .catch((error) => {
          log.error(error);
          reject(ERRORS.SOMETHING_WENT_WRONG);
        });
    });
  },

  verifyEmail: (email) => {
    return new Promise((resolve, reject) => {
      log.info("user", email);
      // User.findOne({
      //   encryptedEmail: email,
      // })
      User.findOneAndUpdate(
        {
          encryptedEmail: email,
        },
        {
          isEmailVerified: "Verified",
          encryptedEmail: null,
        },
        { new: true }
      )
        .then((resData) => {
          if (resData) {
            log.info("resData", resData);
          } else {
            reject(ERRORS.EMAIL_NOT_FOUND);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  verifyMobile: (mobile, otp) => {
    return new Promise((resolve, reject) => {
      log.info("user", mobile, otp);
      User.findOneAndUpdate(
        {
          mobileNumber: mobile,
          otp: otp,
        },
        {
          isMobileVerified: "Verified",
          otp: null,
        },
        { new: true }
      )
        .then((resData) => {
          if (resData) {
            resolve(resData);
          } else {
            reject(ERRORS.WRONG_OTP);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  loginWithOTP: (mobile, motp) => {
    return new Promise((resolve, reject) => {
      log.info("mobile", mobile);
      var object = {};
      object["mobileNumber"] = mobile;
      User.findOne({
        ...object, //Spread Oparetor
        status: {
          $ne: "deleted",
        },
      })
        .then((resData) => {
          if (!resData) {
            reject({
              code: 400,
              message: "You are Not Register With Us",
            }); //Email not found
          } else {
            if (resData.isMobileVerified !== "Verified") {
              reject(ERRORS.MOBILE_NOT_VERIFIED);
            } else {
              commonController
                .updateWithObject2(
                  User,
                  {
                    mobileNumber: mobile,
                    otp: motp,
                  },
                  {
                    otp: null,
                  }
                )
                .then((resposeUser) => {
                  if (resposeUser) {
                    resolve(resposeUser);
                  } else {
                    reject("enter correct otp");
                  }
                })
                .catch((error) => {
                  console.log("error", error);
                  reject(error);
                });
            }
          }
        })
        .catch((error) => {
          log.error(error);
          reject(ERRORS.SOMETHING_WENT_WRONG);
        });
    });
  },
};
