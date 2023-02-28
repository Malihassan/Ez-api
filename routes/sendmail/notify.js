const log = require("../../helper/logger");
var nodemailer = require("nodemailer");
// const cron = require("node-cron");
let config = require("../../config.json");
var fs = require("fs");
const { getMaxListeners } = require("../../model/toolbox/toolbox.model");

// router.post('/', (req, res) => {
module.exports = {
  // sendMail: (data) => {
  //     return new Promise((resolve, reject) => {
  //         log.debug('/api/sendnotification/', data);
  //         console.log(config.auth.user, config.auth.pass);
  //         var transporter = nodemailer.createTransport({
  //             service: 'gmail',
  //             auth: {
  //                 user: config.auth.user,
  //                 pass: config.auth.pass
  //             }
  //         });
  //         var mailOptions = {
  //             from: data.from,
  //             to: data.email,
  //             subject: data.subject,
  //             html: data.out,
  //         };
  //         transporter.sendMail(mailOptions, function (error, info) {
  //             if (error) {
  //                 console.log(error);
  //                 reject(error);
  //             } else {
  //                 resolve(info.response)
  //             }
  //         });
  //     })
  // }

  // "daily",
  //       "weekly",
  //       "quaterly",
  //       "monthly",
  //       "halfYearly",
  //       "yearly",
  //       "onceOff",

  // notifyMail: (to, subject, body) => {
  //   if (frequency == "daily") {
  //     var day = 1;
  //   } else if ((frequency = "weekly")) {
  //     var day = 7;
  //   } else if ((frequency = "monthly")) {
  //     var month = 1;
  //   } else if ((frequency = "quaterly")) {
  //     var month = 3;
  //   } else if ((frequency = "halfYearly")) {
  //     var month = 6;
  //   } else if ((frequency = "yearly")) {
  //     var month = 12;
  //   }

  //   let min = "45";
  //   let hrs = "14";
  //   cron.schedule(`${min} ${hrs} * * *`, function () {
  //     console.log("---------------------");
  //     console.log("Running Cron Job");

  //     var transporter = nodemailer.createTransport({
  //       service: "gmail",
  //       port: config.auth.port,
  //       tls: true,
  //       auth: {
  //         user: config.auth.user,
  //         pass: config.auth.pass,
  //       },
  //     });

  //     var mailOptions = {
  //       from: config.auth.user,
  //       to: to,
  //       subjec: subject,
  //       html: body,
  //     };
  //     transporter.sendMail(mailOptions, function (error, info) {
  //       if (error) {
  //         console.log(error);
  //       } else {
  //         console.log("Mail Sent", info.response);
  //       }
  //     });
  //   });
  // },

  sendMail: (to, subject, body) => {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      port: config.auth.port,
      tls: true,
      auth: {
        user: config.auth.user,
        pass: config.auth.pass,
      },
      from: `WHS@gmail.com`,
    });

    var mailOptions = {
      from: config.auth.user,
      to: to,
      subjec: subject,
      html: body,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Mail Sent", info.response);
      }
    });
  },
};
