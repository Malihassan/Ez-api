const router = require("express").Router();
const commonController = require("../../controller/commonController");
const response = require("../../helper/response");
const MESSAGE = require("../../helper/message");
const log = require("../../helper/logger");
const mongoose = require("mongoose");
const { result } = require("lodash");
const Team = mongoose.model("Team");

// add Team
router.post("/add", async (req, res) => {
  try {
    log.debug("/add/Team");
    const data = await Team.findOne();
    if (data) {
      const deleteData = await Team.findOneAndDelete({ _id: data._id });
      const result = await commonController.add(Team, req.body);
      response.successResponse(res, 200, MESSAGE.TEAM_CREATED + result._id);
    } else {
      const result = await commonController.add(Team, req.body);
      response.successResponse(res, 200, MESSAGE.TEAM_CREATED + result._id);
    }
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_CREATE_TEAM);
  }
});

// get Team
router.get("/get/:id", async (req, res) => {
  try {
    log.debug("/get/Team", req.params.id);
    const result = await commonController.getOne(Team, {
      _id: req.params.id,
    });
    response.successResponse(res, 200, result);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_TEAM);
  }
});

// get all team
// router.get("/getAll", async (req, res) => {
//   try {
//     log.debug("/getAll");
//     const result = await commonController.getAll(Team);
//     response.successResponse(res, 200, result);
//   } catch (error) {
//     log.error(error);
//     response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_TEAM);
//   }
// });

// update Team
router.put("/update/:id", async (req, res) => {
  try {
    log.debug("/update/Team", req.params.id);
    const result = await commonController.updateBy(
      Team,
      req.params.id,
      req.body
    );
    response.successResponse(res, 200, MESSAGE.TEAM_UPDATED + req.params.id);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_UPDATE_TEAM + req.params.id
    );
  }
});

// delete Team
router.delete("/delete/:id", async (req, res) => {
  try {
    log.debug("/delete/Team", req.params.id);
    const result = await commonController.delete(Team, req.params.id);
    response.successResponse(res, 200, MESSAGE.TEAM_DELETED);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_DELETE_TEAM + req.params.id
    );
  }
});

module.exports = router;
