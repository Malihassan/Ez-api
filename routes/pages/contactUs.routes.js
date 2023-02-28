const router = require("express").Router();
const commonController = require("../../controller/commonController");
const response = require("../../helper/response");
const MESSAGE = require("../../helper/message");
const log = require("../../helper/logger");
const mongoose = require("mongoose");
const { result } = require("lodash");
const ContactUs = mongoose.model("ContactUs");

// add ContactUs
router.post("/add", async (req, res) => {
  try {
    log.debug("/add/ContactUs");
    const result = await commonController.add(ContactUs, req.body);
    response.successResponse(res, 200, MESSAGE.CONTACT_US_CREATED + result._id);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_CREATE_CONTACT_US);
  }
});

// get ContactUs
router.get("/get/:id", async (req, res) => {
  try {
    log.debug("/get/ContactUs", req.params.id);
    const result = await commonController.getOne(ContactUs, {
      _id: req.params.id,
    });
    response.successResponse(res, 200, result);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_CONTACT_US);
  }
});

// get all ContactUs
router.get("/getAll", async (req, res) => {
  try {
    log.debug("/getAll/ContactUs");
    const result = await commonController.getAll(ContactUs);
    response.successResponse(res, 200, result);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_CONTACT_US);
  }
});

// update ContactUs
router.put("/update/:id", async (req, res) => {
  try {
    log.debug("/update/ContactUs", req.params.id);
    const result = await commonController.updateBy(
      ContactUs,
      req.params.id,
      req.body
    );
    response.successResponse(
      res,
      200,
      MESSAGE.CONTACT_US_UPDATED + req.params.id
    );
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_UPDATE_CONTACT_US + req.params.id
    );
  }
});

// delete ContactUs
router.delete("/delete/:id", async (req, res) => {
  try {
    log.debug("/delete/ContactUs", req.params.id);
    const result = await commonController.delete(ContactUs, req.params.id);
    response.successResponse(res, 200, MESSAGE.CONTACT_US_DELETED);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_DELETE_CONTACT_US + req.params.id
    );
  }
});

module.exports = router;
