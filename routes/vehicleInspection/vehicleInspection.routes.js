const router = require("express").Router();
const commonController = require("../../controller/commonController");
const response = require("../../helper/response");
const MESSAGE = require("../../helper/message");
const log = require("../../helper/logger");
const auth = require("../../helper/auth");
const _ = require("lodash");
const mongoose = require("mongoose");
const VehicleInspection = mongoose.model("VehicleInspection");

// add VEHICLE Inspection
router.post("/add", auth, async (req, res) => {
    try {
        log.debug("/add/VehicleInspection");
        const obj = req.body;
        const createdByData = req.designation;
        const data = await VehicleInspection.find({ updated: "false" })
            .sort({ _id: -1 })
            .limit(1);
        if (data != 0) {
            const index = data[0].formId.split("-")[1];
            const objWithIndex = Object.assign(
                { formId: `WHS_VI-${parseInt(index) + 1}` },
                { createdBy: createdByData },
                obj
            );
            const result = await commonController.add(VehicleInspection, objWithIndex);
            response.successResponse(
                res,
                200,
                MESSAGE.VEHICLE_INSPECTION_CREATED + result._id
            );
        } else {
            const objWithIndex = Object.assign(
                { formId: `WHS_VI-${1}` },
                { createdBy: createdByData },
                obj
            );

            const result = await commonController.add(VehicleInspection, objWithIndex);
            response.successResponse(
                res,
                200,
                MESSAGE.VEHICLE_INSPECTION_CREATED + result._id
            );
        }
    } catch (error) {
        log.error(error);
        response.errorMsgResponse(
            res,
            500,
            MESSAGE.UNABLE_TO_CREATE_VEHICLE_INSPECTION
        );
    }
});

// get all new records
router.get("/getAllNewRecords", auth, async (req, res) => {
    try {
        log.debug("/getAll/VehicleInspection");
        const field = req.query.field;
        const value = req.query.value;

        if (req.designation == "User") {
            var userData = { userId: req.userId };
        } else {
            var userData = { clientAdminId: req.userId };
        }

        if (field && value) {
            const result =
                await commonController.getAuthNewRecordBySortingAndPopulate(
                    VehicleInspection,
                    { createdBy: req.designation == "User" ? "User" : "ClientAdmin" },
                    userData,
                    ["empName", "vehicleAction.personResponsible"],
                    field,
                    value
                );
            response.successResponse(res, 200, result);
        } else {
            const result = await commonController.getAuthNewRecordByPopulate(
                VehicleInspection,
                { createdBy: req.designation == "User" ? "User" : "ClientAdmin" },
                userData,
                ["empName", "vehicleAction.personResponsible"]
            );
            response.successResponse(res, 200, result);
        }
    } catch (error) {
        log.error(error);
        response.errorMsgResponse(
            res,
            500,
            MESSAGE.UNABLE_TO_FETCH_VEHICLE_INSPECTION
        );
    }
});

// get all old records
router.get("/getAllOldRecords", auth, async (req, res) => {
    try {
        log.debug("/getAll/VehicleInspection");
        const field = req.query.field;
        const value = req.query.value;
        if (field && value) {
            const result =
                await commonController.getAuthOldRecordBySortingAndPopulate(
                    VehicleInspection,
                    { clientAdminId: req.userId },
                    ["empName", "vehicleAction.personResponsible"],
                    field,
                    value
                );
            response.successResponse(res, 200, result);
        } else {
            const result = await commonController.getAuthOldRecordByPopulate(
                VehicleInspection,
                { clientAdminId: req.userId },
                ["empName", "vehicleAction.personResponsible"]
            );
            response.successResponse(res, 200, result);
        }
    } catch (error) {
        log.error(error);
        response.errorMsgResponse(
            res,
            500,
            MESSAGE.UNABLE_TO_FETCH_VEHICLE_INSPECTION
        );
    }
});

