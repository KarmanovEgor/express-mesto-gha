const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
// eslint-disable-next-line import/no-extraneous-dependencies
const helmet = require('helmet');

const bodyParser = require('body-parser');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/testdb' } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(DB_URL, {
  useNewUrlParser: true,

});
app.use(helmet());

app.use('/', require('./routes/index'));

app.use('*', (req, res) => {
  res.status(404).send({ message: 'чувак? камон, страница не найдена' });
});
app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT, () => {

});
