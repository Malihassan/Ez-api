const router = require("express").Router();
const commonController = require("../../controller/commonController");
const response = require("../../helper/response");
const MESSAGE = require("../../helper/message");
const log = require("../../helper/logger");
const mongoose = require("mongoose");
const ProjectManager = mongoose.model("ProjectManager");

// add Project Manager
router.post("/add", async (req, res) => {
  try {
    log.debug("/add/ProjectManager");
    const result = await commonController.add(ProjectManager, { ...req.body, userId: req.userId });
    response.successResponse(
      res,
      200,
      MESSAGE.PROJECT_MANAGER_CREATED + result._id
    );
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_CREATE_PROJECT_MANAGER
    );
  }
});

// add multiple project manager
router.post("/add/multiple", async (req, res) => {
  try {
    log.debug("/add/multiple/ProjectManager");
    var obj = [];
    req.body.arrObj.forEach((element) => {
      obj.push({
        title:
          element.title == undefined ? (element.title = "") : element.title,
        userId: req.userId
      });
    });
    console.log(obj);
    const responseObj = await ProjectManager.insertMany(obj);
    response.successResponse(res, 200, MESSAGE.PROJECT_MANAGER_CREATED);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_CREATE_PROJECT_MANAGER
    );
  }
});

//get all Project Manager

router.get("/getAll", async (req, res) => {
  try {
    log.debug("/getAll/ProjectManager");
    const field = req.query.field;
    const value = req.query.value;
    if (field && value) {
      const result = await commonController.getAllRecordBySorting(
        ProjectManager,
        field,
        value,
        { userId: req.userId }
      );
      response.successResponse(res, 200, result);
    } else {
      const result = await commonController.getAll(ProjectManager, { userId: req.userId });
      response.successResponse(res, 200, result);
    }
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_FETCH_PROJECT_MANAGER
    );
  }
});

// router.get("/getAll", async (req, res) => {
//   try {
//     log.debug("/getAll/ProjectManager");
//     const result = await commonController.getAllRecordSorted(
//       ProjectManager,
//       "title"
//     );
//     response.successResponse(res, 200, result);
//   } catch (error) {
//     log.error(error);
//     response.errorMsgResponse(
//       res,
//       500,
//       MESSAGE.UNABLE_TO_FETCH_PROJECT_MANAGER
//     );
//   }
// });

// get Project Manager
router.get("/get/:id", async (req, res) => {
  try {
    log.debug("/get/projectManager", req.params.id);
    const result = await commonController.getOne(ProjectManager, {
      _id: req.params.id,
    });
    response.successResponse(res, 200, result);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_FETCH_PROJECT_MANAGER
    );
  }
});

// update Project Manager
router.put("/update/:id", async (req, res) => {
  try {
    log.debug("/update/projectManager", req.params.id);
    const result = await commonController.updateBy(
      ProjectManager,
      req.params.id,
      req.body
    );
    response.successResponse(
      res,
      200,
      MESSAGE.PROJECT_MANAGER_UPDATED + req.params.id
    );
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_UPDATE_PROJECT_MANAGER + req.params.id
    );
  }
});

// delete Project Manager
router.delete("/delete/:id", async (req, res) => {
  try {
    log.debug("/delete/projectManager", req.params.id);
    const result = await commonController.delete(ProjectManager, req.params.id);
    response.successResponse(res, 200, MESSAGE.PROJECT_MANAGER_DELETED);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_DELETE_PROJECT_MANAGER + req.params.id
    );
  }
});

module.exports = router;
