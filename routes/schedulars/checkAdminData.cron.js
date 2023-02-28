const cron = require('node-schedule');
const mongoose = require('mongoose');
const Users = mongoose.model('User');
const States = mongoose.model('State');
const updateRecords = mongoose.model('updateRecords');
const Jurisdiction = mongoose.model('Jurisdiction');
const SafetyLegislation = mongoose.model('SafetyLegislation');
const Regulator = mongoose.model('Regulator');
const RiskAsstInstruction = mongoose.model('RiskAsstInstruction');
const RiskLevel = mongoose.model("RiskLevel");
const ResidualRisk = mongoose.model("ResidualRisk");
const Risk = mongoose.model("Risk");
const COP = mongoose.model("COP");
const IdentifyHazard = mongoose.model("IdentifyHazard");
const Chemical = mongoose.model("Chemical");
const JOBTask = mongoose.model("JOBTask");
const Licence = mongoose.model("Licence");
const ControlActionRequired = mongoose.model("ControlActionRequired");
const AccidentReportInstruction = mongoose.model("AccidentReportInstruction");
const NatureOfIncident = mongoose.model("NatureOfIncident");
const RootcauseOfIncident = mongoose.model("RootcauseOfIncident");
const ChangesMade = mongoose.model("ChangesMade");
const TypeOfIncident = mongoose.model("TypeOfIncident");
const HazardTreatmentRelation = mongoose.model("HazardTreatmentRelation");
const SiteInspectionCategory = mongoose.model("SiteInspectionCategory");
const FormCategory = mongoose.model("FormCategory");
const Site = mongoose.model("Site");
const Customer = mongoose.model("Customer");

const ProjectManager = mongoose.model("ProjectManager");
const TradeCategory = mongoose.model("TradeCategory");
const PPE = mongoose.model("PPE");
const Staff = mongoose.model("Staff");
const Manager = mongoose.model("Manager");
const WHSManager = mongoose.model("WHSManager");


const cc = require('../../controller/commonController');
const e = require('express');

module.exports = {
    cron: () => {
        cron.scheduleJob('*/5 * * * *', async () => {
            module.exports.commonSet(States, ['title', 'jurisdictionId', 'safetyLegislationId', 'regulatorId', 'set'], 'States');
            module.exports.commonSet(Jurisdiction, ['title'], 'Jurisdiction');
            module.exports.commonSet(SafetyLegislation, ['act', 'regulation'], 'SafetyLegislation');
            module.exports.commonSet(Regulator, ['title'], 'Regulator');
            module.exports.commonSet(RiskLevel, ['title'], 'RiskLevel');
            module.exports.commonSet(ResidualRisk, ['title'], 'ResidualRisk');
            module.exports.commonSet(Risk, ['title'], 'Risk');
            module.exports.commonSet(COP, ['title'], 'COP');
            module.exports.commonSet(IdentifyHazard, ['title', 'jobTaskId'], 'IdentifyHazard');
            module.exports.commonSet(Chemical, ['title'], 'Chemical');
            let list = ['title', 'PPE', 'risk', 'licence', 'codeOfPractice', 'identifyHazard', 'controlActionRequired', 'allContrlActReqTitle', 'allHazardsTitle', 'allCOPTitle', 'staff', 'tradeCategoryId', 'chemical', 'riskLevel', 'residualRisk', 'set']
            module.exports.commonSet(JOBTask, list, 'JOBTask');
            module.exports.commonSet(Licence, ['tradeCategoryId', 'title', 'clientAdminId'], 'Licence');
            module.exports.commonSet(ControlActionRequired, ['jobTaskId', 'title'], 'ControlActionRequired');
            module.exports.commonSet(RiskAsstInstruction, ['instruction'], 'RiskAsstInstruction');
            module.exports.commonSet(AccidentReportInstruction, ['instruction'], 'AccidentReportInstruction');
            module.exports.commonSet(NatureOfIncident, ['title'], 'NatureOfIncident');
            module.exports.commonSet(RootcauseOfIncident, ['title'], 'RootcauseOfIncident');
            module.exports.commonSet(ChangesMade, ['title'], 'ChangesMade');
            module.exports.commonSet(TypeOfIncident, ['title'], 'TypeOfIncident');
            module.exports.commonSet(HazardTreatmentRelation, ['title', 'riskRating', 'actionRequired', 'set'], 'HazardTreatmentRelation');
            module.exports.commonSet(SiteInspectionCategory, ['category'], 'SiteInspectionCategory'); // To Do add category topics according to category id
            module.exports.commonSet(FormCategory, ['title'], 'FormCategory');
            module.exports.commonSet(Site, ['siteName', 'streetNumber', 'streetAddress', 'suburb', 'postcode', 'stateId'], 'Site');
            module.exports.commonSet(Customer, ['customerName', 'customerContact', 'streetAddress', 'postCode', 'suburb', 'stateId', 'contacts'], 'Customer');
            module.exports.commonSet(ProjectManager, ['title'], 'ProjectManager');
            module.exports.commonSet(TradeCategory, ['title', 'show', 'order'], 'TradeCategory');
            module.exports.commonSet(PPE, ['title'], 'PPE');
            module.exports.commonSet(Staff, ['title'], 'Staff');
            module.exports.commonSet(Manager, ['name', 'email'], 'Manager');
            module.exports.commonSet(WHSManager, ['name', 'email'], 'WHSManager');
        });
    },
    commonSet: async (schema, statesParams, moduleName) => {
        console.log("calling: ", moduleName)
        // try {
        //     const data = await cc.getAll(Users, { designation: { $ne: 'SuperAdmin' } });
        //     const ids = data.map(({ _id }) => _id)
        //     const { _id } = await cc.getOne(Users, { designation: 'SuperAdmin' });
        //     const statesData = await cc.getAll(schema, { userId: _id });
        //     const userData = await cc.getAll(updateRecords, { userId: { $in: ids }, moduleName: moduleName });
        //     let listOfState = [];
        //     let userHistory = [];
        //     let stateIds = statesData.map(({ _id }) => _id)
        //     ids.forEach(id => {
        //         const filterData = JSON.parse(JSON.stringify(userData)).filter(ele => ele.userId == id);
        //         userHistory.push({ userId: id, moduleName: moduleName, recordsIds: stateIds })
        //         if (filterData && filterData.length > 0 && filterData[0].recordsIds && filterData[0].recordsIds.length > 0) {
        //             listOfState.push(...JSON.parse(JSON.stringify(statesData)).filter(ele => !filterData[0].recordsIds.includes(ele._id)).map(ele => {
        //                 let object = { userId: id };
        //                 statesParams.forEach(key => {
        //                     if (ele && ele[key])
        //                         object[key] = ele[key]
        //                 });
        //                 return object;
        //             }))
        //         } else {
        //             listOfState.push(...statesData.map(ele => {
        //                 let object = { userId: id };
        //                 statesParams.forEach(key => {
        //                     if (ele && ele[key])
        //                         object[key] = ele[key]
        //                 });
        //                 return object;
        //             }))
        //         }
        //     })
        //     if (userData.length > 0)
        //         await cc.deleteMany(updateRecords, userData.map(ele => ele._id));
        //     await cc.insertMany(schema, listOfState);
        //     await cc.insertMany(updateRecords, userHistory);
        // } catch (error) {
        //     console.log("cron error", error)
        // }
    },
}