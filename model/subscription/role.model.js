const mongoose = require("mongoose"),
  Schema = mongoose.Schema;
const permisstionObj = {
  isRead: { type: Boolean, default: false },
  isWrite: { type: Boolean, default: false },
  isUpdate: { type: Boolean, default: false },
};
const Role = new Schema(
  {
    title: String,
    permissions: {
      formsManagment: permisstionObj,
      settingManagment: permisstionObj,
      employeeManagment: permisstionObj,
      distributionCentreManagment: permisstionObj,
      registerManagment: permisstionObj,
      companyManagment: permisstionObj,
    },
  },
  {
    timestamps: true,
  }
);

const roleModel = mongoose.model("Role", Role);
(async () => {
  const roleModelCount = await roleModel.find({}).countDocuments();
  if (roleModelCount == 0) {
    roleModel.insertMany([
      {
        title: "Administrator",
        permissions: {
          formsManagment: { isRead: true, isWrite: true, isUpdate: true },
          settingManagment: { isRead: true, isWrite: true, isUpdate: true },
          employeeManagment: { isRead: true, isWrite: true, isUpdate: true },
          distributionCentreManagment: {
            isRead: true,
            isWrite: true,
            isUpdate: true,
          },
          registerManagment: { isRead: true, isWrite: true, isUpdate: true },
          companyManagment: { isRead: true, isWrite: true, isUpdate: true },
        },
      },
    ]);
  }
})();
module.exports = roleModel;
