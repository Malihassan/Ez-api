const router = require("express").Router();
const commonController = require("../../controller/commonController");
const response = require("../../helper/response");
const MESSAGE = require("../../helper/message");
const log = require("../../helper/logger");
const auth = require("../../helper/auth");
const mongoose = require("mongoose");
const SubContractor = mongoose.model("SubContractor");

// add Sub Contractor
router.post("/add", auth, async (req, res) => {
  try {
    log.debug("/add/SubContractor");
    const result = await commonController.add(SubContractor, req.body);
    response.successResponse(
      res,
      200,
      MESSAGE.SUB_CONTRACTOR_CREATED + result._id
    );
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_CREATE_SUB_CONTRACTOR
    );
  }
});

//get all Sub Contractor
router.get("/getAll", auth, async (req, res) => {
  try {
    log.debug("/getAll/SubContractor");
    const userData = req.userId;
    const result = await commonController.getBy(SubContractor, {
      clientAdminId: req.userId,
    });
    response.successResponse(res, 200, result);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_SUB_CONTRACTOR);
  }
});

// get Sub Contractor
router.get("/get/:id", async (req, res) => {
  try {
    log.debug("/get/SubContractor", req.params.id);
    const result = await commonController.getOne(SubContractor, {
      _id: req.params.id,
    });
    response.successResponse(res, 200, result);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_SUB_CONTRACTOR);
  }
});

// update Sub Contractor
router.put("/update/:id", auth, async (req, res) => {
  try {
    log.debug("/update/SubContractor", req.params.id);
    const result = await commonController.updateBy(
      SubContractor,
      req.params.id,
      req.body
    );
    response.successResponse(
      res,
      200,
      MESSAGE.SUB_CONTRACTOR_UPDATED + req.params.id
    );
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_UPDATE_SUB_CONTRACTOR + req.params.id
    );
  }
});

// delete Sub Contractor
router.delete("/delete/:id", async (req, res) => {
  try {
    log.debug("/delete/SubContractor", req.params.id);
    const result = await commonController.delete(SubContractor, req.params.id);
    response.successResponse(res, 200, MESSAGE.SUB_CONTRACTOR_DELETED);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_DELETE_SUB_CONTRACTOR + req.params.id
    );
  }
});

module.exports = router;
