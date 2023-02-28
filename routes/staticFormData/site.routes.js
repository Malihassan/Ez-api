const router = require("express").Router();
const commonController = require("../../controller/commonController");
const response = require("../../helper/response");
const MESSAGE = require("../../helper/message");
const log = require("../../helper/logger");
const mongoose = require("mongoose");
const Site = mongoose.model("Site");

// add Site
router.post("/add", async (req, res) => {
  try {
    log.debug("/add/Site");
    const result = await commonController.add(Site, { ...req.body, userId: req.userId });
    response.successResponse(res, 200, MESSAGE.SITE_CREATED + result._id);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_CREATE_SITE);
  }
});

//get all Site
// router.get("/getAll", async (req, res) => {
//   try {
//     log.debug("/getAll/Site");
//     const result = await commonController.getAllRecordSortedByPopulate(
//       Site,
//       "stateId",
//       "siteName"
//     );
//     response.successResponse(res, 200, result);
//   } catch (error) {
//     log.error(error);
//     response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_SITE);
//   }
// });

//get all Site
router.get("/getAll", async (req, res) => {
  try {
    log.debug("/getAll/Site");
    const field = req.query.field;
    const value = req.query.value;
    if (field && value) {
      const result = await commonController.getRecordsSortedWithPopulate(
        Site,
        "stateId",
        field,
        value,
        { userId: req.userId }
      );
      response.successResponse(res, 200, result);
    } else {
      const result = await commonController.getAllRecordByPopulate(
        Site,
        "stateId",
        { userId: req.userId }
      );
      response.successResponse(res, 200, result);
    }
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_SITE);
  }
});

// get Site
router.get("/get/:id", async (req, res) => {
  try {
    log.debug("/get/Site", req.params.id);
    const result = await commonController.getOne(Site, {
      _id: req.params.id,
    });
    response.successResponse(res, 200, result);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_SITE);
  }
});

// update Site
router.put("/update/:id", async (req, res) => {
  try {
    log.debug("/update/Site", req.params.id);
    const result = await commonController.updateBy(
      Site,
      req.params.id,
      req.body
    );
    response.successResponse(res, 200, MESSAGE.SITE_UPDATED + req.params.id);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_UPDATE_SITE + req.params.id
    );
  }
});

// delete Site
router.delete("/delete/:id", async (req, res) => {
  try {
    log.debug("/delete/Site", req.params.id);
    const result = await commonController.delete(Site, req.params.id);
    response.successResponse(res, 200, MESSAGE.SITE_DELETED);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_DELETE_SITE + req.params.id
    );
  }
});

module.exports = router;
