"use strict";

const createGuts = require("../../helpers/model-guts");
const shuffle = require("../../helpers/array-shuffle");

const name = "Share"; // module name
const tableName = "words"; // table name to work with

const selectableProps = [
  "id",
  "title",
  "title_translate",
  "partsofspeech",
  "theme",
  "book",
]; // which table columns we select

module.exports = (knex) => {
  const guts = createGuts({
    knex,
    name,
    tableName,
    selectableProps,
  });

  const getWordsByBookThemeOrAll = async ({ theme_id, book_id }) => {
    if (theme_id > 0) {
      return await knex
        .select(
          "w.id",
          "w.title",
          "w.title_translate",
          "w.partsofspeech",
          "w.theme",
          "p.id as partofspeech_id"
        )
        .from("words as w")
        .where({ theme: theme_id })
        .join("partsofspeechs as p", "w.partsofspeech", "p.id");
    } else if (book_id > 0) {
      return await knex
        .select(
          "w.id",
          "w.title",
          "w.title_translate",
          "w.partsofspeech",
          "w.book",
          "p.id as partofspeech_id"
        )
        .from("words as w")
        .where({ book: book_id, theme: null })
        .join("partsofspeechs as p", "w.partsofspeech", "p.id");
    }
  };

  const cardGameFromBook = (book) => {
    let books = knex
      .select(
        "words.id",
        "words.title",
        "words.title_translate",
        "words.partsofspeech",
        "words.theme",
        "words.book"
      )
      .from("words")
      .where("words.book", book);

    books = shuffle(books);

    return books;
  };

  const cardGameFromTheme = (theme) => {
    let books = knex
      .select(
        "words.id",
        "words.title",
        "words.title_translate",
        "words.partsofspeech",
        "words.theme",
        "words.book"
      )
      .from("words")
      .where("words.theme", theme);

    books = shuffle(books);

    return books;
  };

  return {
    ...guts,
    getWordsByBookThemeOrAll,
    cardGameFromBook,
    cardGameFromTheme,
  };
};
