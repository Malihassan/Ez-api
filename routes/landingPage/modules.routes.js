const router = require("express").Router();
const commonController = require("../../controller/commonController");
const response = require("../../helper/response");
const MESSAGE = require("../../helper/message");
const log = require("../../helper/logger");
const mongoose = require("mongoose");
const { result } = require("lodash");
const Module = mongoose.model("Module");
const SubModule = mongoose.model("SubModule");

// add module
router.post("/add", async (req, res) => {
  try {
    log.debug("/add/module");
    const data = await commonController.getOne(Module, { mode: req.body.mode });
    if (data) {
      const resData = await Module.findOneAndDelete({ mode: req.body.mode });
      const result = await commonController.add(Module, req.body);
      response.successResponse(res, 200, MESSAGE.MODULE_CREATED + result._id);
    } else {
      const result = await commonController.add(Module, req.body);
      response.successResponse(res, 200, MESSAGE.MODULE_CREATED + result._id);
    }
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_CREATE_MODULE);
  }
});

// add module with multiple sub-module
router.post("/multiple", async (req, res) => {
  try {
    log.debug("/multiple/add");
    const reqObj = {
      title: req.body.title,
      description: req.body.description,
      mode: req.body.mode,
    };
    const data = await commonController.getOne(Module, { mode: req.body.mode });
    if (data) {
      const resData = await Module.findOneAndDelete({ mode: req.body.mode });
      const result = await commonController.add(Module, reqObj);
      var obj = [];
      req.body.arrObj.forEach((element) => {
        obj.push({
          moduleId: result._id,
          title:
            element.title == undefined ? (element.title = "") : element.title,
          subTitle:
            element.subTitle == undefined
              ? (element.subTitle = "")
              : element.subTitle,
          description:
            element.description == undefined
              ? (element.description = "")
              : element.description,
          fileUrl:
            element.fileUrl == undefined
              ? (element.fileUrl = "")
              : element.fileUrl,
        });
      });
      const responseObj = await SubModule.insertMany(obj);
      response.successResponse(res, 200, MESSAGE.MODULE_CREATED + result._id);
    } else {
      const result = await commonController.add(Module, reqObj);
      var obj = [];
      req.body.arrObj.forEach((element) => {
        obj.push({
          moduleId: result._id,
          title:
            element.title == undefined ? (element.title = "") : element.title,
          subTitle:
            element.subTitle == undefined
              ? (element.subTitle = "")
              : element.subTitle,
          description:
            element.description == undefined
              ? (element.description = "")
              : element.description,
          fileUrl:
            element.fileUrl == undefined
              ? (element.fileUrl = "")
              : element.fileUrl,
        });
      });
      const resData = await SubModule.insertMany(obj);
      response.successResponse(res, 200, MESSAGE.MODULE_CREATED + result._id);
    }
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_CREATE_MODULE);
  }
});

// get module
router.get("/get/:id", async (req, res) => {
  try {
    log.debug("/get/Module", req.params.id);
    const result = await commonController.getOne(Module, {
      _id: req.params.id,
    });
    response.successResponse(res, 200, result);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_MODULE);
  }
});

// update module
router.put("/update/:id", async (req, res) => {
  try {
    log.debug("/update/Module", req.params.id);
    const result = await commonController.updateBy(
      Module,
      req.params.id,
      req.body
    );
    response.successResponse(res, 200, MESSAGE.MODULE_UPDATED + req.params.id);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_UPDATE_MODULE + req.params.id
    );
  }
});

// delete module
router.delete("/delete/:id", async (req, res) => {
  try {
    log.debug("/delete/Module", req.params.id);
    const result = await commonController.delete(Module, req.params.id);
    response.successResponse(res, 200, MESSAGE.MODULE_DELETED);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_DELETE_MODULE + req.params.id
    );
  }
});

// router.get("/get/data/:mode", async (req, res) => {
//   try {
//     const result = await Module.aggregate([
//       {
//         $match: {
//           $and: [
//             {
//               mode: req.params.mode,
//             },
//             {
//               status: { $ne: "deleted" },
//             },
//           ],
//         },
//       },
//       {
//         $lookup: {
//           from: "submodules",
//           localField: "_id",
//           foreignField: "moduleId",
//           // let: {
//           //   moduleId: "$moduleId",
//           // },
//           as: "subModules",
//           // pipeline: [
//           //   {
//           //     $match: {
//           //       $expr: {
//           //         $and: [
//           //           {
//           //             $eq: ["$moduleId", "$moduleId"],
//           //           },
//           //           {
//           //             $eq: ["$status", "active"],
//           //           },
//           //         ],
//           //       },
//           //     },
//           //   },
//           // ],
//         },
//       },
//     ]);
//     response.successResponse(res, 200, result);
//   } catch (error) {
//     response.errorMsgResponse(res, 500, error);
//   }
// });

router.get("/get/data/:mode", async (req, res) => {
  try {
    log.debug("/get/Module", req.params.mode);
    const result = await commonController.getOne(Module, {
      mode: req.params.mode,
    });
    const subModules = await commonController.getBy(SubModule, {
      moduleId: result._id,
    });
    const responseObj = [
      {
        status: result.status,
        _id: result._id,
        title: result.title,
        description: result.description,
        mode: result.mode,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
        __v: 0,
        subModules,
      },
    ];
    response.successResponse(res, 200, responseObj);
  } catch (error) {
    console.log(error);
    response.errorMsgResponse(res, 500, error);
  }
});

module.exports = router;
