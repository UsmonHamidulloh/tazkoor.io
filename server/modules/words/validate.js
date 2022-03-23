const Joi = require("joi");

const wordSchema = Joi.object().keys({
  title: Joi.string().required().min(1).max(255),
  title_translate: Joi.string().required().min(1).max(255),
  partsofspeech: Joi.number().required(),
  theme: Joi.number(),
  book: Joi.number().required(),
});

module.exports = {
  wordSchema,
};
