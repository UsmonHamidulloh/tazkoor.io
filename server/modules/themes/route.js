"use strict";

const router = require("express").Router();

const {
  getAllThemesOfBook,
  createTheme,
  deleteTheme,
  updateTheme,
} = require("./controller");

router
  .route("/themes")
  .get(getAllThemesOfBook)
  .put(updateTheme)
  .post(createTheme)
  .delete(deleteTheme);

module.exports = router;
