"use strict";

const { Word } = require("../collector");
const { wordSchema } = require("./validate");

const createWord = async (req, res) => {
  try {
    const props = req.body;
    const user = req.user;

    const { error } = wordSchema.validate(props);
    if (!user) return res.status(401).send({ message: "Unauthorized" });

    if (error) {
      return res.status(400).json({
        error: error.message,
      });
    } else if (!props.theme && !props.book) {
      return res.status(400).json({
        error: "Theme or book are required",
      });
    }

    props.user_id = user.id;

    const [word] = await Word.create(props);

    if (word) {
      return res.json({
        ok: true,
        message: "Word created",
        word,
      });
    }

    return res.status(400).json({
      error: "Word not created",
    });
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      ok: false,
      message: "Bad request",
    });
  }
};

const deleteWords = async (req, res) => {
  try {
    const { id } = req.body;
    const user = req.user;

    if (!user) return res.status(401).send({ message: "Unauthorized" });

    if (!id) {
      return res.status(400).json({
        error: "Ids are required",
      });
    }

    const words = await Word.deleteWord(id, user.id);

    if (words) {
      return res.json({
        ok: true,
        message: "Words deleted",
        words,
      });
    }

    return res.status(400).json({
      error: "a word not found",
    });
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      ok: false,
      message: "Bad request",
    });
  }
};

const updateWord = async (req, res) => {
  try {
    const props = req.body;
    const user = req.user;

    if (!user) return res.status(401).send({ message: "Unauthorized" });

    if (!props?.id) {
      return res.status(400).json({
        error: "Id are required",
      });
    }

    const word = await Word.updateWord(props.id, user?.id, props);
    console.log(word);

    if (word.length) {
      return res.json({
        ok: true,
        message: "Word updated",
        word,
      });
    }

    return res.status(400).json({
      ok: false,
      message: "Word not updated",
      word: null,
    });
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      ok: false,
      message: "Bad request",
    });
  }
};

const getAllWordsOfTheme = async (req, res) => {
  try {
    const theme = req.headers.theme;
    const book = req.headers.book;
    const user = req.user;

    if (!user) {
      return res.status(401).send({ message: "Unauthorized" });
    }

    if (!theme && !book) {
      return res.status(400).json({
        error: "Theme or book are required(one of them)",
      });
    } else if (theme && book) {
      return res.status(400).json({
        error: "Theme and book are not allowed together(send one of them)",
      });
    }

    const words = await Word.getWordsByBookThemeOrAll({
      theme_id: theme || null,
      book_id: book || null,
    });

    return res.json({
      ok: true,
      message: "Words found",
      words_count: words.length,
      words,
    });
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      ok: false,
      message: error.message,
    });
  }
};

module.exports = {
  createWord,
  getAllWordsOfTheme,
  deleteWords,
  updateWord,
};
