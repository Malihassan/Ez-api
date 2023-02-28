const router = require("express").Router();
const commonController = require("../../controller/commonController");
const response = require("../../helper/response");
const MESSAGE = require("../../helper/message");
const log = require("../../helper/logger");
const mongoose = require("mongoose");
const ControlActionRequired = mongoose.model("ControlActionRequired");

// add Control Action Required
router.post("/add", async (req, res) => {
  try {
    log.debug("/add/controlActionRequired");
    const result = await commonController.add(ControlActionRequired, { ...req.body, userId: req.userId });
    response.successResponse(
      res,
      200,
      MESSAGE.CONTROL_ACTION_REQUIRED_CREATED + result._id
    );
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_CREATE_CONTROL_ACTION_REQUIRED
    );
  }
});

// add multiple Control Action Required
router.post("/add/multiple", async (req, res) => {
  try {
    log.debug("/add/multiple/ControlActionRequired");
    var obj = [];
    req.body.arrObj.forEach((element) => {
      obj.push({
        title:
          element.title == undefined ? (element.title = "") : element.title,
        userId: req.userId
      });
    });
    console.log(obj);
    const responseObj = await ControlActionRequired.insertMany(obj);
    response.successResponse(res, 200, MESSAGE.CONTROL_ACTION_REQUIRED_CREATED);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_CREATE_CONTROL_ACTION_REQUIRED
    );
  }
});

// get all Control Action Required
router.get("/getAll", async (req, res) => {
  try {
    log.debug("/getAll/ControlActionRequired");
    const field = req.query.field;
    const value = req.query.value;
    if (field && value) {
      const result = await commonController.getAllRecordBySorting(
        ControlActionRequired,
        field,
        value,
        { userId: req.userId }
      );
      response.successResponse(res, 200, result);
    } else {
      const result = await commonController.getAll(ControlActionRequired, { userId: req.userId });
      response.successResponse(res, 200, result);
    }
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_FETCH_CONTROL_ACTION_REQUIRED
    );
  }
});

// router.get("/getAll", async (req, res) => {
//   try {
//     log.debug("/getAll/ControlActionRequired");
//     const result = await commonController.getAllRecordSorted(
//       ControlActionRequired,
//       "title"
//     );
//     response.successResponse(res, 200, result);
//   } catch (error) {
//     log.error(error);
//     response.errorMsgResponse(
//       res,
//       500,
//       MESSAGE.UNABLE_TO_FETCH_CONTROL_ACTION_REQUIRED
//     );
//   }
// });

// get Control Action Required
router.get("/get/:id", async (req, res) => {
  try {
    log.debug("/get/ControlActionRequired", req.params.id);
    const result = await commonController.getOne(ControlActionRequired, {
      _id: req.params.id,
    });
    response.successResponse(res, 200, result);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_FETCH_CONTROL_ACTION_REQUIRED
    );
  }
});

// update Control Action Required
router.put("/update/:id", async (req, res) => {
  try {
    log.debug("/update/ControlActionRequired", req.params.id);
    const result = await commonController.updateBy(
      ControlActionRequired,
      req.params.id,
      req.body
    );
    response.successResponse(
      res,
      200,
      MESSAGE.CONTROL_ACTION_REQUIRED_UPDATED + req.params.id
    );
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_UPDATE_CONTROL_ACTION_REQUIRED + req.params.id
    );
  }
});

// delete Control Action Required
router.delete("/delete/:id", async (req, res) => {
  try {
    log.debug("/delete/ControlActionRequired", req.params.id);
    const result = await commonController.delete(
      ControlActionRequired,
      req.params.id
    );
    response.successResponse(res, 200, MESSAGE.CONTROL_ACTION_REQUIRED_DELETED);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_DELETE_CONTROL_ACTION_REQUIRED + req.params.id
    );
  }
});

//controlActionUpdateAll
router.patch("/updateAll", async (req, res) => {
  try {
    log.debug("controlActionUpdateAll");
    const { order, jobTaskId } = req.body;
    console.log(order, jobTaskId);
    const promises = order.map(async (o, index) => {
      // let orderkey = index + 1;
      const promise = ControlActionRequired.updateOne(
        { _id: o._id },
        { $set: { jobTaskId: o.jobTaskId } }
      );
      return promise;
    });

    const results = await Promise.all(promises);
    console.log(order, results);
    response.successResponse(res, 200, { data: results });
    // TradeCategory.updateOne()
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_FETCH_CONTROL_ACTION_REQUIRED
    );
  }
});

module.exports = router;
