"use strict";
const path = require("path");

const { Avatar } = require("../collector");

const uploadAvatar = async (req, res, next) => {
  try {
    let avatar;
    let uploadPath;

    avatar = req.files.avatar;
    uploadPath = path.join(__dirname, "/../../../public/avatars", avatar.name);

    avatar.mv(uploadPath, function (err) {
      if (err) return res.status(500).send(err);

      return res.send("File uploaded!");
    });
  } catch (error) {
    console.error(error);

    return res.json({
      ok: false,
      message: error.message,
    });
  }
};

const getAllAvatars = async (req, res, next) => {
  try {
    const avatars = await Avatar.findAll(req.headers);

    return res.json({
      ok: true,
      avatars,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      ok: false,
      message: error.message,
    });
  }
};

const createAvatar = async (req, res, next) => {
  try {
    const { color } = req.body;

    const avatar = await Avatar.create({ color });

    return res.send(avatar);
  } catch (error) {
    console.error(error);

    return res.json({
      ok: false,
      message: error.message,
    });
  }
};

const deleteAvatar = async (req, res, next) => {
  try {
    const { id } = req.body || {};

    const avatarId = await Avatar.destroy(id);

    if (avatarId.length) {
      return res.json({ id: avatarId[0] });
    } else {
      return res.status(404).send({
        ok: false,
        message: "Avatar not found",
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

const updateAvatar = async (req, res, next) => {
  try {
    const { id, color } = req.body;

    if (!id || !color) {
      return res.status(400).send({
        ok: false,
        message: "id and color are required",
      });
    }

    const avatar = await Avatar.update(id, { color });

    if (!avatar.length) {
      return res.send({
        ok: false,
        message: "Avatar not found",
      });
    }

    return res.send(avatar);
  } catch (error) {
    console.error(error);

    return res.json({
      ok: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAllAvatars,
  uploadAvatar,
  createAvatar,
  deleteAvatar,
  updateAvatar,
};
