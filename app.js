const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');

// eslint-disable-next-line import/no-extraneous-dependencies
const helmet = require('helmet');
const bodyParser = require('body-parser');
const limiter = require('./utils/limiter');

const handleErrors = require('./middlewares/handleErrors');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/testdb' } = process.env;

const app = express();

app.use(limiter);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(DB_URL, {
  useNewUrlParser: true,

});
app.use(helmet());

app.use('/', require('./routes/index'));

app.use(errors());
app.use(handleErrors);

app.listen(PORT, () => {

});
