const Joi = require("joi");

const signUpSchema = Joi.object({
  name: Joi.string().required().max(250).min(1),
  // username: Joi.string().alphanum().min(4).max(30),
  password: Joi.string()
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
    .min(8)
    .max(64)
    .required(),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
}).with("email", "password");

const signInSchema = Joi.object({
  // login: Joi.alternatives().try(
  //   Joi.string().email(),
  //   Joi.string().alphanum().min(4).max(30).required()
  // ),
  login: Joi.string().email(),
  password: Joi.string()
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
    .min(8)
    .max(64)
    .required(),
}).with("username", "password");

module.exports = {
  signUpSchema,
  signInSchema,
};
