const router = require("express").Router();
const commonController = require("../../controller/commonController");
const response = require("../../helper/response");
const MESSAGE = require("../../helper/message");
const log = require("../../helper/logger");
const auth = require("../../helper/auth");
const mongoose = require("mongoose");
const MeetingMinutes = mongoose.model("MeetingMinutes");

// add MeetingMinutes Box
router.post("/add", auth, async (req, res) => {
    try {
        log.debug("/add/MeetingMinutes");
        const obj = req.body;
        const createdByData = req.designation;
        const data = await MeetingMinutes.find({ updated: "false" })
            .sort({ _id: -1 })
            .limit(1);

        if (data != 0) {
            const index = data[0].formId.split("-")[1];
            const objectWithIndex = Object.assign(
                { formId: `WHS_MM-${parseInt(index) + 1}` },
                { createdBy: createdByData },
                obj
            );
            const result = await commonController.add(MeetingMinutes, objectWithIndex);
            response.successResponse(res, 200, MESSAGE.MEETINGMINUTES_CREATED + result._id);
        } else {
            const objectWithIndex = Object.assign(
                { formId: `WHS_MM-${1}` },
                { createdBy: createdByData },
                obj
            );
            const result = await commonController.add(MeetingMinutes, objectWithIndex);
            response.successResponse(res, 200, MESSAGE.MEETINGMINUTES_CREATED + result._id);
        }
    } catch (error) {
        log.error(error);
        response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_CREATE_MEETINGMINUTES);
    }
});

//  get all new MeetingMinutes
router.get("/getAllNewRecords", auth, async (req, res) => {
    try {
        log.debug("/getAll/MeetingMinutes");
        const field = req.query.field;
        const value = req.query.value;

        if (req.designation == "User") {
            var userData = { userId: req.userId };
        } else {
            var userData = { clientAdminId: req.userId };
        }

        if (field && value) {
            const result = await commonController.getAuthNewRecordBySorting(
                MeetingMinutes,
                { createdBy: req.designation == "User" ? "User" : "ClientAdmin" },
                userData,
                field,
                value
            );
            response.successResponse(res, 200, result);
        } else {
            const result = await commonController.getAllAuthNewRecord(
                MeetingMinutes,
                { createdBy: req.designation == "User" ? "User" : "ClientAdmin" },
                userData
            );
            response.successResponse(res, 200, result);
        }
    } catch (error) {
        log.error(error);
        response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_MEETINGMINUTES);
    }
});

// get all old records
router.get("/getAllOldRecords", async (req, res) => {
    try {
        log.debug("/getAll/MeetingMinutes");
        const field = req.query.field;
        const value = req.query.value;
        if (field && value) {
            const result = await commonController.getAuthOldRecordBySorting(
                MeetingMinutes,
                { clientAdminId: req.userId },
                field,
                value
            );
            response.successResponse(res, 200, result);
        } else {
            const result = await commonController.getAuthOldRecord(MeetingMinutes, {
                clientAdminId: req.userId,
            });
            response.successResponse(res, 200, result);
        }
    } catch (error) {
        log.error(error);
        response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_MEETINGMINUTES);
    }
});

// get MeetingMinutes
router.get("/get/:id", auth, async (req, res) => {
    try {
        log.debug("/get/MeetingMinutes", req.params.id);
        const result = await commonController.getOne(MeetingMinutes, {
            _id: req.params.id,
        });
        response.successResponse(res, 200, result);
    } catch (error) {
        log.error(error);
        response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_MEETINGMINUTES);
    }
});

// get related old MeetingMinutes by id
router.get("/getRelatedOldData/:id", auth, async (req, res) => {
    try {
        log.debug("/get/MeetingMinutes", req.params.id);
        const data = await commonController.getOne(MeetingMinutes, {
            _id: req.params.id,
            clientAdminId: req.userId,
        });
        const result = await commonController.getBy(MeetingMinutes, {
            refersTo: data._id,
        });
        const arrResult = [
            {
                result,
            },
        ];
        response.successResponse(res, 200, arrResult);
    } catch (error) {
        log.error(error);
        response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_MEETINGMINUTES);
    }
});

// update MeetingMinutes
router.put("/update/:id", auth, async (req, res) => {
    try {
        log.debug("/update/MeetingMinutes", req.params.id);
        const MeetingMinutesResult = await commonController.getOne(MeetingMinutes, {
            _id: req.params.id,
        });

        let obj = Object.assign({ version: MeetingMinutesResult.version + 1 }, req.body);

        if (MeetingMinutesResult) {
            let newData = {
                refersTo: MeetingMinutesResult._id,
                jobNumberId: MeetingMinutesResult.jobNumberId,
                customerName: MeetingMinutesResult.customerName,
                custEmail: MeetingMinutesResult.custEmail,
                custConct: MeetingMinutesResult.custConct,
                custConctPh: MeetingMinutesResult.custConctPh,
                siteName: MeetingMinutesResult.siteName,
                streetAddr: MeetingMinutesResult.streetAddr,
                signaturePad1: MeetingMinutesResult.signaturePad1,
                date: MeetingMinutesResult.data,
                attendees: MeetingMinutesResult.attendees,
                corrAction: MeetingMinutesResult.corrAction,
                issues: MeetingMinutesResult.issues,
                dataMeetingMinutesTalk: MeetingMinutesResult.dataMeetingMinutesTalk,
                meetingBy: MeetingMinutesResult.meetingBy,
                personResponsible: MeetingMinutesResult.personResponsible,
                enable: MeetingMinutesResult.enable,
                frequency: MeetingMinutesResult.frequency,
                updated: "true",
                version: MeetingMinutesResult.version,
                clientAdminId: MeetingMinutesResult.clientAdminId,
                createdTime: MeetingMinutesResult.createdAt.toISOString(),
                updatedTime: MeetingMinutesResult.updatedAt.toISOString(),
            };
            const data = await commonController.add(MeetingMinutes, newData);
        }

        const result = await commonController.updateBy(MeetingMinutes, req.params.id, obj);
        response.successResponse(res, 200, MESSAGE.MEETINGMINUTES_UPDATED + req.params.id);
    } catch (error) {
        log.error(error);
        response.errorMsgResponse(
            res,
            500,
            MESSAGE.UNABLE_TO_UPDATE_MEETINGMINUTES + req.params.id
        );
    }
});

// delete MeetingMinutes
router.delete("/delete/:id", async (req, res) => {
    try {
        log.debug("/delete/MeetingMinutes", req.params.id);
        const result = await commonController.delete(MeetingMinutes, req.params.id);
        response.successResponse(res, 200, MESSAGE.MEETINGMINUTES_DELETED);
    } catch (error) {
        log.error(error);
        response.errorMsgResponse(
            res,
            500,
            MESSAGE.UNABLE_TO_DELETE_MEETINGMINUTES + req.params.id
        );
    }
});

module.exports = router;
