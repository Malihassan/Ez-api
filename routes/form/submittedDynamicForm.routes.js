const router = require("express").Router();
const commonController = require("../../controller/commonController");
const response = require("../../helper/response");
const MESSAGE = require("../../helper/message");
const log = require("../../helper/logger");
const mongoose = require("mongoose");
const { result } = require("lodash");
const SubmittedDynamicForm = mongoose.model("SubmittedDynamicForm");

// add Submitted Dynamic Form
router.post("/add", async (req, res) => {
  try {
    log.debug("/add/SubmittedDynamicForm");
    const result = await commonController.add(SubmittedDynamicForm, req.body);
    response.successResponse(
      res,
      200,
      MESSAGE.SUBMITTED_DYNAMIC_FORM_CREATED + result._id
    );
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_CREATE_SUBMITTED_DYNAMIC_FORM
    );
  }
});

// // add multiple SubmittedDynamicForm
// router.post("/add/multiple", async (req, res) => {
//   try {
//     log.debug("/add//multiple/SubmittedDynamicForm");
//     var obj = [];
//     req.body.arrObj.forEach((element) => {
//       obj.push({
//         formData:
//           element.formData == undefined ? (element.formData = "") : element.formData,
//       });
//     });
//     console.log(obj);
//     const responseObj = await SubmittedDynamicForm.insertMany(obj);
//     response.successResponse(res, 200, MESSAGE.SUBMITTED_DYNAMIC_FORM_CREATED);
//   } catch (error) {
//     log.error(error);
//     response.errorMsgResponse(
//       res,
//       500,
//       MESSAGE.UNABLE_TO_CREATE_SUBMITTED_DYNAMIC_FORM
//     );
//   }
// });

// get all Submitted Dynamic Form
router.get("/getAll", async (req, res) => {
  try {
    log.debug("/getAll/SubmittedDynamicForm");
    const result = await commonController.getWithReverseSortByPopulate(
      SubmittedDynamicForm,
      "formData.pmId"
    );
    response.successResponse(res, 200, result);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_FETCH_SUBMITTED_DYNAMIC_FORM
    );
  }
});

// get Submitted Dynamic Form
router.get("/get/:id", async (req, res) => {
  try {
    log.debug("/get/SubmittedDynamicForm");
    const result = await commonController.getOne(SubmittedDynamicForm, {
      _id: req.params.id,
    });
    response.successResponse(res, 200, result);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_FETCH_SUBMITTED_DYNAMIC_FORM
    );
  }
});

// update Submitted Dynamic Form
router.put("/update/:id", async (req, res) => {
  try {
    log.debug("/update/SubmittedDynamicForm");
    const result = await commonController.updateBy(
      SubmittedDynamicForm,
      req.params.id,
      req.body
    );
    response.successResponse(
      res,
      200,
      MESSAGE.SUBMITTED_DYNAMIC_FORM_UPDATED + req.params.id
    );
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_UPDATE_SUBMITTED_DYNAMIC_FORM + req.params.id
    );
  }
});

// delete Submitted Dynamic Form
router.delete("/delete/:id", async (req, res) => {
  try {
    log.debug("/delete/SubmittedDynamicForm");
    const result = await commonController.delete(
      SubmittedDynamicForm,
      req.params.id
    );
    response.successResponse(res, 200, MESSAGE.SUBMITTED_DYNAMIC_FORM_DELETED);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_DELETE_SUBMITTED_DYNAMIC_FORM + req.params.id
    );
  }
});

module.exports = router;
