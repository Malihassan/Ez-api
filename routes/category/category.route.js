const router = require("express").Router();
const commonController = require("../../controller/commonController");
const response = require("../../helper/response");
const MESSAGE = require("../../helper/message");
const log = require("../../helper/logger");
const mongoose = require("mongoose");
const Category = mongoose.model("Category");
var ObjectId = require("mongodb").ObjectId;

// add category
router.post("/add", async (req, res) => {
  try {
    log.debug("/add/category");
    const result = await commonController.add(Category, req.body);
    response.successResponse(res, 200, MESSAGE.CATEGORY_CREATED + result._id);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_CREATE_CATEGORY);
  }
});

//get all categories
// router.get("/getAll", async (req, res) => {
//   try {
//     log.debug("/getAll/category");
//     const data = req.params.field && req.params.value;
//     if (data) {
//       console.log("==============>>>>>>>>>>>", data);
//       const result = await commonController.getAllRecordBySorting(
//         Category,
//         data
//       );
//       response.successResponse(res, 200, result);
//     } else {
//       const result = await commonController.getAllRecordBySorting(Category);
//       response.successResponse(res, 200, result);
//     }
//   } catch (error) {
//     log.error(error);
//     response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_CATEGORY);
//   }
// });

router.get("/getAllNewRecords", async (req, res) => {
  try {
    log.debug("/getAll/category");
    const field = req.query.field;
    const value = req.query.value;
    if (field && value) {
      const result = await commonController.getAllNewRecordBySorting(
        Category,
        field,
        value
      );
      response.successResponse(res, 200, result);
    } else {
      const result = await commonController.getAllNewRecord(Category);
      response.successResponse(res, 200, result);
    }
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_CATEGORY);
  }
});

router.get("/getAllOldRecords", async (req, res) => {
  try {
    log.debug("/getAll/category");
    const field = req.query.field;
    const value = req.query.value;
    if (field && value) {
      const result = await commonController.getOldRecordBySorting(
        Category,
        field,
        value
      );
      response.successResponse(res, 200, result);
    } else {
      const result = await commonController.getAllOldRecord(Category);
      response.successResponse(res, 200, result);
    }
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_CATEGORY);
  }
});

// //get all categories
// router.get("/getAll", async (req, res) => {
//   try {
//     log.debug("/getAll/category");
//     const result = await commonController.getAllRecordBySorting(Category);
//     response.successResponse(res, 200, result);
//   } catch (error) {
//     log.error(error);
//     response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_CATEGORY);
//   }
// });

// get category
router.get("/get/:id", async (req, res) => {
  try {
    log.debug("/get/category", req.params.id);
    const result = await commonController.getOne(Category, {
      _id: req.params.id,
    });
    response.successResponse(res, 200, result);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_CATEGORY);
  }
});

// update category
router.put("/update/:id", async (req, res) => {
  try {
    log.debug("/update/category", req.params.id);
    const categoryResult = await commonController.getOne(Category, {
      _id: req.params.id,
    });
    if (categoryResult) {
      const newData = {
        title: categoryResult.title,
        updated: "true",
      };
      console.log("=======>>>>>>", newData);
      const data = await commonController.add(Category, newData);
    }
    const result = await commonController.updateBy(
      Category,
      req.params.id,
      req.body
    );
    response.successResponse(
      res,
      200,
      MESSAGE.CATEGORY_UPDATED + req.params.id
    );
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_UPDATE_CATEGORY + req.params.id
    );
  }
});

// delete category
router.delete("/delete/:id", async (req, res) => {
  try {
    log.debug("/delete/category", req.params.id);
    const result = await commonController.delete(Category, req.params.id);
    response.successResponse(res, 200, MESSAGE.CATEGORY_DELETED);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_DELETE_CATEGORY + req.params.id
    );
  }
});

module.exports = router;
