const router = require("express").Router();
const commonController = require("../../controller/commonController");
const response = require("../../helper/response");
const MESSAGE = require("../../helper/message");
const log = require("../../helper/logger");
const mongoose = require("mongoose");
const { result } = require("lodash");
const SubModule = mongoose.model("SubModule");

// add sub-module
router.post("/add", async (req, res) => {
  try {
    log.debug("/add/subModule");
    const result = await commonController.add(SubModule, req.body);
    response.successResponse(res, 200, MESSAGE.SUB_MODULE_CREATED + result._id);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_CREATE_SUB_MODULE);
  }
});

// get sub-module
router.get("/get/:id", async (req, res) => {
  try {
    log.debug("/get/subModule", req.params.id);
    const result = await commonController.getOne(SubModule, {
      _id: req.params.id,
    });
    response.successResponse(res, 200, result);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_SUB_MODULE);
  }
});

// update sub-module
router.put("/update/:id", async (req, res) => {
  try {
    log.debug("/update/subModule", req.params.id);
    const result = await commonController.updateBy(
      SubModule,
      req.params.id,
      req.body
    );
    response.successResponse(
      res,
      200,
      MESSAGE.SUB_MODULE_UPDATED + req.params.id
    );
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_UPDATE_SUB_MODULE + req.params.id
    );
  }
});

// delete sub-module
router.delete("/delete/:id", async (req, res) => {
  try {
    log.debug("/delete/subModule", req.params.id);
    const result = await commonController.delete(SubModule, req.params.id);
    response.successResponse(res, 200, MESSAGE.SUB_MODULE_DELETED);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_DELETE_SUB_MODULE + req.params.id
    );
  }
});

module.exports = router;
