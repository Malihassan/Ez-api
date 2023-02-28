const router = require("express").Router();
const commonController = require("../../controller/commonController");
const response = require("../../helper/response");
const MESSAGE = require("../../helper/message");
const log = require("../../helper/logger");
const mongoose = require("mongoose");
const Employee = mongoose.model("Employee");
const Role = mongoose.model("Role");

// add employee
router.post("/add", async (req, res) => {
  try {
    log.debug("/add/employee");
    const result = await commonController.add(Employee, req.body);
    response.successResponse(res, 200, MESSAGE.EMPLOYEE_CREATED + result._id);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_CREATE_EMPLOYEE);
  }
});

//get all employee
router.get("/getAll", async (req, res) => {
  try {
    log.debug("/add/employee");
    const result = await commonController.getAllRecordByPopulate(
      Employee,
      "roleId"
    );
    response.successResponse(res, 200, result);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_EMPLOYEE);
  }
});

// get employee
router.get("/get/:id", async (req, res) => {
  try {
    log.debug("/get/employee", req.params.id);
    const result = await commonController.getOne(Employee, {
      _id: req.params.id,
    });
    response.successResponse(res, 200, result);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_EMPLOYEE);
  }
});

// update employee
router.put("/update/:id", async (req, res) => {
  try {
    log.debug("/update/employee", req.params.id);
    const result = await commonController.updateBy(
      Employee,
      req.params.id,
      req.body
    );
    response.successResponse(
      res,
      200,
      MESSAGE.EMPLOYEE_UPDATED + req.params.id
    );
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_UPDATE_EMPLOYEE + req.params.id
    );
  }
});

// get employee by role Id
router.get("/getByRole/:id", async (req, res) => {
  try {
    log.debug("/getByRoleId ", req.params.id);
    const data = await commonController.getOne(Role, { _id: req.params.id });
    const result = await commonController.getBy(Employee, { roleId: data._id });
    console.log(result);
    response.successResponse(res, 200, result);
  } catch (error) {
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_EMPLOYEE);
  }
});

// delete employee
router.delete("/delete/:id", async (req, res) => {
  try {
    log.debug("/delete/employee", req.params.id);
    const result = await commonController.delete(Employee, req.params.id);
    response.successResponse(res, 200, MESSAGE.EMPLOYEE_DELETED);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_DELETE_EMPLOYEE + req.params.id
    );
  }
});

module.exports = router;
