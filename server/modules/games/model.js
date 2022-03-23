"use strict";

const createGuts = require("../../helpers/model-guts");
const shuffle = require("../../helpers/array-shuffle");
const getRandomInt = require("../../helpers/getRandomInt");
const { findBestMatch } = require("string-similarity");

const name = "Game"; // module name
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
  }); // implement guts to the module

  const getThemeInfoById = async (themeId) => {
    let themeInfo = {};

    const data = await knex.raw(
      `
      select
        th.id,
        th.title,
        (select count(words.id) from words where theme = ${
          themeId - 0
        }) as words_count,
        b.id book_id,
      (select concat(lang.icon, '&&', lang.title, '&&', lang.abbreviation, '&&', lang.id) from languages as lang where lang.id = b.language_native and lang.is_deleted = false) as language_native,
      (select concat(lang.icon, '&&', lang.title, '&&', lang.abbreviation, '&&', lang.id) from languages as lang where lang.id = b.language_translate and lang.is_deleted = false) as language_translate
      from
        themes as th
        join books as b on b.id = th.book
      where th.id = ${themeId - 0} group by th.id, b.id
      `
    );

    data.rows.forEach((item) => {
      let langNat = item.language_native.split("&&");
      let langTrans = item.language_translate.split("&&");

      themeInfo = {
        id: item.id,
        title: item.title,
        words_count: item.words_count - 0,
        book_id: item.book_id,
      };

      themeInfo.language_native = {
        id: langNat[3],
        icon: langNat[0],
        title: langNat[1],
        abbreviation: langNat[2],
      };

      themeInfo.language_translate = {
        id: langTrans[3],
        icon: langTrans[0],
        title: langTrans[1],
        abbreviation: langTrans[2],
      };
    }); // mutate theme info

    return themeInfo;
  };

  const testGame = async (themeId, user, bookId) => {
    const theme = +themeId;
    let wordsOfBook = await knex("words").where({
      book: bookId,
      is_deleted: false,
    });
    let titlesOfBookWords = wordsOfBook.map(word => word.title);
    
    let wordsForTest = shuffle(wordsOfBook.filter(word => theme ? word.theme === theme : !word.theme));
    
    let wordsWithOptions = wordsForTest.map(word => {
      const similarWords = findBestMatch(word.title, titlesOfBookWords).ratings.map((item, index) => ({...item, index})).sort((a, b) => b.rating - a.rating);

      const falseOptions = similarWords
        .filter(item => item.target !== word.title)
        .slice(0, 3)
        .map(similarWord => wordsOfBook[similarWord.index]);

    
      const options = [
        ...falseOptions.map(option => ({
          id: option.id,
          title: option.title,
          title_translate: option.title_translate,
          isTrue: false
        })),
        {
          id: word.id,
          title: word.title,
          title_translate: word.title_translate,
          isTrue: true
        }
      ]
    
      return {
        id: word.id,
        title: word.title,
        title_translate: word.title_translate,
        partofspeech: word.partofspeech,
        options: shuffle(options)
      };
    })
    
    return wordsWithOptions;
  };

  const postResultsOfTest = async (user_id, book, theme, words) => {
    const data = await knex("game_stats")
      .insert({
        user_id,
        words: [words],
        book,
        theme,
      })
      .returning("*");

    return data;
  };

  return {
    ...guts,
    getThemeInfoById,
    testGame,
    postResultsOfTest,
  };
};
