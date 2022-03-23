"use strict";

const router = require("express").Router();

const {
  uploadAvatar,
  createAvatar,
  deleteAvatar,
  getAllAvatars,
  updateAvatar,
} = require("./controller");

// router.route("/avatars").post(uploadAvatar);
router
  .route("/avatars")
  .post(createAvatar)
  .delete(deleteAvatar)
  .get(getAllAvatars)
  .put(updateAvatar);

module.exports = router;
