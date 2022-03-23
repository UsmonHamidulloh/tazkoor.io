"use strict";

const router = require("express").Router();

const {
  signUp,
  signIn,
  getUsers,
  getUser,
  putUser,
  deleteUser,
  resetUserPassword,
  verifyResetPasswordCode,
  updateUserPassword,
} = require("./controller");

router.route("/users").get(getUsers);
router.route("/register").post(signUp);
router.route("/login").post(signIn);
router.route("/login/reset").post(resetUserPassword);
router.route("/login/reset/verify").post(verifyResetPasswordCode);
router.route("/login/password/update").post(updateUserPassword);
router.route("/users/:id").get(getUser).put(putUser).delete(deleteUser);

module.exports = router;
