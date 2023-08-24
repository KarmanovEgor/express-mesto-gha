const express = require('express');
const mongoose = require('mongoose');

const bodyParser = require('body-parser');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/testdb' } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(DB_URL, {
  useNewUrlParser: true,

});

app.use((req, res, next) => {
  req.user = {
    _id: '64e6f7b280965de26c4703e6', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('*', (req, res) => {
  res.status(404).send({ message: 'чувак? камон, страница не найдена' });
});

app.listen(PORT, () => {

});
