const router = require("express").Router();
const commonController = require("../../controller/commonController");
const response = require("../../helper/response");
const MESSAGE = require("../../helper/message");
const log = require("../../helper/logger");
const mongoose = require("mongoose");
const TradeCategory = mongoose.model("TradeCategory");
const Licence = mongoose.model("Licence");

// add Trade category
router.post("/add", async (req, res) => {
  try {
    log.debug("/add/TradeCategory");
    let order = await commonController.count(TradeCategory, { userId: req.userId });

    if (!order) {
      order = 1;
    }
    let updateData = {
      ...req.body,
      order,
      userId: req.userId
    };
    const result = await commonController.add(TradeCategory, updateData);
    response.successResponse(
      res,
      200,
      MESSAGE.TRADE_CATEGORY_CREATED + result._id
    );
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_CREATE_TRADE_CATEGORY
    );
  }
});

// get all Trade category
router.get("/getAll", async (req, res) => {
  try {
    log.debug("/getAll/TradeCategory");
    const result = await commonController.getAllWithSort(TradeCategory, {
      order: 1,
    }, { userId: req.userId });
    response.successResponse(res, 200, result);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_TRADE_CATEGORY);
  }
});

// router.get("/getAll", async (req, res) => {
//   try {
//     log.debug("/getAll/TradeCategory");
//     const result = await commonController.getAllRecordSorted(
//       TradeCategory,
//       "title"
//     );
//     response.successResponse(res, 200, result);
//   } catch (error) {
//     log.error(error);
//     response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_TRADE_CATEGORY);
//   }
// });

// get Trade category
router.get("/get/:id", async (req, res) => {
  try {
    log.debug("/get/TradeCategory", req.params.id);
    const result = await commonController.getOne(TradeCategory, {
      _id: req.params.id,
    });
    response.successResponse(res, 200, result);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_TRADE_CATEGORY);
  }
});

// update Trade category
router.put("/update/:id", async (req, res) => {
  try {
    log.debug("/update/TradeCategory", req.params.id);
    const result = await commonController.updateBy(
      TradeCategory,
      req.params.id,
      req.body
    );
    response.successResponse(
      res,
      200,
      MESSAGE.TRADE_CATEGORY_UPDATED + req.params.id
    );
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_UPDATE_TRADE_CATEGORY + req.params.id
    );
  }
});

// delete Trade category
router.delete("/delete/:id", async (req, res) => {
  try {
    log.debug("/delete/TradeCategory", req.params.id);
    const result = await commonController.delete(TradeCategory, req.params.id);
    response.successResponse(res, 200, MESSAGE.TRADE_CATEGORY_DELETED);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_DELETE_TRADE_CATEGORY + req.params.id
    );
  }
});

// router.get("/getAll/:id", async (req, res) => {
//   try {
//     const licenceData = await commonController.getBy(Licence, req.params.id);
//     const responseObj = {
//       licenceData,
//     };
//     response.successResponse(res, 200, responseObj);
//   } catch (error) {
//     console.log(error);
//     response.errorMsgResponse(res, 500, error);
//   }
// });

router.get("/getAll/:id", async (req, res) => {
  try {
    const result = await commonController.getOne(TradeCategory, {
      _id: req.params.id,
    });
    const licenceData = await Licence.find({
      tradeCategoryId: { $all: [req.params.id] },
      status: { $eq: "active" },
    });
    response.successResponse(res, 200, licenceData);
  } catch (error) {
    console.log(error);
    response.errorMsgResponse(res, 500, error);
  }
});

//tradeCategoryUpdateAllByOrder
router.patch("/updateBy/order", async (req, res) => {
  try {
    log.debug("tradeCategory/updateBy/order");
    const { order } = req.body;
    const promises = order.map(async (o, index) => {
      let orderkey = index + 1;
      const promise = TradeCategory.updateOne(
        { _id: o._id },
        { $set: { order: orderkey } }
      );
      return promise;
    });
    const results = await Promise.all(promises);
    console.log(order, results);
    response.successResponse(
      res,
      200,
      "Trade Categories Order Updated Successfully!"
    );
    // TradeCategory.updateOne()
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_UPDATE_TRADE_CATEGORY
    );
  }
});

module.exports = router;
