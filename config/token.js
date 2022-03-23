"use strict";

const SECRET_KEY = process.env.SECRET_KEY || "NO KEY";
const EXPIRE_TIME = process.env.EXPIRE_TIME || "24h";

module.exports = {
  key: SECRET_KEY,
  expire_time: EXPIRE_TIME,
};
