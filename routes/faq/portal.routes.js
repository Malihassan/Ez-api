const router = require("express").Router();
const commonController = require("../../controller/commonController");
const response = require("../../helper/response");
const MESSAGE = require("../../helper/message");
const log = require("../../helper/logger");
const mongoose = require("mongoose");
const Portal = mongoose.model("Portal");
const FAQ = mongoose.model("FAQ");

// add Portal
router.post("/add", async (req, res) => {
  try {
    log.debug("/add/Portal");
    const result = await commonController.add(Portal, req.body);
    response.successResponse(res, 200, MESSAGE.PORTAL_CREATED + result._id);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_CREATE_PORTAL);
  }
});

//get all Portal
router.get("/getAll", async (req, res) => {
  try {
    log.debug("/getAll/Portal");
    const result = await commonController.getAll(Portal);
    response.successResponse(res, 200, result);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_PORTAL);
  }
});

// get Portal
router.get("/get/:id", async (req, res) => {
  try {
    log.debug("/get/portal", req.params.id);
    const result = await commonController.getOne(Portal, {
      _id: req.params.id,
    });
    response.successResponse(res, 200, result);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_PORTAL);
  }
});

router.get("/getAll/:id", async (req, res) => {
  try {
    const result = await commonController.getOne(Portal, {
      _id: req.params.id,
    });
    const faq = await commonController.getBy(FAQ, {
      portalId: result._id,
    });
    const responseObj = [
      {
        status: result.status,
        _id: result._id,
        title: result.title,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
        __v: 0,
        faq,
      },
    ];
    response.successResponse(res, 200, responseObj);
  } catch (error) {
    console.log(error);
    response.errorMsgResponse(res, 500, error);
  }
});

// update Portal
router.put("/update/:id", async (req, res) => {
  try {
    log.debug("/update/Portal", req.params.id);
    const result = await commonController.updateBy(
      Portal,
      req.params.id,
      req.body
    );
    response.successResponse(res, 200, MESSAGE.PORTAL_UPDATED + req.params.id);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_UPDATE_PORTAL + req.params.id
    );
  }
});

// delete Portal
router.delete("/delete/:id", async (req, res) => {
  try {
    log.debug("/delete/Portal", req.params.id);
    const result = await commonController.delete(Portal, req.params.id);
    response.successResponse(res, 200, MESSAGE.PORTAL_DELETED);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_DELETE_PORTAL + req.params.id
    );
  }
});

module.exports = router;
