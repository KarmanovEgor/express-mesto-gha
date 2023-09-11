const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers,
  getUserById,
  editUser,
  editUserAvatar,
  getMe,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getMe);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
  }),
}), getUserById);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().min(2).max(30),
    password: Joi.string().min(2).max(30),
  }),
}), editUser);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/),
  }),
}), editUserAvatar);
module.exports = router;
