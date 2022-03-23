"use strict";

const { Theme } = require("../collector");
const {} = require("./validate");

const getAllThemesOfBook = async (req, res) => {
  const { book, page, limit } = req.headers;
  const user = req.user;

  if (!book) return res.status(400).send({ message: "book_id is required" });

  const themes = await Theme.getAllThemes({ book_id: book }, user);

  return res.json({
    ok: true,
    data: themes,
    themes_count: themes.length,
  });
};

const createTheme = async (req, res) => {
  try {
    const { book_id, title } = req.body;
    const user = req.user;

    if (!user) return res.status(401).send({ message: "Unauthorized" });
    if (!book_id)
      return res.status(400).send({ message: "book_id is required" });
    if (!title) return res.status(400).send({ message: "title is required" });

    const theme = await Theme.createTheme(
      { book_id, title, user_id: user.id },
      user
    );

    return res.json(theme);
  } catch (error) {
    console.error(error);

    return res.status(500).send({ message: error.message });
  }
};

const deleteTheme = async (req, res) => {
  try {
    const { id } = req.body;
    const user = req.user;

    if (!user) return res.status(401).send({ message: "Unauthorized" });
    if (!id) return res.status(400).send({ message: "id is required" });

    const theme = await Theme.deleteTheme({ id }, user.id);

    if (theme === undefined) {
      return res.status(404).json({ message: "not found" });
    }

    return res.json({
      ok: true,
      message: "deleted",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).send({ message: error.message });
  }
};

const updateTheme = async (req, res) => {
  try {
    const { id, title } = req.body;
    const user = req.user;

    if (!user) return res.status(401).send({ message: "Unauthorized" });
    if (!id) return res.status(400).send({ message: "id is required" });
    if (!title) return res.status(400).send({ message: "title is required" });

    const theme = await Theme.updateTheme({ id, title }, user.id);

    if (theme === undefined) {
      return res.status(404).json({ message: "not found" });
    }

    return res.json({
      ok: true,
      message: "updated",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).send({ message: error.message });
  }
};

module.exports = { getAllThemesOfBook, createTheme, deleteTheme, updateTheme };
