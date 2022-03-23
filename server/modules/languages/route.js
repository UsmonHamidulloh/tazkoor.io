"use strict";

const router = require("express").Router();

const { getAllLanguages } = require("./controller");

router.route("/langs").get(getAllLanguages);

module.exports = router;
