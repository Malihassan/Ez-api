const router = require("express").Router();
const commonController = require("../../controller/commonController");
const response = require("../../helper/response");
const MESSAGE = require("../../helper/message");
const log = require("../../helper/logger");
const mongoose = require("mongoose");
const { result } = require("lodash");
const OurWork = mongoose.model("OurWork");

// add Our Work
router.post("/add", async (req, res) => {
  try {
    log.debug("/add/OurWork");
    const data = await OurWork.findOne();
    if (data) {
      const deleteData = await OurWork.findOneAndDelete({ _id: data._id });
      const result = await commonController.add(OurWork, req.body);
      response.successResponse(res, 200, MESSAGE.OUR_WORK_CREATED + result._id);
    } else {
      const result = await commonController.add(OurWork, req.body);
      response.successResponse(res, 200, MESSAGE.OUR_WORK_CREATED + result._id);
    }
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_CREATE_OUR_WORK);
  }
});

// get Our Work
router.get("/get/:id", async (req, res) => {
  try {
    log.debug("/get/OurWork", req.params.id);
    const result = await commonController.getOne(OurWork, {
      _id: req.params.id,
    });
    response.successResponse(res, 200, result);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_OUR_WORK);
  }
});

// update Our Work
router.put("/update/:id", async (req, res) => {
  try {
    log.debug("/update/OurWork", req.params.id);
    const result = await commonController.updateBy(
      OurWork,
      req.params.id,
      req.body
    );
    response.successResponse(
      res,
      200,
      MESSAGE.OUR_WORK_UPDATED + req.params.id
    );
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_UPDATE_OUR_WORK + req.params.id
    );
  }
});

// delete Our Work
router.delete("/delete/:id", async (req, res) => {
  try {
    log.debug("/delete/OurWork", req.params.id);
    const result = await commonController.delete(OurWork, req.params.id);
    response.successResponse(res, 200, MESSAGE.OUR_WORK_DELETED);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_DELETE_OUR_WORK + req.params.id
    );
  }
});

module.exports = router;
