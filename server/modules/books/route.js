"use strict";

const router = require("express").Router();

const {
  getAllBooks,
  createBook,
  deleteBook,
  updateBook,
  getAllJoinedBooks,
} = require("./controller");

router
  .route("/books")
  .get(getAllBooks)
  .post(createBook)
  .delete(deleteBook)
  .put(updateBook);

router.route("/books/joined").get(getAllJoinedBooks);

module.exports = router;
