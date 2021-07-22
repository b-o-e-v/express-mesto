const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const NotFoundError = require('./errors/notfound-error');

const { login, createUser } = require('./controllers/users');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.post('/signin', login);
app.post('/signup', createUser);

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.all('*', (req, res) => {
  const ERROR = new NotFoundError('Ресурс не найден');
  res.status(ERROR.statusCode).send({ message: ERROR.message });
});

app.use((error, req, res, next) => {
  const { statusCode = 500, message } = error;
  res.status(statusCode).send({
    message: statusCode === 500
      ? 'Internal Server error'
      : message,
  });
  next();
});

app.listen(PORT);
