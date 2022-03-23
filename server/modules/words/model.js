"use strict";

const createGuts = require("../../helpers/model-guts");

const name = "Word"; // module name
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
  }); // create model guts

  const createWord = (word) => {
    return guts.create(word);
  }; // create word using model guts

  const getWord = (id) => {
    return guts.read(id);
  }; // get word using model guts

  const deleteWord = async (id, userId) => {
    const word = await knex
      .select("id")
      .from("words")
      .where({ id, user_id: userId, is_deleted: false })
      .first();

    if (!word) {
      return false;
    }

    return guts.destroySoft(word?.id);
  }; // delete word using model guts

  const updateWord = async (id, userId, props) => {
    const word = await knex
      .select("id")
      .from("words")
      .where({ id, user_id: userId, is_deleted: false })
      .first(); // get user's word if it exists in db then update it

    if (!word) {
      return false;
    }

    return guts.update(word?.id, props);
  }; // update word using model guts

  const getWordsByBookThemeOrAll = async ({ theme_id, book_id }) => {
    if (theme_id > 0) {
      return await knex
        .select(
          "w.id",
          "w.title",
          "w.title_translate",
          "w.partsofspeech",
          "w.theme",
          "w.book",
          "p.id as partofspeech_id"
        )
        .from("words as w")
        .where({ theme: theme_id, is_deleted: false })
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
        .where({ book: book_id, theme: null, is_deleted: false })
        .join("partsofspeechs as p", "w.partsofspeech", "p.id");
    }
  }; // get words by book theme or all

  return {
    ...guts,
    createWord,
    deleteWord,
    updateWord,
    getWord,
    getWordsByBookThemeOrAll,
  };
};
