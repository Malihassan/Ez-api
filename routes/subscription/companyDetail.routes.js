const router = require("express").Router();
const commonController = require("../../controller/commonController");
const response = require("../../helper/response");
const MESSAGE = require("../../helper/message");
const log = require("../../helper/logger");
const mongoose = require("mongoose");
const CompanyDetail = mongoose.model("CompanyDetail");
const User = mongoose.model("User");
const auth = require("../../helper/auth");

// add company details
router.post("/add", async (req, res) => {
  try {
    log.debug("/add/CompanyDetail");
    const result = await commonController.add(CompanyDetail, req.body);
    response.successResponse(
      res,
      200,
      MESSAGE.COMPANY_DETAIL_CREATED + result._id
    );
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      200,
      MESSAGE.UNABLE_TO_CREATE_COMPANY_DETAIL
    );
  }
});

// get all Company Detail
// router.get("/getAll", async (req, res) => {
//   try {
//     log.debug("/getAll/CompanyDetail");
//     const result = await commonController.getAll(CompanyDetail);
//     response.successResponse(res, 200, result);
//   } catch (error) {
//     log.error(error);
//     response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_COMPANY_DETAIL);
//   }
// });
//"branches":["6358f5909b7d464f2cd11b46","6358fae174cf794c9800aa99"]

router.get("/getAll", async (req, res) => {
  try {
    log.debug("/getAll/CompanyDetail");
    const result = await CompanyDetail.find({ status: { $ne: "deleted" } }).populate("branches");
    response.successResponse(res, 200, result);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_COMPANY_DETAIL);
  }
});

// get Company Detail
router.get("/get", auth, async (req, res) => {
  try {
    log.debug("/get/CompanyDetail");
    const result = await commonController.getOne(CompanyDetail, {
      userId: req.userId,
    });
    console.log(req.userId);
    response.successResponse(res, 200, result);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_COMPANY_DETAIL);
  }
});

// update Company Detail
// router.put("/update/:id", async (req, res) => {
//   try {
//     log.debug("/update/CompanyDetail", req.params.id);
//     const result = await commonController.updateBy(
//       CompanyDetail,
//       req.params.id,
//       req.body
//     );
//     response.successResponse(
//       res,
//       200,
//       MESSAGE.COMPANY_DETAIL_UPDATED + req.params.id
//     );
//   } catch (error) {
//     log.error(error);
//     response.errorMsgResponse(
//       res,
//       500,
//       MESSAGE.UNABLE_TO_UPDATE_COMPANY_DETAIL + req.params.id
//     );
//   }
// });

router.put("/update", auth, async (req, res) => {
  // router.put("/update", async (req, res) => {
  try {
    log.debug("/update/CompanyDetail");
    const result = await commonController.updateWithObject(
      CompanyDetail,
      // { userId: '62090788d083841874e3faab' },
      { userId: req.userId },
      req.body
    );
    response.successResponse(res, 200, MESSAGE.COMPANY_DETAIL_UPDATED);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_UPDATE_COMPANY_DETAIL
    );
  }
});

// delete Company Detail
router.delete("/delete/:id", async (req, res) => {
  try {
    log.debug("/delete/CompanyDetail", req.params.id);
    const result = await commonController.delete(CompanyDetail, req.params.id);
    response.successResponse(res, 200, MESSAGE.COMPANY_DETAIL_DELETED);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_DELETE_COMPANY_DETAIL + req.params.id
    );
  }
});

module.exports = router;
