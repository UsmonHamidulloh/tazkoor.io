"use strict";

const createGuts = require("../../helpers/model-guts");

const name = "Partsofspeech"; // module name
const tableName = "partsofspeechs"; // table name to work with

const selectableProps = ["id", "color"]; // which table columns we select

module.exports = (knex) => {
  const guts = createGuts({
    knex,
    name,
    tableName,
    selectableProps,
  });

  const createPartsofspeech = guts.create;
  const getPartsofspeech = guts.get;
  const getPartsofspeechById = guts.getById;
  const getPartsofspeechByName = guts.getByName;
  const getPartsofspeechs = guts.getAll;
  const updatePartsofspeech = guts.update;
  const deletePartsofspeech = guts.delete;

  return {
    ...guts,
    createPartsofspeech,
    getPartsofspeech,
    getPartsofspeechById,
    getPartsofspeechByName,
    getPartsofspeechs,
    updatePartsofspeech,
    deletePartsofspeech,
  };
};
