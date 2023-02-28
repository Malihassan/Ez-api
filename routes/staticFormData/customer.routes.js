const router = require("express").Router();
const commonController = require("../../controller/commonController");
const response = require("../../helper/response");
const MESSAGE = require("../../helper/message");
const log = require("../../helper/logger");
const mongoose = require("mongoose");
const Customer = mongoose.model("Customer");

// add Customer
router.post("/add", async (req, res) => {
  try {
    log.debug("/add/Customer");
    const result = await commonController.add(Customer, { ...req.body, userId: req.userId });
    response.successResponse(res, 200, MESSAGE.CUSTOMER_CREATED + result._id);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_CREATE_CUSTOMER);
  }
});

//get all Customer

router.get("/getAll", async (req, res) => {
  try {
    log.debug("/getAll/Customer");
    const field = req.query.field;
    const value = req.query.value;
    if (field && value) {
      const result = await commonController.getRecordsSortedWithPopulate(
        Customer,
        "stateId",
        field,
        value,
        { userId: req.userId }
      );
      response.successResponse(res, 200, result);
    } else {
      const result = await commonController.getAll(Customer, { userId: req.userId });
      response.successResponse(res, 200, result);
    }
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_CUSTOMER);
  }
});

// router.get("/getAll", async (req, res) => {
//   try {
//     log.debug("/getAll/Customer");
//     const result = await commonController.getAllRecordSortedByPopulate(
//       Customer,
//       "stateId",
//       "customerName"
//     );
//     response.successResponse(res, 200, result);
//   } catch (error) {
//     log.error(error);
//     response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_CUSTOMER);
//   }
// });

// get Customer
router.get("/get/:id", async (req, res) => {
  try {
    log.debug("/get/Customer", req.params.id);
    const result = await commonController.getOne(Customer, {
      _id: req.params.id,
    });
    response.successResponse(res, 200, result);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_CUSTOMER);
  }
});

// update Customer
router.put("/update/:id", async (req, res) => {
  try {
    log.debug("/update/Customer", req.params.id);
    const result = await commonController.updateBy(
      Customer,
      req.params.id,
      req.body
    );
    response.successResponse(
      res,
      200,
      MESSAGE.CUSTOMER_UPDATED + req.params.id
    );
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_UPDATE_CUSTOMER + req.params.id
    );
  }
});

// delete Customer
router.delete("/delete/:id", async (req, res) => {
  try {
    log.debug("/delete/Customer", req.params.id);
    const result = await commonController.delete(Customer, req.params.id);
    response.successResponse(res, 200, MESSAGE.CUSTOMER_DELETED);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_DELETE_CUSTOMER + req.params.id
    );
  }
});

module.exports = router;
