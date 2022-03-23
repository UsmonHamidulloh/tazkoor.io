"use strict";

const { Book } = require("../collector");
const { bookSchema } = require("./validate");

// get All books of User
const getAllBooks = async (req, res) => {
  try {
    const bookId = req.headers?.book_id;
    const user = req.user;
    let books = [];

    if (!user) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    if (bookId) {
      books = await Book.getABookById({
        user_id: user.id,
        book_id: bookId,
      });
    } else {
      books = await Book.getAllBooks({
        user_id: user.id,
        // limit: req.limit,
        // page: req.page,
      });
    }

    return res.json({
      okay: true,
      message: "Books fetched successfully",
      count: books.length,
      books,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: error.message });
  }
};

const createBook = async (req, res) => {
  try {
    const user = req.user;
    const validation = bookSchema.validate(req.body);

    if (!user) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    } else if (validation.error) {
      const errorMessage = Object(validation?.error?.details[0]).message;

      return res.status(400).json({
        ok: false,
        message: errorMessage,
      });
    }

    const { title, language_native, language_translate } = req.body;

    const book = await Book.createBook({
      user_id: user.id,
      title,
      language_native: language_native,
      language_translate: language_translate,
    });

    res.json({
      okay: true,
      message: "Book created successfully",
      book,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: error.message });
  }
};

const deleteBook = async (req, res) => {
  try {
    const user = req.user;
    const bookId = req.body?.book_id;

    if (!user) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    } else if (!bookId) {
      return res.status(400).json({
        ok: false,
        message: "Book id is required",
      });
    }

    const book = await Book.deleteBook({ userId: user.id, bookId: bookId });

    if (!book) {
      return res.status(400).json({
        ok: false,
        message: "Book not found",
      });
    } else {
      return res.json({
        okay: true,
        message: "Book deleted successfully",
        book,
      });
    }
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: error.message });
  }
};

const updateBook = async (req, res) => {
  try {
    const user = req.user;
    const bookId = req.body?.book_id;
    const validation = bookSchema.validate(req.body);

    if (!user) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    } else if (validation.error) {
      const errorMessage = Object(validation?.error?.details[0]).message;

      return res.status(400).json({
        ok: false,
        message: errorMessage,
      });
    }

    const book = await Book.updateBook({
      userId: user.id,
      bookId: bookId,
      title: req.body.title,
      language_native: req.body.language_native,
      language_translate: req.body.language_translate,
    });

    if (!book) {
      return res.status(400).json({
        ok: false,
        message: "Book not found",
      });
    } else {
      return res.json({
        okay: true,
        message: "Book updated successfully",
        book,
      });
    }
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: error.message });
  }
};

const getAllJoinedBooks = async (req, res) => {
  try {
    const user = req.user;
    const books = await Book.getAllJoinedBooks(user.id);

    return res.json({
      okay: true,
      message: "Books fetched successfully",
      count: books.length,
      books,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllBooks,
  createBook,
  deleteBook,
  updateBook,
  getAllJoinedBooks,
};
