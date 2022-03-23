"use strict";

const createGuts = require("../../helpers/model-guts");

const name = "Book"; // module name
const tableName = "books"; // table name to work with

const selectableProps = [
  "id",
  "title",
  "language_native",
  "language_translate",
]; // which table columns we select

module.exports = (knex) => {
  const guts = createGuts({
    knex,
    name,
    tableName,
    selectableProps,
  });

  const getAllBooks = async ({ user_id, page, limit }) => {
    const books = await knex.raw(
      `select
        b.id,
        b.title,
        b.language_native,
        b.language_translate,
        (select concat(lang.icon, '&&', lang.title, '&&', lang.abbreviation, '&&', lang.id) from languages as lang where lang.id = b.language_native and lang.is_deleted = false) as language_native,
        (select concat(lang.icon, '&&', lang.title, '&&', lang.abbreviation, '&&', lang.id) from languages as lang where lang.id = b.language_translate and lang.is_deleted = false) as language_translate,
        count(th.id) as themes_count,
        count(w.id) as words_count
      from
        books as b
        left join languages as l on b.language_native = l.id
        left join themes as th on b.id = th.book
        left join words as w on w.theme = th.id
      where
        b.is_deleted = false and
        b.user_id = ${user_id}
      group by
        b.id,
        l.id
      order by
        b.id desc`
    );

    books.rows.map((book) => {
      let langNat = book.language_native.split("&&");
      let langTrans = book.language_translate.split("&&");
      id: langTrans[3];

      book.language_native = {
        id: langNat[3],
        icon: langNat[0],
        title: langNat[1],
        abbreviation: langNat[2],
      };

      book.language_translate = {
        id: langTrans[3],
        icon: langTrans[0],
        title: langTrans[1],
        abbreviation: langTrans[2],
      };
    });

    return books.rows;
  };

  const getABookById = async ({ user_id, book_id, page, limit }) => {
    const books = await knex.raw(
      `select
        b.id,
        b.title,
        b.language_native,
        b.language_translate,
        (select concat(lang.icon, '&&', lang.title, '&&', lang.abbreviation, '&&', lang.id) from languages as lang where lang.id = b.language_native and lang.is_deleted = false) as language_native,
        (select concat(lang.icon, '&&', lang.title, '&&', lang.abbreviation, '&&', lang.id) from languages as lang where lang.id = b.language_translate and lang.is_deleted = false) as language_translate,
        count(th.id) as themes_count,
        count(w.id) as words_count
      from
        books as b
        left join languages as l on b.language_native = l.id
        left join themes as th on b.id = th.book
        left join words as w on w.theme = th.id
      where
        b.is_deleted = false and
        b.user_id = ${user_id} and
        b.id = ${book_id}
      group by
        b.id,
        l.id
      order by
        b.id desc`
    );

    books.rows.map((book) => {
      let langNat = book.language_native.split("&&");
      let langTrans = book.language_translate.split("&&");

      book.language_native = {
        id: langNat[3],
        icon: langNat[0],
        title: langNat[1],
        abbreviation: langNat[2],
      };

      book.language_translate = {
        id: langTrans[3],
        icon: langTrans[0],
        title: langTrans[1],
        abbreviation: langTrans[2],
      };
    });

    return books.rows;
  };

  const createBook = async ({
    user_id,
    title,
    language_native,
    language_translate,
  }) => {
    const book = await guts.create({
      user_id,
      title,
      language_native,
      language_translate,
    });

    return book;
  };

  const deleteBook = async ({ userId, bookId }) => {
    const book = await guts.findOne({
      user_id: userId,
      id: bookId,
      is_deleted: false,
    });

    await guts.update(book?.id, { is_deleted: true });

    return book;
  };

  const updateBook = async ({
    userId,
    bookId,
    title,
    language_native,
    language_translate,
  }) => {
    const book = await guts.findOne({ user_id: userId, id: bookId });

    if (!book) {
      throw new Error("Book not found");
    }

    const updatedBook = await guts.update(book.id, {
      title,
      language_native,
      language_translate,
    });

    return updatedBook;
  };

  const getAllJoinedBooks = async (userId) => {
    const books = await knex.raw("select * from user_roles where user_id = ?", [
      userId,
    ]);

    return books.rows;
  };

  return {
    ...guts,
    getAllBooks,
    createBook,
    deleteBook,
    updateBook,
    getABookById,
    getAllJoinedBooks,
  };
};
