const router = require("express").Router();
const commonController = require("../../controller/commonController");
const response = require("../../helper/response");
const MESSAGE = require("../../helper/message");
const log = require("../../helper/logger");
const mongoose = require("mongoose");
const Chemical = mongoose.model("Chemical");

// add Chemical
router.post("/add", async (req, res) => {
  try {
    log.debug("/add/Chemical");
    const result = await commonController.add(Chemical, { ...req.body, userId: req.userId });
    response.successResponse(res, 200, MESSAGE.CHEMICAL_CREATED + result._id);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_CREATE_CHEMICAL);
  }
});

// add multiple Chemical
router.post("/add/multiple", async (req, res) => {
  try {
    log.debug("/add/multiple/Chemical");
    var obj = [];
    req.body.arrObj.forEach((element) => {
      obj.push({
        title:
          element.title == undefined ? (element.title = "") : element.title,
        userId: req.userId
      });
    });
    console.log(obj);
    const responseObj = await Chemical.insertMany(obj);
    response.successResponse(res, 200, MESSAGE.CHEMICAL_CREATED);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_CREATE_CHEMICAL);
  }
});

// get all Chemical
router.get("/getAll", async (req, res) => {
  try {
    log.debug("/getAll/Chemical");
    const field = req.query.field;
    const value = req.query.value;
    if (field && value) {
      const result = await commonController.getAllRecordBySorting(
        Chemical,
        field,
        value,
        { userId: req.userId }
      );
      response.successResponse(res, 200, result);
    } else {
      const result = await commonController.getAll(Chemical, { userId: req.userId });
      response.successResponse(res, 200, result);
    }
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_CHEMICAL);
  }
});

// router.get("/getAll", async (req, res) => {
//   try {
//     log.debug("/getAll/Chemical");
//     const result = await commonController.getAllRecordSorted(Chemical, "title");
//     response.successResponse(res, 200, result);
//   } catch (error) {
//     log.error(error);
//     response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_CHEMICAL);
//   }
// });

// get Chemical
router.get("/get/:id", async (req, res) => {
  try {
    log.debug("/get/Chemical", req.params.id);
    const result = await commonController.getOne(Chemical, {
      _id: req.params.id,
    });
    response.successResponse(res, 200, result);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_CHEMICAL);
  }
});

// update Chemical
router.put("/update/:id", async (req, res) => {
  try {
    log.debug("/update/Chemical", req.params.id);
    const result = await commonController.updateBy(
      Chemical,
      req.params.id,
      req.body
    );
    response.successResponse(
      res,
      200,
      MESSAGE.CHEMICAL_UPDATED + req.params.id
    );
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_UPDATE_CHEMICAL + req.params.id
    );
  }
});

// delete Chemical
router.delete("/delete/:id", async (req, res) => {
  try {
    log.debug("/delete/Chemical", req.params.id);
    const result = await commonController.delete(Chemical, req.params.id);
    response.successResponse(res, 200, MESSAGE.CHEMICAL_DELETED);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_DELETE_CHEMICAL + req.params.id
    );
  }
});

module.exports = router;
