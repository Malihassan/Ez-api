const router = require("express").Router();
const log = require("../../helper/logger");
const response = require("../../helper/response");
var nodemailer = require("nodemailer");
const mailer = require("../../routes/sendmail/notify");
const path = require("path");

var fs = require("fs");
const commonController = require("../../controller/commonController");

// router.get("/notify/mails", (req, res) => {
//   log.debug("/api/notify/mails/");
//   const notifyMailData = await;
//   // resumeController
//   //   .getALlresume()
//   //   .then((resumeData) => {
//   //     response.successResponse(res, 200, resumeData);
//   //   })
//   //   .catch((error) => {
//   //     log.error(error);
//   //     response.errorResponse(res, 500);
//   //   });
// });

router.get("/notify/mails", async (req, res) => {
  try {
    log.debug("/api/notify/mails/");
    const email = "wankhedeabhijit6@gmail.com";
    const subject = "This is a dummy mail for testing purpose";
    const body = "Ignore it of take pleasure of it";
    const notifyMailData = mailer.notifyMail(email, subject, body);
    // resumeController
    //   .getALlresume()
    //   .then((resumeData) => {
    //     response.successResponse(res, 200, resumeData);
    //   })
    //   .catch((error) => {
    //     log.error(error);
    //     response.errorResponse(res, 500);
    //   });
    response.successResponse(res, 200, notifyMailData);
  } catch (error) {
    response.errorMsgResponse(res, 200, "ERROR");
  }
});

router.post("/", (req, res) => {
  log.debug("/api/sendmail/");
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "wankhedeabhijit6@gmail.com",
      pass: "abshana@98",
    },
  });
  var mailOptions = {
    from: "wankhedeabhijit6@gmail.com",
    to: "dk.cryptex@gmail.com",
    subject: "dummy password for resetting password ",
    html: "Mail send successfully",
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      response.successResponse(res, 200, info.response);
    }
  });
});

router.delete("/:resumeId", (req, res) => {
  log.debug("/api/sendmail/:resumeId");
  resumeController
    .deleteresume(req.params.resumeId)
    .then((resumeData) => {
      if (resumeData == null) {
        response.errorResponse(res, 414);
      } else {
        response.successResponse(res, 200, resumeData);
      }
    })
    .catch((err) => {
      log.error("Error :", err);
      response.errorResponse(res, 500);
    });
});

module.exports = router;
