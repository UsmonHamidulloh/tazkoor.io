"use strict";

const { Language } = require("../collector");
const {} = require("./validate");

const getAllLanguages = async (req, res) => {
  const langs = await Language.getAllLanguages({});

  return res.json({
    ok: true,
    message: "success",
    data: langs,
  });
};

module.exports = {
  getAllLanguages,
};
