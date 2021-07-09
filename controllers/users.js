const User = require('../models/user');

const NotFoundError = require('../errors/notfound-error');
const RequestError = require('../errors/request-error');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      res.status(err.statusCode).send({
        message: err.statusCode === 500
          ? 'Internal Server error'
          : err.message,
      });
    });
};

module.exports.getUserId = (req, res) => {
  User.findById(req.params.userId)
    .orFail(new NotFoundError('Не найден пользователь с данным id'))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const ERROR = new RequestError('Ошибка. Повторите запрос');
        res.status(ERROR.statusCode).send({ message: ERROR.message });
      }
      res.status(err.statusCode).send({
        message: err.statusCode === 500
          ? 'Internal Server error'
          : err.message,
      });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ _id: user._id }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const ERROR = new RequestError('Ошибка. Повторите запрос');
        res.status(ERROR.statusCode).send({ message: ERROR.message });
      }
      res.status(err.statusCode).send({
        message: err.statusCode === 500
          ? 'Internal Server error'
          : err.message,
      });
    });
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
  })
    .then((updateUser) => {
      res.send((updateUser));
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const ERROR = new RequestError('Ошибка. Повторите запрос');
        res.status(ERROR.statusCode).send({ message: ERROR.message });
      }
      res.status(err.statusCode).send({
        message: err.statusCode === 500
          ? 'Internal Server error'
          : err.message,
      });
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .then((userNewAvatar) => {
      res.send((userNewAvatar));
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const ERROR = new RequestError('Ошибка. Повторите запрос');
        res.status(ERROR.statusCode).send({ message: ERROR.message });
      }
      res.status(err.statusCode).send({
        message: err.statusCode === 500
          ? 'Internal Server error'
          : err.message,
      });
    });
};
