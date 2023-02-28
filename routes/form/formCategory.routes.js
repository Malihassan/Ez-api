const router = require("express").Router();
const commonController = require("../../controller/commonController");
const response = require("../../helper/response");
const MESSAGE = require("../../helper/message");
const log = require("../../helper/logger");
const mongoose = require("mongoose");
const FormCategory = mongoose.model("FormCategory");

// add Form Category
router.post("/add", async (req, res) => {
  try {
    log.debug("/add/FormCategory");
    const result = await commonController.add(FormCategory, { ...req.body, userId: req.userId });
    response.successResponse(
      res,
      200,
      MESSAGE.FORM_CATEGORY_CREATED + result._id
    );
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_CREATE_FORM_CATEGORY);
  }
});

// get all Form Category
router.get("/getAll", async (req, res) => {
  try {
    log.debug("/getAll/FormCategory");
    const result = await commonController.getAllSortReverse(FormCategory, { userId: req.userId });
    response.successResponse(res, 200, result);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_FORM_CATEGORY);
  }
});

// get Form Category
router.get("/get/:id", async (req, res) => {
  try {
    log.debug("/get/FormCategory", req.params.id);
    const result = await commonController.getOne(FormCategory, {
      _id: req.params.id,
    });
    response.successResponse(res, 200, result);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_FORM_CATEGORY);
  }
});

// update Form Category
router.put("/update/:id", async (req, res) => {
  try {
    log.debug("/update/FormCategory", req.params.id);
    const result = await commonController.updateBy(
      FormCategory,
      req.params.id,
      req.body
    );
    response.successResponse(
      res,
      200,
      MESSAGE.FORM_CATEGORY_UPDATED + req.params.id
    );
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_UPDATE_FORM_CATEGORY + req.params.id
    );
  }
});

// delete Form Category
router.delete("/delete/:id", async (req, res) => {
  try {
    log.debug("/delete/FormCategory", req.params.id);
    const result = await commonController.delete(FormCategory, req.params.id);
    response.successResponse(res, 200, MESSAGE.FORM_CATEGORY_DELETED);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_DELETE_FORM_CATEGORY + req.params.id
    );
  }
});

module.exports = router;
