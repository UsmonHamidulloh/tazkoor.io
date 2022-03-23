"use strict";

const { Game } = require("../collector");
const {} = require("./validate");

const getAllThemesOfBook = async (req, res) => {
  const { theme, page, limit } = req.headers;

  if (!(theme - 0)) {
    return res.status(400).json({
      error: "Theme is required",
    });
  }

  const themeInfo = await Game.getThemeInfoById(theme); // get theme info

  return res.json({
    ok: true,
    data: themeInfo,
  });
};

const testGame = async (req, res) => {
  const { theme, book, page, limit } = req.headers;
  const user = req.user;

  if (!(theme - 0) && !(book - 0)) {
    return res.status(400).json({
      error: "Theme or Book is required",
    });
  } else if (!user) {
    return res.status(400).json({
      error: "Auth is required",
    });
  }

  const bookObject = theme && !book ? await Game.getThemeInfoById(theme) : null;
  const bookId = bookObject?.book_id
  console.log(+book || bookId);
  const tests = await Game.testGame(theme, user, +book || bookId); // get theme info

  return res.json({
    ok: true,
    data: tests,
  });
};

const postStats = async (req, res) => {
  const { theme, words, book } = req.headers;
  const user = req.user;

  if (!(theme - 0) && !(book - 0)) {
    return res.status(400).json({
      error: "Theme or Book is required",
    });
  } else if (!user) {
    return res.status(400).json({
      error: "Auth is required",
    });
  } else if (!words) {
    return res.status(400).json({
      error: "Words is required",
    });
  }

  const stats = await Game.postResultsOfTest(user.id, book, theme, words); // get theme info

  return res.json({
    ok: true,
    data: stats,
  });
};

module.exports = { getAllThemesOfBook, testGame, postStats };
