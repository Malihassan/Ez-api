const router = require("express").Router();
const commonController = require("../../controller/commonController");
const response = require("../../helper/response");
const MESSAGE = require("../../helper/message");
const log = require("../../helper/logger");
const mongoose = require("mongoose");
const Licence = mongoose.model("Licence");

// add Licence
router.post("/add", async (req, res) => {
  try {
    log.debug("/add/licence");
    const result = await commonController.add(Licence, { ...req.body, userId: req.userId });
    response.successResponse(res, 200, MESSAGE.LICENCE_CREATED + result._id);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_CREATE_LICENCE);
  }
});

// add multiple Licence
router.post("/add/multiple", async (req, res) => {
  try {
    log.debug("/add/multiple/licence");
    var obj = [];
    req.body.arrObj.forEach((element) => {
      obj.push({
        title: element.title,
        tradeCategoryId: element.tradeCategoryId,
        userId: req.userId
      });
    });
    console.log(obj);
    const responseObj = await Licence.insertMany(req.body.arrObj);
    response.successResponse(res, 200, MESSAGE.LICENCE_CREATED);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_CREATE_LICENCE);
  }
});

// get all Licence
router.get("/getAll", async (req, res) => {
  try {
    log.debug("/getAll/Licence");
    const field = req.query.field;
    const value = req.query.value;
    if (field && value) {
      const result = await commonController.getAllRecordBySorting(
        Licence,
        field,
        value,
        { userId: req.userId }
      );
      response.successResponse(res, 200, result);
    } else {
      const result = await commonController.getAll(Licence, { userId: req.userId });
      response.successResponse(res, 200, result);
    }
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_LICENCE);
  }
});

// router.get("/getAll", async (req, res) => {
//   try {
//     log.debug("/getAll/Licence");
//     const result = await commonController.getAllRecordSortedByPopulate(
//       Licence,
//       "tradeCategoryId",
//       "title"
//     );
//     response.successResponse(res, 200, result);
//   } catch (error) {
//     log.error(error);
//     response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_LICENCE);
//   }
// });

// get Licence
router.get("/get/:id", async (req, res) => {
  try {
    log.debug("/get/licence", req.params.id);
    const result = await commonController.getOne(Licence, {
      _id: req.params.id,
    });
    response.successResponse(res, 200, result);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_LICENCE);
  }
});

// update licence
router.put("/update/:id", async (req, res) => {
  try {
    log.debug("/update/licence", req.params.id);
    const result = await commonController.updateBy(
      Licence,
      req.params.id,
      req.body
    );
    response.successResponse(res, 200, MESSAGE.LICENCE_UPDATED + req.params.id);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_UPDATE_LICENCE + req.params.id
    );
  }
});

// delete licence
router.delete("/delete/:id", async (req, res) => {
  try {
    log.debug("/delete/licence", req.params.id);
    const result = await commonController.delete(Licence, req.params.id);
    response.successResponse(res, 200, MESSAGE.LICENCE_DELETED);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_DELETE_LICENCE + req.params.id
    );
  }
});

// router.get("/get/:trade", (req, res) => {
//   Licence.aggregate([
//     {
//       $match: {
//         tradeCategoryId: mongoose.Types.ObjectId(req.params.id),
//       },
//     },
//     {
//       $lookup: {
//         from: "tradecategories",
//         localField: "tradeCategoryId",
//         foreignField: "_id",
//         as: "tradecategories",
//       },
//     },
//     {
//       $unwind: "$tradecategories",
//     },
//     {
//       $group: {
//         _id: "$tradeCategoryId",
//         title: {
//           $title: "$tradecategories.title",
//         },
//         licenceData: {
//           $push: {
//             licence: "$title",
//           },
//         },
//       },
//     },
//   ])
//     .then((resData) => {
//       response.successResponse(res, 200, resData);
//     })
//     .catch((error) => {
//       console.log("error", error);
//       response.errorMsgResponse(res, 301, ERRORS.SOMETHING_WENT_WRONG);
//     });
// });

module.exports = router;
