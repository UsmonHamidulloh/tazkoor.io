const Joi = require("joi");

const bookSchema = Joi.object().keys({
  book_id: Joi.number().integer(),
  title: Joi.string().required().min(1).max(255),
  language_native: Joi.number().required(),
  language_translate: Joi.number().required(),
});

module.exports = {
  bookSchema,
};
