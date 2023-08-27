const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'поле должно быть заполнено'],
      minlength: [2, 'чувак , минимум 2 символа'],
      maxlength: [31, 'чувак , максимум 30 символов'],
    },
    about: {
      type: String,
      required: [true, 'поле должно быть заполнено'],
      minlength: [2, 'чувак , минимум 2 символа'],
      maxlength: [31, 'чувак , максимум 30 символов'],
    },
    avatar: {
      type: String,
      required: [true, 'поле должно быть заполнено'],
      validate: {
        validator(url) {
          return /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/.test(url);
        },
        message: 'родной, введи URL',
      },
    },
  },
  { versionKey: false },
);

// создаём модель и экспортируем её
module.exports = mongoose.model('user', userSchema);
