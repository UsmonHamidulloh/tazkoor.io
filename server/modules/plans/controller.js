"use strict";

const { User } = require("../collector");
const { sign } = require("../../utils/jwt");
const { signUpSchema } = require("./validate");
const {
  createError,
  BAD_REQUEST,
  UNAUTHORIZED,
} = require("../../helpers/error_helper");

const postUsers = async (req, res, next) => {
  try {
    const props = req.body;

    const { error } = signUpSchema.validate(props);

    if (error) {
      const errorMessage = Object(error.details[0]).message;

      return res.status(400).json({
        ok: false,
        message: errorMessage,
      });
    }

    delete props.repeat_password;

    const user = await User.create(props);

    return res.json({
      ok: true,
      message: "User created",
      user,
    });
  } catch (error) {
    return res.json({
      ok: true,
      message: error,
      user: "nill",
    });
  }
};

const postLogin = async (req, res, next) => {
  const props = req.body;

  User.verify(props.username, props.password)
    .then(async (user) => {
      const token = await sign(user, {
        expiresIn: "24h",
      });

      return res.cookie("token", token).json({
        ok: true,
        message: "Login successful!",
        token: token,
      });
    })
    .catch((err) =>
      next(
        createError({
          status: UNAUTHORIZED,
          message: err,
        })
      )
    );
};

const getUsers = (req, res, next) => {
  const props = req.body;

  User.findAll(props)
    .then((users) =>
      res.json({
        ok: true,
        message: "Users found",
        users,
      })
    )
    .catch(next);
};

const getUser = (req, res, next) => {
  const userId = req.params.id;

  User.findById(userId)
    .then((user) =>
      res.json({
        ok: true,
        message: "User found",
        user,
      })
    )
    .catch(next);
};

const putUser = (req, res, next) => {
  const userId = req.params.id;
  const props = req.body.user;

  User.update(userId, props)
    .then((user) =>
      res.json({
        ok: true,
        message: "User updated",
        user,
      })
    )
    .catch(next);
};

const deleteUser = (req, res, next) => {
  const userId = req.body?.id;

  User.destroy(userId)
    .then((deleteCount) =>
      res.json({
        ok: true,
        message: `User '${userId}' deleted`,
        deleteCount,
      })
    )
    .catch(next);
};

const blockUser = (req, res, next) => {
  const userId = req.body?.id;

  User.block(userId);
};

module.exports = {
  signUp: postUsers,
  signIn: postLogin,
  getUsers,
  getUser,
  putUser,
  deleteUser,
  blockUser,
};
