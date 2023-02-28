const router = require("express").Router();
const commonController = require("../../controller/commonController");
const response = require("../../helper/response");
const MESSAGE = require("../../helper/message");
const log = require("../../helper/logger");
const auth = require("../../helper/auth");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const Department = mongoose.model("Department");

//add Department
router.post("/add", auth, async (req, res) => {
  try {
    log.debug("/add/Department");
    // let data = req.body;
    // const userData = await commonController.getBy(Department, {
    //   clientAdminId: req.userId,
    // });

    // if (userData) {
    //   let dataArr = userData.forEach((item) => {
    //     item.departmentName;
    //   });
    //   console.log(dataArr);
    // }
    const result = await commonController.add(Department, req.body);
    response.successResponse(res, 200, MESSAGE.DEPARTMENT_CREATED + result._id);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_CREATE_DEPARTMENT);
  }
});

// get all Department
router.get("/getAll", auth, async (req, res) => {
  try {
    log.debug("/getAll/Department");
    if (req.designation == "User") {
      const userData = await commonController.getOne(User, { _id: req.userId });
      const result = await commonController.getBy(Department, {
        clientAdminId: userData.clientAdminId,
      });
      response.successResponse(res, 200, result);
    } else {
      const result = await commonController.getBy(Department, {
        clientAdminId: req.userId,
      });
      response.successResponse(res, 200, result);
    }
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_DEPARTMENT);
  }
});

// get Department
router.get("/get/:id", auth, async (req, res) => {
  try {
    log.debug("/get/Department", req.params.id);
    const result = await commonController.getOne(Department, {
      _id: req.params.id,
    });
    response.successResponse(res, 200, result);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_DEPARTMENT);
  }
});

// update Department
router.put("/update/:id", auth, async (req, res) => {
  try {
    log.debug("/update/Department", req.params.id);
    const result = await commonController.updateBy(
      Department,
      req.params.id,
      req.body
    );
    response.successResponse(
      res,
      200,
      MESSAGE.DEPARTMENT_UPDATED + req.params.id
    );
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_UPDATE_DEPARTMENT + req.params.id
    );
  }
});

// delete Department
router.delete("/delete/:id", async (req, res) => {
  try {
    log.debug("/delete/Department", req.params.id);
    const result = await commonController.delete(Department, req.params.id);
    response.successResponse(res, 200, MESSAGE.DEPARTMENT_DELETED);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_DELETE_DEPARTMENT + req.params.id
    );
  }
});

module.exports = router;
