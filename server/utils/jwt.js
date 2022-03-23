const jsonwebtoken = require("jsonwebtoken");
const config = require("../../config/token.js");

const verify = async (token, options) =>
  jsonwebtoken.verify(token, config.key, options);

const sign = async (token, options) =>
  jsonwebtoken.sign(token, config.key, options);

module.exports = { verify, sign };
