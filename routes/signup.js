const { celebrate, Joi } = require('celebrate');
// const validator = require('validator'); не получилось у меня через валидатор
const router = require('express').Router();
const { createUser } = require('../controllers/users');

// const urlPattern = new RegExp('^(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})([/\\w .-]*)*/?$');

router.post('/', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(2),
    name: Joi.string().min(2).max(30),
    // avatar: Joi.string().allow('').pattern(new RegExp(validator.isURL())),
    avatar: Joi.string().pattern(/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/),
    about: Joi.string().min(2).max(30),
  }),
}), createUser);
module.exports = router;
