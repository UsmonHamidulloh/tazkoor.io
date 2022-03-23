"use strict";

const createGuts = require("../../helpers/model-guts");

const name = "Language"; // module name
const tableName = "languages"; // table name to work with
const selectableProps = ["id", "icon", "title", "abbreviation"];

module.exports = (knex) => {
  const guts = createGuts({
    knex,
    name,
    tableName,
    selectableProps,
  });

  const createLanguage = (title, abbreviation) => {
    return guts.create({
      title,
      abbreviation,
    });
  };

  const getAllLanguages = ({ offset, page }) => {
    return guts.findAll({ offset, page });
  };

  const getLanguageById = (id) => {
    return guts.getById(id);
  };

  const getLanguageByAbbreviation = (abbreviation) => {
    return guts.getBy({ abbreviation });
  };

  const updateLanguage = (id, title, abbreviation) => {
    return guts.update(id, {
      title,
      abbreviation,
    });
  };

  const deleteLanguage = (id) => {
    return guts.destroySoft(id);
  };

  return {
    ...guts,
    createLanguage,
    getAllLanguages,
    getLanguageById,
    getLanguageByAbbreviation,
    updateLanguage,
    deleteLanguage,
  };
};
