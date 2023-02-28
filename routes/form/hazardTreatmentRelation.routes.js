const router = require("express").Router();
const commonController = require("../../controller/commonController");
const response = require("../../helper/response");
const MESSAGE = require("../../helper/message");
const log = require("../../helper/logger");
const mongoose = require("mongoose");
const HazardTreatmentRelation = mongoose.model("HazardTreatmentRelation");

// add Hazard Treatment Relation
router.post("/add", async (req, res) => {
  try {
    log.debug("/add/HazardTreatmentRelation");
    const result = await commonController.add(
      HazardTreatmentRelation,
      { ...req.body, userId: req.userId }
    );
    response.successResponse(
      res,
      200,
      MESSAGE.HAZARD_TREATMENT_RELATION_CREATED + result._id
    );
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_CREATE_HAZARD_TREATMENT_RELATION
    );
  }
});

//get all Hazard Treatment Relation
router.get("/getAll", async (req, res) => {
  try {
    log.debug("/getAll/HazardTreatmentRelation");
    const result = await commonController.getAll(HazardTreatmentRelation, { userId: req.userId });
    response.successResponse(res, 200, result);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_FETCH_HAZARD_TREATMENT_RELATION
    );
  }
});

// get Hazard Treatment Relation
router.get("/get/:id", async (req, res) => {
  try {
    log.debug("/get/HazardTreatmentRelation", req.params.id);
    const result = await commonController.getOne(HazardTreatmentRelation, {
      _id: req.params.id,
    });
    response.successResponse(res, 200, result);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_FETCH_HAZARD_TREATMENT_RELATION
    );
  }
});

// update Hazard Treatment Relation
router.put("/update/:id", async (req, res) => {
  try {
    log.debug("/update/HazardTreatmentRelation", req.params.id);
    const result = await commonController.updateBy(
      HazardTreatmentRelation,
      req.params.id,
      req.body
    );
    response.successResponse(
      res,
      200,
      MESSAGE.HAZARD_TREATMENT_RELATION_UPDATED + req.params.id
    );
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_UPDATE_HAZARD_TREATMENT_RELATION + req.params.id
    );
  }
});

// // delete Hazard Treatment Relation
// router.delete("/delete/:id", async (req, res) => {
//   try {
//     log.debug("/delete/HazardTreatmentRelation", req.params.id);
//     const result = await commonController.delete(
//       HazardTreatmentRelation,
//       req.params.id
//     );
//     response.successResponse(
//       res,
//       200,
//       MESSAGE.HAZARD_TREATMENT_RELATION_DELETED
//     );
//   } catch (error) {
//     log.error(error);
//     response.errorMsgResponse(
//       res,
//       500,
//       MESSAGE.UNABLE_TO_DELETE_HAZARD_TREATMENT_RELATION + req.params.id
//     );
//   }
// });

module.exports = router;
