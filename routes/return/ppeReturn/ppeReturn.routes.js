const router = require("express").Router();
const commonController = require("../../../controller/commonController");
const response = require("../../../helper/response");
const MESSAGE = require("../../../helper/message");
const log = require("../../../helper/logger");
const auth = require("../../../helper/auth");
const mongoose = require("mongoose");
const PPEReturn = mongoose.model("PPEReturn");

// add ppe return
router.post("/add", auth, async (req, res) => {
  try {
    log.debug("/add/PPEReturn");
    const result = await commonController.add(PPEReturn, req.body);
    response.successResponse(res, 200, MESSAGE.PPE_RETURN_CREATED + result._id);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_CREATE_PPE_RETURN);
  }
});

//get all ppe return
router.get("/getAll", async (req, res) => {
  try {
    log.debug("/getAll/PPEReturn");

    if (req.designation == "ClientAdmin") {
      var validData = { clientAdminId: req.userId };
    } else {
      var validData = { userId: req.userId };
    }

    const field = req.query.field;
    const value = req.query.value;
    if (field && value) {
      const result =
        await commonController.getAuthNewRecordBySortingAndPopulate(
          PPEReturn,
          validData,
          "employeeId",
          field,
          value
        );
      response.successResponse(res, 200, result);
    } else {
      const result = await commonController.getAllAuthRecordByPopulate(
        PPEReturn,
        validData,
        "employeeId"
      );
      response.successResponse(res, 200, result);
    }
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_PPE_RETURN);
  }
});

// get ppe return
router.get("/get/:id", auth, async (req, res) => {
  try {
    log.debug("/get/PPEReturn", req.params.id);
    const result = await commonController.getOne(PPEReturn, {
      _id: req.params.id,
    });
    response.successResponse(res, 200, result);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_PPE_RETURN);
  }
});

// update ppe return
router.put("/update/:id", auth, async (req, res) => {
  try {
    log.debug("/update/PPEReturn", req.params.id);
    const result = await commonController.updateBy(
      PPEReturn,
      req.params.id,
      req.body
    );
    response.successResponse(
      res,
      200,
      MESSAGE.PPE_RETURN_UPDATED + req.params.id
    );
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_UPDATE_PPE_RETURN + req.params.id
    );
  }
});

// delete ppe return
router.delete("/delete/:id", async (req, res) => {
  try {
    log.debug("/delete/PPEReturn", req.params.id);
    const result = await commonController.delete(PPEReturn, req.params.id);
    response.successResponse(res, 200, MESSAGE.PPE_RETURN_DELETED);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_DELETE_PPE_RETURN + req.params.id
    );
  }
});

module.exports = router;
