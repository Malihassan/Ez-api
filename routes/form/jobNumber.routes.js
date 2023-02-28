const router = require("express").Router();
const commonController = require("../../controller/commonController");
const response = require("../../helper/response");
const MESSAGE = require("../../helper/message");
const log = require("../../helper/logger");
const auth = require("../../helper/auth");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const JobNumber = mongoose.model("JobNumber");

// add job number
router.post("/add", auth, async (req, res) => {
  try {
    log.debug("/add/jobNumber");
    const obj = req.body;

    const resData1 = await commonController.getBy(JobNumber, {
      clientAdminId: req.userId,
    });

    if (resData1.length != 0) {
      const jobNumberArr = [];
      resData1.map((ele) => {
        jobNumberArr.push(ele.jobNumber);
      });
      const count = Math.max(...jobNumberArr);

      const missingArr = [];
      for (let i = 1; i <= count; i++) {
        if (jobNumberArr.indexOf(i) == -1) {
          missingArr.push(i);
        }
      }
      let minRank = Math.min(...missingArr);

      if (minRank != Infinity) {
        var jobNumberData = minRank;
      } else {
        var jobNumberData = count + 1;
      }

      if (jobNumberArr.indexOf(parseInt(obj.jobNumber)) !== -1) {
        response.errorMsgResponse(res, 500, MESSAGE.DUPLICATE_JOB_NUMBER);
      } else {
        const objWithIndex = Object.assign({ jobNumber: jobNumberData }, obj);
        const result = await commonController.add(JobNumber, objWithIndex);
        response.successResponse(
          res,
          200,
          MESSAGE.JOB_NUMBER_CREATED + result._id
        );
        console.log(result);
      }
    } else {
      const objWithIndex = Object.assign({ jobNumber: 1 }, obj);
      const result = await commonController.add(JobNumber, objWithIndex);
      response.successResponse(
        res,
        200,
        MESSAGE.JOB_NUMBER_CREATED + result._id
      );
    }
  } catch (error) {
    console.log(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_CREATE_JOB_NUMBER);
  }
});

// router.get("/add", async (req, res) => {
//   try {
//     const resData = await JobNumber.find();
//     log.debug("/add/JobNumber");
//     const result = resData.map(({ jobNumber }) => jobNumber);
//     console.log("=======>>>>>>>>", result);
//     response.successResponse(res, 200, result);
//   } catch (error) {
//     log.error(error);
//     response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_CREATE_JOB_NUMBER);
//   }
// });

// get all job number
router.get("/getAll", auth, async (req, res) => {
  try {
    log.debug("/getAll/JobNumber");

    if (req.designation !== "User") {
      const field = req.query.field;
      const value = req.query.value;
      if (field && value) {
        const result = await commonController.getAuthRecordsSortedWithPopulate(
          JobNumber,
          { clientAdminId: req.userId },
          ["stateId", "customerId", "siteId"],
          field,
          value
        );
        response.successResponse(res, 200, result);
      } else {
        const result = await commonController.getAllAuthRecordByPopulate(
          JobNumber,
          { clientAdminId: req.userId },
          ["stateId", "siteId", "customerId"]
        );
        response.successResponse(res, 200, result);
      }
    } else {
      const userData = await commonController.getBy(User, { _id: req.userId });
      if (userData) {
        const jobNumberData = await commonController.getByPopulate(
          JobNumber,
          {
            clientAdminId: userData[0].clientAdminId,
          },
          ["stateId", "siteId", "customerId"]
        );
        response.successResponse(res, 200, jobNumberData);
      } else {
        log.debug(error);
        response.errorMsgResponse(res, 500, MESSAGE.SOMETHING_WENT_WRONG);
      }
    }
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_JOB_NUMBER);
  }
});

// get job number
router.get("/get/:id", auth, async (req, res) => {
  try {
    log.debug("/get/JobNumber", req.params.id);
    const result = await commonController.getOne(JobNumber, {
      _id: req.params.id,
    });
    response.successResponse(res, 200, result);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_JOB_NUMBER);
  }
});

// router.put("/update/:id", async (req, res) => {
//   try {
//     const resData = await JobNumber.findById({ _id: req.params.id });
//     log.debug("/update/:id", req.params.id);
//     if (resData) {
//       var obj = [];
//       req.body.arrObj.forEach((element) => {
//         obj.push({
//           siteName:
//             element.siteName == undefined
//               ? (element.siteName = "")
//               : element.siteName,
//           streetNumber:
//             element.streetNumber == undefined
//               ? (element.streetNumber = "")
//               : element.streetNumber,
//           streetAddress:
//             element.streetAddress == undefined
//               ? (element.streetAddress = "")
//               : element.streetAddress,
//           subrub:
//             element.subrub == undefined
//               ? (element.subrub = "")
//               : element.subrub,
//           state:
//             element.state == undefined ? (element.state = "") : element.state,
//           customerName:
//             element.customerName == undefined
//               ? (element.customerName = "")
//               : element.customerName,
//           customerContact:
//             element.customerContact == undefined
//               ? (element.customerContact = "")
//               : element.customerContact,
//           customerContactPhone:
//             element.customerContactPhone == undefined
//               ? (element.customerContactPhone = "")
//               : element.customerContactPhone,
//           customerEmail:
//             element.customerEmail == undefined
//               ? (element.customerEmail = "")
//               : element.customerEmail,
//         });
//       });
//       console.log(obj);
//       const result = await JobNumber.updateOne(obj);
//       response.successResponse(res, 200, MESSAGE.JOB_NUMBER_UPDATED);
//     } else {
//       response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_UPDATE_JOB_NUMBER);
//     }
//   } catch (error) {
//     log.error(error);
//     response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_UPDATE_JOB_NUMBER);
//   }
// });

// // update job number
// router.put("/update/:id", async (req, res) => {
//   try {
//     const resData = await JobNumber.findOneAndUpdate({ _id: req.params.id });
//     log.debug("/update/:id", req.params.id);
//     const result = await commonController.updateBy(
//       JobNumber,
//       req.params.id,
//       req.body
//     );
//     response.successResponse(
//       res,
//       200,
//       MESSAGE.JOB_NUMBER_UPDATED + req.params.id
//     );
//   } catch (error) {
//     log.error(error);
//     response.errorMsgResponse(
//       res,
//       500,
//       MESSAGE.UNABLE_TO_UPDATE_JOB_NUMBER + req.params.id
//     );
//   }
// });

// delete job number
router.delete("/delete/:id", async (req, res) => {
  try {
    log.debug("/delete/JobNumber", req.params.id);
    const result = await commonController.delete(JobNumber, req.params.id);
    response.successResponse(res, 200, MESSAGE.JOB_NUMBER_DELETED);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_DELETE_JOB_NUMBER + req.params.id
    );
  }
});

module.exports = router;
