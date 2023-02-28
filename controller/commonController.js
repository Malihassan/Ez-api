module.exports = {
  // add single data
  add: (schema, data) => {
    return new Promise(function (resolve, reject) {
      var addSchema = new schema(data);
      addSchema
        .save()
        .then((resData) => {
          resolve(resData);
        })
        .catch((error) => {
          console.log("error : ", error);
          reject(error);
        });
    });
  },
  addNewIfNotExist: (schema, query, data, selectedFields) => {
    return new Promise(function (resolve, reject) {
      schema
        .findOneAndUpdate(
          query,
          {
            $setOnInsert: data,
          },
          {
            upsert: true,
            returnOriginal: false,
            runValidators: true,
            fields: selectedFields,
          }
        )
        .then((resData) => {
          resolve(resData);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  count: (schema, object) => {
    return new Promise(function (resolve, reject) {
      schema
        .countDocuments({
          ...object,
          updated: { $eq: "false" },
          status: { $ne: "deleted" },
        })
        .then((resData) => {
          resolve(resData);
        })
        .catch((error) => {
          console.log("error", error);
          reject(error);
        });
    });
  },

  // get all data
  getAll: (schema, object = {}, select = {}) => {
    return new Promise(function (resolve, reject) {
      schema
        .find({ ...object, status: { $ne: "deleted" } }, select)
        .then((resData) => {
          resolve(resData);
        })
        .catch((error) => {
          console.log("error :", error);
          reject(error);
        });
    });
  },

  // get all data in reverse order
  getAllSortReverse: (schema, conditions = {}) => {
    return new Promise(function (resolve, reject) {
      schema
        .find({ status: { $ne: "deleted" }, ...conditions })
        .sort({ _id: -1 })
        .then((resData) => {
          resolve(resData);
        })
        .catch((error) => {
          console.log("error :", error);
          reject(error);
        });
    });
  },

  // get data by ID
  getBy: (schema, object) => {
    return new Promise(function (resolve, reject) {
      schema
        .find({ ...object, status: { $ne: "deleted" } })
        .then((resData) => {
          resolve(resData);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  getByNewRecords: (schema, object) => {
    return new Promise(function (resolve, reject) {
      schema
        .find({
          ...object,
          updated: { $eq: "false" },
          status: { $ne: "deleted" },
        })
        .then((resData) => {
          resolve(resData);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  getByPopulate: (schema, object, populates) => {
    return new Promise(function (resolve, reject) {
      schema
        .find({ ...object, status: { $ne: "deleted" } })
        .populate(populates)
        .then((resData) => {
          resolve(resData);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // get data by ID in reverse order
  getBySortReverse: (schema, object) => {
    return new Promise(function (resolve, reject) {
      schema
        .find({ ...object, status: { $ne: "deleted" } })
        .sort({ _id: -1 })
        .then((resData) => {
          resolve(resData);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // get a specific data based on ID
  getOne: (schema, object) => {
    return new Promise(function (resolve, reject) {
      schema
        .findOne({ ...object, status: { $ne: "deleted" } })
        .then((resData) => {
          resolve(resData);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  //  update data on basis of ID
  updateBy: (schema, id, data) => {
    return new Promise(function (resolve, reject) {
      schema
        .findByIdAndUpdate({ _id: id }, data)
        .then((resData) => {
          resolve(resData);
        })
        .catch((error) => {
          console.log("error", error);
          reject(error);
        });
    });
  },

  updateByID: (schema, id, data, selectedFields) => {
    return new Promise(function (resolve, reject) {
      schema
        .findByIdAndUpdate(id, data, { new: true, fields: selectedFields })
        .then((resData) => {
          resolve(resData);
        })
        .catch((error) => {
          console.log("error", error);
          reject(error);
        });
    });
  },

  // update data on basis of any field
  updateWithObject: (schema, object, data) => {
    return new Promise(function (resolve, reject) {
      schema
        .findOneAndUpdate(object, data, { $new: true })
        .then((resData) => {
          resolve(resData);
        })
        .catch((error) => {
          console.log("error :", error);
          reject(error);
        });
    });
  },

  // delete data on basis of ID
  delete: (schema, id) => {
    return new Promise(function (resolve, reject) {
      schema
        .findByIdAndUpdate({ _id: id }, { status: "deleted" }, { $new: true })
        .then((resData) => {
          resolve(resData);
        })
        .catch((error) => {
          console.log("error : ", error);
          reject(error);
        });
    });
  },
  deleteByID: (schema, id) => {
    return new Promise(function (resolve, reject) {
      schema
        .findByIdAndDelete(id)
        .then((resData) => {
          resolve(resData);
        })
        .catch((error) => {
          console.log("error : ", error);
          reject(error);
        });
    });
  },
  deleteByObject: (schema, object) => {
    return new Promise(function (resolve, reject) {
      schema
        .findOneAndUpdate(object, { status: "deleted" }, { $new: true })
        .then((resData) => {
          resolve(resData);
        })
        .catch((error) => {
          console.log("error : ", error);
          reject(error);
        });
    });
  },

  getWithSortBy: (schema, object, sort) => {
    return new Promise(function (resolve, reject) {
      schema
        .find({ ...object, status: { $ne: "deleted" } })
        .sort(sort)
        .then((resData) => {
          resolve(resData);
        })
        .catch((error) => {
          console.log("error", error);
          reject(error);
        });
    });
  },

  getWithSortByPopulate: (schema, populates) => {
    console.log("object");
    return new Promise(function (resolve, reject) {
      schema
        .find({})
        .populate(populates)
        .then((resData) => {
          resolve(resData);
        })
        .catch((error) => {
          console.log("error", error);
          reject(error);
        });
    });
  },

  getWithReverseSortByPopulate: (schema, populates, object = {}) => {
    console.log("object");
    return new Promise(function (resolve, reject) {
      schema
        .find({ ...object, status: { $ne: "deleted" } })
        .populate(populates)
        .sort({ _id: -1 })
        .then((resData) => {
          resolve(resData);
        })
        .catch((error) => {
          console.log("error", error);
          reject(error);
        });
    });
  },

  getSingleRecordByPopulate: (schema, object, populates) => {
    console.log("object");
    return new Promise(function (resolve, reject) {
      schema
        .findOne({ ...object, status: { $ne: "deleted" } })
        .populate(populates)
        .then((resData) => {
          resolve(resData);
        })
        .catch((error) => {
          console.log("error", error);
          reject(error);
        });
    });
  },

  // get all record of schema by populate
  getAllRecordByPopulate: (schema, populates, conditions = {}) => {
    console.log("schema");
    return new Promise(function (resolve, reject) {
      schema
        .find({ status: { $ne: "deleted" }, ...conditions })
        .populate(populates)
        .then((resData) => {
          resolve(resData);
        })
        .catch((error) => {
          console.log("error", error);
          reject(error);
        });
    });
  },

  getAllAuthRecordByPopulate: (schema, object, populates) => {
    console.log("schema");
    return new Promise(function (resolve, reject) {
      schema
        .find({ ...object, status: { $ne: "deleted" } })
        .populate(populates)
        .then((resData) => {
          resolve(resData);
        })
        .catch((error) => {
          console.log("error", error);
          reject(error);
        });
    });
  },

  // // get all record in ascending order
  // getAllInAscending: (schema, field) => {
  //   return new Promise(function (resolve, reject) {
  //     schema
  //       .findOne({ status: { $ne: "deleted" } })
  //       .sort({ field: 1 })
  //       .then((resData) => {
  //         resolve(resData);
  //       })
  //       .catch((error) => {
  //         reject(error);
  //       });
  //   });
  // },

  // get single record by dynamic sorting
  getOneBySorting: (schema, object, field, value) => {
    return new Promise(function (resolve, reject) {
      schema
        .findOne({ ...object, status: { $ne: "deleted" } })
        .collation({ locale: "en" })
        .sort({ [field]: value })
        .then((resData) => {
          resolve(resData);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // get all records by dynamic sorting
  getAllRecordBySorting: (schema, field, value, conditions = {}) => {
    console.log("schema");
    return new Promise(function (resolve, reject) {
      schema
        .find({ status: { $ne: "deleted" }, ...conditions })
        .collation({ locale: "en" })
        .sort({ [field]: value })
        .then((resData) => {
          resolve(resData);
        })
        .catch((error) => {
          console.log("error", error);
          reject(error);
        });
    });
  },

  // get all records by dynamic sorting and populate
  getRecordsSortedWithPopulate: (schema, populates, field, value) => {
    console.log("schema");
    return new Promise(function (resolve, reject) {
      schema
        .find({ status: { $ne: "deleted" } })
        .populate(populates)
        .collation({ locale: "en" })
        .sort({ [field]: value })
        .then((resData) => {
          resolve(resData);
        })
        .catch((error) => {
          console.log("error", error);
          reject(error);
        });
    });
  },

  getAuthRecordsSortedWithPopulate: (
    schema,
    object,
    populates,
    field,
    value
  ) => {
    console.log("schema");
    return new Promise(function (resolve, reject) {
      schema
        .find({ ...object, status: { $ne: "deleted" } })
        .populate(populates)
        .collation({ locale: "en" })
        .sort({ [field]: value })
        .then((resData) => {
          resolve(resData);
        })
        .catch((error) => {
          console.log("error", error);
          reject(error);
        });
    });
  },

  // used for history maintainig purpose
  //
  // get all records by dynamic sorting and populate for history purpose
  getAllNewRecordBySortingAndPopulate: (schema, populates, field, value) => {
    console.log("schema");
    return new Promise(function (resolve, reject) {
      schema
        .find({ status: { $ne: "deleted" }, updated: { $eq: "false" } })
        .populate(populates)
        .collation({ locale: "en" })
        .sort({ [field]: value })
        .then((resData) => {
          resolve(resData);
        })
        .catch((error) => {
          console.log("error", error);
          reject(error);
        });
    });
  },

  getAuthNewRecordBySortingAndPopulate: (
    schema,
    createdBy,
    object,
    populates,
    field,
    value
  ) => {
    console.log("schema");
    return new Promise(function (resolve, reject) {
      schema
        .find({
          $and: [{ ...createdBy }, { ...object }],
          status: { $ne: "deleted" },
          updated: { $eq: "false" },
        })
        .populate(populates)
        .collation({ locale: "en" })
        .sort({ [field]: value })
        .then((resData) => {
          resolve(resData);
        })
        .catch((error) => {
          console.log("error", error);
          reject(error);
        });
    });
  },

  getAuthNewRecordBySorting: (schema, createdBy, object, field, value) => {
    console.log("schema");
    return new Promise(function (resolve, reject) {
      schema
        .find({
          $and: [{ ...createdBy }, { ...object }],
          status: { $ne: "deleted" },
          updated: { $eq: "false" },
        })
        .collation({ locale: "en" })
        .sort({ [field]: value })
        .then((resData) => {
          resolve(resData);
        })
        .catch((error) => {
          console.log("error", error);
          reject(error);
        });
    });
  },

  // get all records by dynamic sorting for history purpose
  getAllNewRecordBySorting: (schema, field, value) => {
    console.log("schema");
    return new Promise(function (resolve, reject) {
      schema
        .find({ status: { $ne: "deleted" }, updated: { $eq: "false" } })
        .collation({ locale: "en" })
        .sort({ [field]: value })
        .then((resData) => {
          resolve(resData);
        })
        .catch((error) => {
          console.log("error", error);
          reject(error);
        });
    });
  },

  // get all records for history purpose
  getAllNewRecordByPopulate: (schema, populates, object = {}) => {
    console.log("schema");
    return new Promise(function (resolve, reject) {
      schema
        .find({
          status: { $ne: "deleted" },
          updated: { $eq: "false" },
          ...object,
        })
        .populate(populates)
        .then((resData) => {
          resolve(resData);
        })
        .catch((error) => {
          console.log("error", error);
          reject(error);
        });
    });
  },

  getAuthNewRecordByPopulate: (schema, createdBy, object, populates) => {
    console.log("schema");
    return new Promise(function (resolve, reject) {
      schema
        .find({
          $and: [{ ...createdBy }, { ...object }],
          status: { $ne: "deleted" },
          updated: { $eq: "false" },
        })
        .populate(populates)
        .then((resData) => {
          resolve(resData);
        })
        .catch((error) => {
          console.log("error", error);
          reject(error);
        });
    });
  },

  getAuthNewRecord: (schema, object) => {
    console.log("schema");
    return new Promise(function (resolve, reject) {
      schema
        .find({
          ...object,
          status: { $ne: "deleted" },
          updated: { $eq: "false" },
        })
        .then((resData) => {
          resolve(resData);
        })
        .catch((error) => {
          console.log("error", error);
          reject(error);
        });
    });
  },

  getAllAuthNewRecord: (schema, createdBy, object) => {
    console.log("schema");
    return new Promise(function (resolve, reject) {
      schema
        .find({
          $and: [{ ...createdBy }, { ...object }],
          status: { $ne: "deleted" },
          updated: { $eq: "false" },
        })
        .then((resData) => {
          resolve(resData);
        })
        .catch((error) => {
          console.log("error", error);
          reject(error);
        });
    });
  },

  // get all records by object for history purpose
  getAllRelatedNewRecord: (schema, object) => {
    console.log("schema");
    return new Promise(function (resolve, reject) {
      schema
        .find({
          ...object,
          status: { $ne: "deleted" },
          updated: { $eq: "false" },
        })
        .then((resData) => {
          resolve(resData);
        })
        .catch((error) => {
          console.log("error", error);
          reject(error);
        });
    });
  },

  // get all records for history purpose
  getAllNewRecord: (schema) => {
    console.log("schema");
    return new Promise(function (resolve, reject) {
      schema
        .find({ status: { $ne: "deleted" }, updated: { $eq: "false" } })
        .then((resData) => {
          resolve(resData);
        })
        .catch((error) => {
          console.log("error", error);
          reject(error);
        });
    });
  },

  // get all records by dynamic sorting and populate for history purpose
  getOldRecordBySortingAndPopulate: (schema, populates, field, value) => {
    console.log("schema");
    return new Promise(function (resolve, reject) {
      schema
        .find({ status: { $ne: "deleted" }, updated: { $eq: "true" } })
        .populate(populates)
        .collation({ locale: "en" })
        .sort({ [field]: value })
        .then((resData) => {
          resolve(resData);
        })
        .catch((error) => {
          console.log("error", error);
          reject(error);
        });
    });
  },

  getAuthOldRecordBySortingAndPopulate: (
    schema,
    object,
    populates,
    field,
    value
  ) => {
    console.log("schema");
    return new Promise(function (resolve, reject) {
      schema
        .find({
          ...object,
          status: { $ne: "deleted" },
          updated: { $eq: "true" },
        })
        .populate(populates)
        .collation({ locale: "en" })
        .sort({ [field]: value })
        .then((resData) => {
          resolve(resData);
        })
        .catch((error) => {
          console.log("error", error);
          reject(error);
        });
    });
  },

  // get all records by dynamic sorting for history purpose
  getOldRecordBySorting: (schema, field, value) => {
    console.log("schema");
    return new Promise(function (resolve, reject) {
      schema
        .find({ status: { $ne: "deleted" }, updated: { $eq: "true" } })
        .collation({ locale: "en" })
        .sort({ [field]: value })
        .then((resData) => {
          resolve(resData);
        })
        .catch((error) => {
          console.log("error", error);
          reject(error);
        });
    });
  },

  getAuthOldRecordBySorting: (schema, object, field, value) => {
    console.log("schema");
    return new Promise(function (resolve, reject) {
      schema
        .find({
          ...object,
          status: { $ne: "deleted" },
          updated: { $eq: "true" },
        })
        .collation({ locale: "en" })
        .sort({ [field]: value })
        .then((resData) => {
          resolve(resData);
        })
        .catch((error) => {
          console.log("error", error);
          reject(error);
        });
    });
  },

  // get all records for history purpose
  getAllOldRecordByPopulate: (schema, populates) => {
    console.log("schema");
    return new Promise(function (resolve, reject) {
      schema
        .find({ status: { $ne: "deleted" }, updated: { $eq: "true" } })
        .populate(populates)
        .then((resData) => {
          resolve(resData);
        })
        .catch((error) => {
          console.log("error", error);
          reject(error);
        });
    });
  },

  getAuthOldRecordByPopulate: (schema, object, populates) => {
    console.log("schema");
    return new Promise(function (resolve, reject) {
      schema
        .find({
          ...object,
          status: { $ne: "deleted" },
          updated: { $eq: "true" },
        })
        .populate(populates)
        .then((resData) => {
          resolve(resData);
        })
        .catch((error) => {
          console.log("error", error);
          reject(error);
        });
    });
  },

  // get all records for history purpose
  getAllOldRecord: (schema) => {
    console.log("schema");
    return new Promise(function (resolve, reject) {
      schema
        .find({ status: { $ne: "deleted" }, updated: { $eq: "true" } })
        .then((resData) => {
          resolve(resData);
        })
        .catch((error) => {
          console.log("error", error);
          reject(error);
        });
    });
  },

  getAuthOldRecord: (schema) => {
    console.log("schema");
    return new Promise(function (resolve, reject) {
      schema
        .find({ status: { $ne: "deleted" }, updated: { $eq: "true" } })
        .then((resData) => {
          resolve(resData);
        })
        .catch((error) => {
          console.log("error", error);
          reject(error);
        });
    });
  },

  // get all in ascending order
  getAllWithSort: (schema, sort, conditions = {}) => {
    return new Promise(function (resolve, reject) {
      schema
        .find({ status: { $ne: "deleted" }, ...conditions })
        .sort(sort)
        .then((resData) => {
          resolve(resData);
        })
        .catch((error) => {
          console.log("error", error);
          reject(error);
        });
    });
  },
  //
  // used for history maintainig purpose

  // getByFilter: (schema, key, parameter) => {
  //   console.log("schema");
  //   return new Promise(function (resolve, reject) {
  //     schema
  //       .find({ status: { $ne: "deleted" }, key: parameter })
  //       .then((resData) => {
  //         resolve(resData);
  //       })
  //       .catch((error) => {
  //         console.log("error", error);
  //         reject(error);
  //       });
  //   });
  // },

  deletePRM: (schema, object) => {
    return new Promise(function (resolve, reject) {
      schema
        .findOneAndDelete({
          ...object,
        })
        .then((resData) => {
          resolve(resData);
        })
        .catch((error) => {
          console.log("error", error);
          reject(error);
        });
    });
  },

  operation: (array, id) => {
    return new Promise(function (resolve, reject) {
      try {
        array = array.flat();
        array = array.filter((x) => Object.keys(x)[0] === String(id));
        array = array.filter((value, i) => value[id]);
        resolve(array.length);
      } catch (error) {
        reject(error);
      }
    });
  },
  deleteMany: (schema, ids) => {
    return new Promise(function (resolve, reject) {
      schema
        .deleteMany({ _id: { $in: ids } })
        .then((resData) => {
          resolve(resData);
        })
        .catch((error) => {
          console.log("error : ", error);
          reject(error);
        });
    });
  },
  insertMany: (schema, data) => {
    return new Promise(function (resolve, reject) {
      schema
        .insertMany(data)
        .then((resData) => {
          resolve(resData);
        })
        .catch((error) => {
          console.log("error : ", error);
          reject(error);
        });
    });
  },
};
