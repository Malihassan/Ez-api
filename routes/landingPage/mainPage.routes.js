const router = require("express").Router();
const commonController = require("../../controller/commonController");
const response = require("../../helper/response");
const MESSAGE = require("../../helper/message");
const log = require("../../helper/logger");
const mongoose = require("mongoose");
const { result } = require("lodash");
const MainPage = mongoose.model("MainPage");

// add main page
router.post("/add", async (req, res) => {
  try {
    log.debug("/add/mainPage");
    const getData = await MainPage.findOne();
    if (getData) {
      const deletData = await MainPage.findOneAndDelete({
        _id: getData._id,
      });
      const result = await commonController.add(MainPage, req.body);
      response.successResponse(
        res,
        200,
        MESSAGE.MAIN_PAGE_CREATED + result._id
      );
    } else {
      const result = await commonController.add(MainPage, req.body);
      response.successResponse(
        res,
        200,
        MESSAGE.MAIN_PAGE_CREATED + result._id
      );
    }
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_CREATE_MAIN_PAGE);
  }
});

// get main page
router.get("/get", async (req, res) => {
  try {
    log.debug("/getAll/mainPage");
    const result = await MainPage.findOne();
    response.successResponse(res, 200, result);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_MAIN_PAGE);
  }
});

router.get("/get/:id", async (req, res) => {
  try {
    log.debug("/get/mainPage", req.params.id);
    const result = await commonController.getOne(MainPage, {
      _id: req.params.id,
    });
    response.successResponse(res, 200, result);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_MAIN_PAGE);
  }
});

// update main page
router.put("/update/:id", async (req, res) => {
  try {
    log.debug("/update/mainPage", req.params.id);
    const result = await commonController.updateBy(
      MainPage,
      req.params.id,
      req.body
    );
    response.successResponse(
      res,
      200,
      MESSAGE.MAIN_PAGE_UPDATED + req.params.id
    );
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_UPDATE_MAIN_PAGE + req.params.id
    );
  }
});

// delete main page
router.delete("/delete/:id", async (req, res) => {
  try {
    log.debug("/delete/mainPage", req.params.id);
    const result = await commonController.delete(MainPage, req.params.id);
    response.successResponse(res, 200, MESSAGE.MAIN_PAGE_DELETED);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_DELETE_MAIN_PAGE + req.params.id
    );
  }
});

module.exports = router;
