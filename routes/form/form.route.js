const router = require("express").Router();
const commonController = require("../../controller/commonController");
const response = require("../../helper/response");
const MESSAGE = require("../../helper/message");
const log = require("../../helper/logger");
const mongoose = require("mongoose");
const { result } = require("lodash");
const Form = mongoose.model("Form");
const SavedDynamicForm = mongoose.model("SavedDynamicForm");

// add form
router.post("/add", async (req, res) => {
  try {
    log.debug("/add/form");
    const result = await commonController.add(Form, req.body);
    response.successResponse(res, 200, MESSAGE.FORM_CREATED + result._id);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_CREATE_FORM);
  }
});

// get all forms
router.get("/getAll", async (req, res) => {
  try {
    log.debug("/getAll/form");
    const field = req.query.field;
    const value = req.query.value;
    if (field && value) {
      const result = await commonController.getRecordsSortedWithPopulate(
        Form,
        "formCategoryId",
        field,
        value
      );
      response.successResponse(res, 200, result);
    } else {
      const result = await commonController.getAllRecordByPopulate(
        Form,
        "formCategoryId"
      );
      response.successResponse(res, 200, result);
    }
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_FORM);
  }
});

// get form
router.get("/get/:id", async (req, res) => {
  try {
    log.debug("/get/Form", req.params.id);
    const result = await commonController.getSingleRecordByPopulate(
      Form,
      {
        _id: req.params.id,
      },
      "formCategoryId"
    );
    response.successResponse(res, 200, result);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_FORM);
  }
});

router.get("/getBy/:formId", async (req, res) => {
  try {
    log.debug("/getAll/from/formId", req.params._id);
    const formData = await commonController.getOne(Form, {
      _id: req.params.id,
    });

    const data = await commonController.getBy(SavedDynamicForm, {
      formId: formData._id,
    });
    const result = [{ data }];
    response.successResponse(res, 200, result);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_FETCH_SAVED_DYNAMIC_FORM
    );
  }
});

// update form
router.put("/update/:id", async (req, res) => {
  try {
    log.debug("/update/form", req.params.id);
    const result = await commonController.updateBy(
      Form,
      req.params.id,
      req.body
    );
    response.successResponse(res, 200, MESSAGE.FORM_UPDATED + req.params.id);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_UPDATE_FORM + req.params.id
    );
  }
});

// delete form
router.delete("/delete/:id", async (req, res) => {
  try {
    log.debug("/delete/form", req.params.id);
    const result = await commonController.delete(Form, req.params.id);
    response.successResponse(res, 200, MESSAGE.FORM_DELETED);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_DELETE_FORM + req.params.id
    );
  }
});

module.exports = router;
