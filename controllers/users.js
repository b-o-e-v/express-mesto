const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const NotFoundError = require('../errors/notfound-error');
const RequestError = require('../errors/request-error');
const ConflictError = require('../errors/conflict-error');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.user)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Не найден пользователь с данным id');
      }
      res.send(user);
    })
    .catch(next);
};

module.exports.getUserId = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Не найден пользователь с данным id');
      }
      return res.send({ data: user });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new RequestError('Не валидный id'));
      }
      next(error);
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => {
      User.findOne({ email })
        .then((someUser) => {
          if (!someUser) {
            User.create({
              name,
              about,
              avatar,
              email,
              password: hash,
            }).then((user) => res.send({
              _id: user._id,
              name: user.name,
              about: user.about,
              avatar: user.avatar,
              email: user.email,
            }));
          } else {
            throw new ConflictError(
              'Пользователь с данным email уже существует',
            );
          }
        })
        .catch(next);
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch(next);
};

module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((updateUser) => {
      res.send(updateUser);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new RequestError('Ошибка. Повторите запрос'));
      }
      next(err);
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((userNewAvatar) => {
      res.send(userNewAvatar);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new RequestError('Ошибка. Повторите запрос'));
      }
      next(err);
    });
};
