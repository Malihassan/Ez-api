const router = require("express").Router();
const commonController = require("../../controller/commonController");
const response = require("../../helper/response");
const MESSAGE = require("../../helper/message");
const log = require("../../helper/logger");
const mongoose = require("mongoose");
const RiskAsstInstruction = mongoose.model("RiskAsstInstruction");
const auth = require("../../helper/auth");
// add Form Category
router.post("/add", auth, async (req, res) => {
  try {
    log.debug("/add/RiskAsstInstruction");
    const data = await RiskAsstInstruction.findOne({ userId: req.userId });
    console.log(data);
    if (data) {
      const getData = await RiskAsstInstruction.findOneAndDelete({
        _id: data.id,
      });
      const result = await commonController.add(RiskAsstInstruction, { ...req.body, userId: req.userId });
      response.successResponse(
        res,
        200,
        MESSAGE.RISK_ASSISTMENT_INSTRUCTION_CREATED + result._id
      );
    } else {
      const result = await commonController.add(RiskAsstInstruction, { ...req.body, userId: req.userId });
      response.successResponse(
        res,
        200,
        MESSAGE.RISK_ASSISTMENT_INSTRUCTION_CREATED + result._id
      );
    }
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_CREATE_RISK_ASSISTMENT_INSTRUCTION
    );
  }
});

// get all Form Category
router.get("/getAll", auth, async (req, res) => {
  try {
    log.debug("/getAll/RiskAsstInstruction");
    const result = await commonController.getAllSortReverse(
      RiskAsstInstruction,
      { userId: req.userId }
    );
    response.successResponse(res, 200, result);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_FETCH_RISK_ASSISTMENT_INSTRUCTION
    );
  }
});

// delete Form Category
router.delete("/delete/:id", async (req, res) => {
  try {
    log.debug("/delete/RiskAsstInstruction", req.params.id);
    const result = await commonController.delete(
      RiskAsstInstruction,
      req.params.id
    );
    response.successResponse(
      res,
      200,
      MESSAGE.RISK_ASSISTMENT_INSTRUCTION_DELETED
    );
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_DELETE_RISK_ASSISTMENT_INSTRUCTION + req.params.id
    );
  }
});

module.exports = router;
