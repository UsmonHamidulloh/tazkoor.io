"use strict";

const createGuts = require("../../helpers/model-guts");
const {
  beforeSave,
  verifyPassword,
  hashPassword,
} = require("../../helpers/passwordHasher");
const sendMail = require("../../helpers/nodemailer");
const numGen = require("../../helpers/random_num_gen");
const moment = require("moment");

const name = "User"; // module name
const tableName = "users"; // table name to work with

const selectableProps = ["id", "name", "email", "avatar"]; // which table columns we select

module.exports = (knex) => {
  const guts = createGuts({
    knex,
    name,
    tableName,
    selectableProps,
  });

  const create = async (props) => {
    const data = await knex
      .select("id")
      .first()
      .from(tableName)
      .where({ email: props.email, is_deleted: false });

    if (!data?.id) {
      return beforeSave(props).then((user) => guts.create(user));
    } else {
      return Promise.reject(`${props.email} email has already been registred`);
    }
  };

  const verify = async (login, password) => {
    const matchErrorMsg = "login or password do not match";
    const notFoundErrorMsg = "email is not correct";

    let user = await knex
      .select()
      .from(tableName)
      .where({ email: login })
      .andWhere({ is_deleted: false })
      .timeout(guts.timeout)
      .first()
      .then(async (user) => {
        if (user) {
          const isPasswordTrue = await verifyPassword(password, user?.password);
          const avatar = await knex.select("*").from("avatars").where({
            id: user.avatar,
          });
          const plan = await knex.select("*").from("plans").where({
            id: user.plan,
          });

          if (isPasswordTrue === false) {
            return matchErrorMsg;
          } else {
            return {
              id: user?.id,
              email: user?.email,
              name: user?.name,
              avatar: avatar[0].color,
              plan: plan[0].name,
              is_verified: user?.is_verified,
            };
          }
        } else {
          return notFoundErrorMsg;
        }
      });

    return user;
  };

  const sendResetPasswordCode = async (email) => {
    const number = numGen(4);
    let startDate = Date.now() - 1000 * 60 * 5; // 5 minutes ago
    let endtDate = Date.now();

    startDate = moment(startDate).format("YYYY-MM-DDTHH:mm:ssZ");
    endtDate = moment(endtDate).format("YYYY-MM-DDTHH:mm:ssZ");

    // check 5 min old codes from database
    const codes = await knex
      .select("code")
      .from("verifications")
      .whereBetween("created_at", [startDate, endtDate]);

    if (codes.length > 0) {
      return "You can send code only once in 5 minutes";
    }

    sendMail({
      adress: email,
      subject: "Reset Password",
      text: `Your reset code is: ${number}`,
    });

    return await knex
      .insert({
        email: email,
        code: number,
      })
      .into("verifications")
      .returning("email")
      .timeout(guts.timeout);
  };

  const verifyResetPasswordCode = async ({ email, code }) => {
    const data = await knex
      .select("email")
      .from("verifications")
      .where({ email: email, code: code })
      .timeout(guts.timeout);

    return data[0];
  };

  const updateUserPasword = async ({ email, password }) => {
    const hashedPassword = await hashPassword(password);

    return await knex
      .update({ password: hashedPassword })
      .from("users")
      .where({ email: email })
      .returning("*");
  };

  return {
    ...guts,
    create,
    verify,
    verifyResetPasswordCode,
    sendResetPasswordCode,
    updateUserPasword,
  };
};