// get related old VehicleInspection by id
router.get("/getRelatedOldData/:id", auth, async (req, res) => {
    try {
        log.debug("/get/VehicleInspection", req.params.id);
        const data = await commonController.getOne(VehicleInspection, {
            _id: req.params.id,
            clientAdminId: req.userId,
        });
        const result = await commonController.getByPopulate(
            VehicleInspection,
            {
                refersTo: data._id,
            },
            ["empName", "vehicleAction.personResponsible"]
        );
        const arrResult = [
            {
                result,
            },
        ];
        response.successResponse(res, 200, arrResult);
    } catch (error) {
        log.error(error);
        response.errorMsgResponse(
            res,
            500,
            MESSAGE.UNABLE_TO_FETCH_VEHICLE_INSPECTION
        );
    }
});

// get VEHICLE Inspection
router.get("/get/:id", auth, async (req, res) => {
    try {
        log.debug("/get/VehicleInspection", req.params.id);
        const result = await commonController.getSingleRecordByPopulate(
            VehicleInspection,
            { _id: req.params.id },
            ["empName", "vehicleAction.personResponsible"]
        );
        response.successResponse(res, 200, result);
    } catch (error) {
        log.error(error);
        response.errorMsgResponse(
            res,
            500,
            MESSAGE.UNABLE_TO_FETCH_VEHICLE_INSPECTION
        );
    }
});

// update VEHICLE Inspection

router.put("/update/:id", auth, async (req, res) => {
    try {
        log.debug("/update/VehicleInspection");
        const vehicleInspectionResult = await commonController.getOne(VehicleInspection, {
            _id: req.params.id,
        });
        const obj = Object.assign(
            { version: vehicleInspectionResult.version + 1 },
            req.body
        );

        if (vehicleInspectionResult) {
            let newData = {
                allJobNumbersArr: vehicleInspectionResult.allJobNumbersArr,
                allTopic: vehicleInspectionResult.allTopic,
                allcategory: vehicleInspectionResult.allcategory,
                custConct: vehicleInspectionResult.custConct,
                custConctPh: vehicleInspectionResult.custConctPh,
                custEmail: vehicleInspectionResult.custEmail,
                customerName: vehicleInspectionResult.customerName,
                date: vehicleInspectionResult.date,
                jobNumber: vehicleInspectionResult.jobNumber,
                projectManager: vehicleInspectionResult.projectManager,
                projectMangArr: vehicleInspectionResult.projectMangArr,
                vehicleAction: vehicleInspectionResult.vehicleAction,
                vehicleCategorytTopic: vehicleInspectionResult.vehicleCategorytTopic,
                vehicleName: vehicleInspectionResult.vehicleName,
                staffArr: vehicleInspectionResult.staffArr,
                streetAddr: vehicleInspectionResult.streetAddr,
                empName: vehicleInspectionResult.empName,
                submitDate: vehicleInspectionResult.submitDate,
                signature: vehicleInspectionResult.signature,
                refersTo: vehicleInspectionResult._id,
                clientAdminId: vehicleInspectionResult.clientAdminId,
                enable: vehicleInspectionResult.enable,
                frequency: vehicleInspectionResult.frequency,
                updated: "true",
                version: vehicleInspectionResult.version,
                createdTime: vehicleInspectionResult.createdAt.toISOString(),
                updatedTime: vehicleInspectionResult.updatedAt.toISOString(),
            };
            const data = await commonController.add(VehicleInspection, newData);
        }

        const result = await commonController.updateBy(
            VehicleInspection,
            req.params.id,
            obj
        );
        response.successResponse(
            res,
            200,
            MESSAGE.VEHICLE_INSPECTION_UPDATED + req.params.id
        );
    } catch (error) {
        log.error(error);
        response.errorMsgResponse(
            res,
            500,
            MESSAGE.UNABLE_TO_UPDATE_VEHICLE_INSPECTION + req.params.id
        );
    }
});

// delete VEHICLE Inspection
router.delete("/delete/:id", async (req, res) => {
    try {
        log.debug("/delete/VehicleInspection", req.params.id);
        const result = await commonController.delete(VehicleInspection, req.params.id);
        response.successResponse(res, 200, MESSAGE.VEHICLE_INSPECTION_DELETED);
    } catch (error) {
        log.error(error);
        response.errorMsgResponse(
            res,
            500,
            MESSAGE.UNABLE_TO_DELETE_VEHICLE_INSPECTION + req.params.id
        );
    }
});

module.exports = router;
