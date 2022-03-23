"use strict";

const createGuts = require("../../helpers/model-guts");

const name = "Avatar"; // module name
const tableName = "avatars"; // table name to work with

const selectableProps = ["id", "color"]; // which table columns we select

module.exports = (knex) => {
  const guts = createGuts({
    knex,
    name,
    tableName,
    selectableProps,
  });

  return {
    ...guts,
  };
};
