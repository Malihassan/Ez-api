const router = require("express").Router();
const commonController = require("../../controller/commonController");
const response = require("../../helper/response");
const MESSAGE = require("../../helper/message");
const log = require("../../helper/logger");
const mongoose = require("mongoose");
const FAQ = mongoose.model("FAQ");

// add FAQ
router.post("/add", async (req, res) => {
  try {
    log.debug("/add/FAQ");
    const result = await commonController.add(FAQ, req.body);
    response.successResponse(res, 200, MESSAGE.FAQ_CREATED + result._id);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_CREATE_FAQ);
  }
});

//get all FAQ
router.get("/getAll", async (req, res) => {
  try {
    log.debug("/getAll/FAQ");
    const field = req.query.field;
    const value = req.query.value;
    if (field && value) {
      const result = await commonController.getAllRecordBySorting(
        FAQ,
        field,
        value
      );
      response.successResponse(res, 200, result);
    } else {
      const result = await commonController.getAll(FAQ);
      response.successResponse(res, 200, result);
    }
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_FAQ);
  }
});

// get FAQ
router.get("/get/:id", async (req, res) => {
  try {
    log.debug("/get/FAQ", req.params.id);
    const result = await commonController.getOne(FAQ, {
      _id: req.params.id,
    });
    response.successResponse(res, 200, result);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_FAQ);
  }
});

// update FAQ
router.put("/update/:id", async (req, res) => {
  try {
    log.debug("/update/FAQ", req.params.id);
    const result = await commonController.updateBy(
      FAQ,
      req.params.id,
      req.body
    );
    response.successResponse(res, 200, MESSAGE.FAQ_UPDATED + req.params.id);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_UPDATE_FAQ + req.params.id
    );
  }
});

// delete FAQ
router.delete("/delete/:id", async (req, res) => {
  try {
    log.debug("/delete/FAQ", req.params.id);
    const result = await commonController.delete(FAQ, req.params.id);
    response.successResponse(res, 200, MESSAGE.FAQ_DELETED);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_DELETE_FAQ + req.params.id
    );
  }
});

module.exports = router;
