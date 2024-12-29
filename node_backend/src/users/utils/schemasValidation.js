const Joi = require('@hapi/joi');

const schemas = {
  signUp: Joi.object().keys({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    passwordConfirmation: Joi.string().required(),
    name: Joi.string().required(),
    role: Joi.string().required(),
  }),

  login: Joi.object().keys({
    emailOrUsername: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

module.exports = schemas;
