const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const UnautorizationError = require('../errors/UnautorizationError');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minlength: [2, 'чувак , минимум 2 символа'],
    maxlength: [31, 'чувак , максимум 30 символов'],
  },
  about: {
    type: String,
    default: 'Исследователь',
    minlength: [2, 'чувак , минимум 2 символа'],
    maxlength: [31, 'чувак , максимум 30 символов'],
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: [validator.isURL, 'родной, введи URL'],
  },
  email: {
    type: String,
    required: [true, 'Поле "email" должно быть заполнено'],
    unique: true,
    validate: [validator.isEmail, 'Введите верный email'],
  },
  password: {
    type: String,
    required: [true, 'поле должно быть заполнено'],
    select: false,
  },
}, { versionKey: false });

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new UnautorizationError('Неправильные почта или пароль'); // обработал ошибку напрямую вместо promise.reject c помощью throw
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnautorizationError('Неправильные почта или пароль');
          }

          return user;
        });
    });
};

// создаём модель и экспортируем её
module.exports = mongoose.model('user', userSchema);
