const router = require("express").Router();
const commonController = require("../../../controller/commonController");
const response = require("../../../helper/response");
const MESSAGE = require("../../../helper/message");
const log = require("../../../helper/logger");
const mongoose = require("mongoose");
const TermsAndCondition = mongoose.model("TermsAndCondition");

// add Terms And Condition
router.post("/add", async (req, res) => {
  try {
    log.debug("/add/TermsAndCondition");
    const data = await TermsAndCondition.findOne();
    if (data) {
      const deleteData = await TermsAndCondition.findOneAndDelete({
        _id: data._id,
      });
    }
    const result = await commonController.add(TermsAndCondition, req.body);
    response.successResponse(
      res,
      200,
      MESSAGE.TERMS_AND_CONDITION_CREATED + result._id
    );
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_CREATE_TERMS_AND_CONDITION
    );
  }
});

// get all Terms And Condition
router.get("/getAll", async (req, res) => {
  try {
    log.debug("/getAll/TermsAndCondition");
    const field = req.query.field;
    const value = req.query.value;
    if (field && value) {
      const result = await commonController.getAllRecordBySorting(
        TermsAndCondition,
        field,
        value
      );
      response.successResponse(res, 200, result);
    } else {
      const result = await commonController.getAll(TermsAndCondition);
      response.successResponse(res, 200, result);
    }
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_FETCH_TERMS_AND_CONDITION
    );
  }
});

// // update Terms And Condition
// router.put("/update/:id", async (req, res) => {
//   try {
//     log.debug("/update/TermsAndCondition", req.params.id);
//     const result = await commonController.updateBy(
//       TermsAndCondition,
//       req.params.id,
//       req.body
//     );
//     response.successResponse(
//       res,
//       200,
//       MESSAGE.TERMS_AND_CONDITION_UPDATED + req.params.id
//     );
//   } catch (error) {
//     log.error(error);
//     response.errorMsgResponse(
//       res,
//       500,
//       MESSAGE.UNABLE_TO_UPDATE_TERMS_AND_CONDITION + req.params.id
//     );
//   }
// });

// delete Terms And Condition
router.delete("/delete/:id", async (req, res) => {
  try {
    log.debug("/delete/TermsAndCondition", req.params.id);
    // const result = await commonController.delete(
    //   TermsAndCondition,
    //   req.params.id
    // );
    const result = await TermsAndCondition.findByIdAndDelete({
      _id: req.params.id,
    });
    response.successResponse(res, 200, MESSAGE.TERMS_AND_CONDITION_DELETED);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_DELETE_TERMS_AND_CONDITION + req.params.id
    );
  }
});

module.exports = router;
