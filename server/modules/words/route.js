"use strict";

const router = require("express").Router();

const {
  createWord,
  getAllWordsOfTheme,
  deleteWords,
  updateWord,
} = require("./controller");

router
  .route("/words")
  .post(createWord)
  .get(getAllWordsOfTheme)
  .delete(deleteWords)
  .put(updateWord);

module.exports = router;
