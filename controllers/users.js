const User = require('../models/user');

const ERROR_CODE_400 = {
  status: 400,
  message: 'Переданы некорректные данные.',
};

const ERROR_CODE_404 = {
  status: 404,
  message: 'Пользователь по указанному _id не найден.',
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((user) => res.send(user))
    .catch((err) => res.status(500).send(err.message));
};

module.exports.getUserId = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') res.status(ERROR_CODE_404.status).send({ message: ERROR_CODE_404.message });
      res.status(500).send(err.message);
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') res.status(ERROR_CODE_400.status).send({ message: ERROR_CODE_400.message });
      res.status(500).send(err.message);
    });
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
    upsert: true,
  })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') res.status(ERROR_CODE_400.status).send({ message: ERROR_CODE_400.message });
      if (err.name === 'CastError') res.status(ERROR_CODE_404.status).send({ message: ERROR_CODE_404.message });
      res.status(500).send(err.message);
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
    upsert: true,
  })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') res.status(ERROR_CODE_400.status).send({ message: ERROR_CODE_400.message });
      if (err.name === 'CastError') res.status(ERROR_CODE_404.status).send({ message: ERROR_CODE_404.message });
      res.status(500).send(err.message);
    });
};
