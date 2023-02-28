module.exports = {
  generateOTP: function () {
    return Math.floor(100000 + Math.random() * 900000);
  },
  generatePIN: function () {
    return Math.floor(100000000000 + Math.random() * 900000000000);
  },
  generatePassword: function () {
    // return (Math.random() + 1).toString(36).substring(2, 12);
    return Buffer.from(Math.random().toString())
      .toString("base64")
      .substring(10, 0);
  },
};
