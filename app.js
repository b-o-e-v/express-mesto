const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const NotFoundError = require('./errors/notfound-error');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use((req, res, next) => {
  req.user = {
    _id: '60e082d1aaf3a9ea3d918a24',
  };

  next();
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.all('*', (req, res) => {
  const ERROR = new NotFoundError('Ресурс не найден');
  res.status(ERROR.statusCode).send({ message: ERROR.message });
});

app.listen(PORT);
