const Joi = require("joi");

const schema = Joi.object({
  name: Joi.string().required().max(250).min(1),
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  repeat_password: Joi.ref("password"),
  avatar: Joi.number().required(),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
})
  .with("username", "password")
  .with("password", "repeat_password");

module.exports = {
  signUpSchema: schema,
};
