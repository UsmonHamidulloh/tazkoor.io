"use strict";

const { User } = require("../collector");
const { sign, verify } = require("../../utils/jwt");
const { signUpSchema, signInSchema } = require("./validate");

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

    props.avatar = getRandomInt(1, 10);

    const [user] = await User.create(props);

    if (user) {
      User.verify(props.email, props.password).then(async (user) => {
        const token = await sign(user, {
          expiresIn: "24h",
        });

        return res.json({
          ok: true,
          message: "User created",
          token: token,
          user,
        });
      });
    }
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      ok: false,
      message: error,
    });
  }
};

const postLogin = async (req, res, next) => {
  const props = req.body;

  const { error } = signInSchema.validate(props);

  if (error) {
    const errorMessage = Object(error.details[0]).message;

    return res.status(400).json({
      ok: false,
      message: errorMessage,
    });
  }

  User.verify(props.login, props.password)
    .then(async (user) => {
      if (typeof user !== "object") {
        return res.status(401).json({
          ok: false,
          message: "Wrong email or password",
        });
      }

      const token = await sign(user, {
        expiresIn: "2400h",
      });

      return res.cookie("token", token, { httpOnly: false }).json({
        ok: true,
        message: "Login successful!",
        user: user,
        token: token,
      });
    })
    .catch((error) => console.error(error));
};

const getUsers = (req, res, next) => {
  const props = req.body;

  User.findAll(props)
    .then((users) =>
      res.json({
        ok: true,
        message: "Users found",
        count: users.length,
        users,
      })
    )
    .catch(next);
};

const getUser = (req, res, next) => {
  const userId = req.headers.id;

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

const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const deleteCount = await User.destroySoft(userId);

    if (!deleteCount) {
      return res.status(404).json({
        ok: false,
        message: `User with '${userId}' id is not exist`,
        deleteCount,
      });
    } else {
      return res.json({
        ok: true,
        message: `User '${userId}' deleted`,
        deleteCount,
      });
    }
  } catch (error) {
    console.error(error);

    return res.json({
      ok: false,
      message: error.message,
    });
  }
};

const resetUserPassword = async (req, res, next) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .send({ ok: false, message: "You need to sign in/up first" });
    }

    const sentEmail = await User.sendResetPasswordCode(req.user?.email);

    if (sentEmail) {
      return res.json({
        ok: true,
        message: `Email sent to ${sentEmail}`,
      });
    } else {
      return res.status(500).json({
        ok: false,
        message: "Something went wrong",
      });
    }
  } catch (error) {
    console.error(error);

    return res.json({
      ok: false,
      message: error.message,
    });
  }
};

const verifyResetPasswordCode = async (req, res, next) => {
  try {
    const data = await User.verifyResetPasswordCode(req.body);

    if (data?.email) {
      const resetToken = await sign(data.email);

      return res.cookie("reset_token", resetToken).json({
        ok: true,
        message: `Verification for ${data.email} is correct.`,
      });
    } else {
      res.json({
        ok: true,
        message: `There is no ${req?.body?.email} address`,
      });
    }
  } catch (error) {
    console.error(error);

    return res.json({
      ok: false,
      message: error.message,
    });
  }
};

const updateUserPassword = async (req, res, next) => {
  const email = await verify(req?.cookies?.reset_token);
  const password = req?.body?.password;

  if (email && password) {
    const data = await User.updateUserPasword({ email, password });

    return res.json(data);
  } else {
    return res.status(400).json({
      ok: false,
      message: "Email and password are required",
    });
  }
};

module.exports = {
  signUp: postUsers,
  signIn: postLogin,
  getUsers,
  getUser,
  putUser,
  deleteUser,
  resetUserPassword,
  verifyResetPasswordCode,
  updateUserPassword,
};
