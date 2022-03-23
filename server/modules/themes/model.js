"use strict";

const createGuts = require("../../helpers/model-guts");

const name = "Theme"; // module name
const tableName = "themes"; // table name to work with

const selectableProps = ["id", "title"]; // which table columns we select

module.exports = (knex) => {
  const guts = createGuts({
    knex,
    name,
    tableName,
    selectableProps,
  }); // implement guts to the module

  const getAllThemes = async ({ book_id }) => {
    const words = await knex.raw(
      `select
        th.id,
        th.title,
        (select count(id) from words where words.theme = th.id and words.is_deleted = false) as words_count
      from
        themes as th
        left join words as w on w.theme = th.id
      where
      th.book = ${book_id - 0} and
        th.is_deleted = false
      group by th.id

      `
    );

    return words.rows;
  };

  const createTheme = async ({ book_id, title, user_id }) => {
    const theme = await guts.create({
      book: book_id,
      user_id: user_id,
      title,
    });

    return theme;
  };

  const deleteTheme = async ({ id }, user_id) => {
    const theme = await guts
      .db()
      .update({ is_deleted: true })
      .from("themes")
      .where({ id: id, user_id: user_id, is_deleted: false })
      .returning("*");

    return theme[0];
  };

  const updateTheme = async ({ id, title }, user_id) => {
    const theme = await guts
      .db()
      .update({ title })
      .from("themes")
      .where({ id: id, user_id: user_id, is_deleted: false })
      .returning("*");

    return theme[0];
  };

  return {
    ...guts,
    getAllThemes,
    createTheme,
    deleteTheme,
    updateTheme,
  };
};
