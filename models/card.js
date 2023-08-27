const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'поле должно быть заполнено'],
      minlength: [2, 'чувак , минимум 2 символа'],
      maxlength: [30, 'чувак , максимум 30 символов'],
    },
    link: {
      type: String,
      required: [true, 'поле должно быть заполнено'],
      validate: {
        validator(url) {
          return /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/.test(url);
        },
        message: 'родной, введи URL',
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: [true, 'поле должно быть заполнено'],
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false },
);

// создаём модель и экспортируем её
module.exports = mongoose.model('card', cardSchema);
