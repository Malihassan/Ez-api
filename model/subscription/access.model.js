const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const Access = new Schema(
  {
    clientAdminId: { type: mongoose.Types.ObjectId, ref: "User" },
    accessArr: [
      {
        formName: String,
        NavigationAccess: {
          type: Boolean,
          default: false,
        },
        Add: {
          type: Boolean,
          default: false,
        },
        View: {
          type: Boolean,
          default: false,
        },
        Edit: {
          type: Boolean,
          default: false,
        },
        Delete: {
          type: Boolean,
          default: false,
        },
      },
    ],
    roleId: {
      type: mongoose.Types.ObjectId,
      ref: "Role",
    },
    status: {
      type: String,
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Access", Access);
