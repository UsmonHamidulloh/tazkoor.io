"use strict";

const router = require("express").Router();

const { getAllThemesOfBook, testGame, postStats } = require("./controller");

router.route("/games/theme").get(getAllThemesOfBook);
router.route("/games/test").get(testGame);
router.route("/games/stats").post(postStats);

module.exports = router;
