"use strict";

const bcrypt = require("bcrypt");
const createGuts = require("../../helpers/model-guts");

const name = "Plan"; // module name
const tableName = "plans"; // table name to work with

const selectableProps = ["id", "name", "email", "username", "avatar"]; // which table columns we select

const SALT_ROUNDS = 10;
const hashPassword = (password) => bcrypt.hash(password, SALT_ROUNDS);
const verifyPassword = (password, hash) => bcrypt.compare(password, hash);

const beforeSave = (user) => {
  if (!user.password) return Promise.resolve(user);

  return hashPassword(user.password)
    .then((hash) => ({ ...user, password: hash }))
    .catch((err) => `Error hashing password: ${err}`);
};

module.exports = (knex) => {
  const guts = createGuts({
    knex,
    name,
    tableName,
    selectableProps,
  });

  const create = async (props) => {
    // check username, email is not taken
    const data = await knex
      .select("id")
      .first()
      .from(tableName)
      .where({ username: props.username })
      .orWhere({ email: props.email });

    if (!data?.id) {
      return beforeSave(props).then((user) => guts.create(user));
    } else {
      return Promise.reject(`${props.username} or ${props.email} is taken`);
    }
  };

  const verify = async (username, password) => {
    const matchErrorMsg = "Username or password do not match";

    let user = await knex
      .select()
      .from(tableName)
      .where({ username })
      .andWhere({ is_deleted: false })
      .timeout(guts.timeout)
      .first()
      .then(async (user) => {
        const isPasswordTrue = await verifyPassword(password, user?.password);

        if (isPasswordTrue === false) {
          throw matchErrorMsg;
        } else {
          return {
            id: user.id,
            username: user.username,
          };
        }
      });

    return user;
  };

  return {
    ...guts,
    create,
    verify,
  };
};
