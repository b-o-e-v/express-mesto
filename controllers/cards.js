const Card = require('../models/card');

const RequestError = require('../errors/request-error');
const NotFoundError = require('../errors/notfound-error');
const ForbiddenError = require('../errors/forbidden-error');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => {
      res.status(err.statusCode).send({
        message: err.statusCode === 500
          ? 'Internal Server error'
          : err.message,
      });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const ERROR = new RequestError('Ошибка. Повторите запрос');
        res.status(ERROR.statusCode).send({ message: ERROR.message });
        return;
      }
      res.status(err.statusCode).send({
        message: err.statusCode === 500
          ? 'Internal Server error'
          : err.message,
      });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findById(req.params.cardId)
    .orFail(new NotFoundError('Не найдена карточка с данным id'))
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        const ERROR = new ForbiddenError('У Вас недостаточно прав');
        res.status(ERROR.statusCode).send({ message: ERROR.message });
        return;
      }
      card.remove()
        .then(() => res.send({ message: 'Kарточка удалена' }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const ERROR = new RequestError('Ошибка. Повторите запрос');
        res.status(ERROR.statusCode).send({ message: ERROR.message });
        return;
      }
      res.status(err.statusCode).send({
        message: err.statusCode === 500
          ? 'Internal Server error'
          : err.message,
      });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId,
    { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail(new NotFoundError('Не найдена карточка с данным id'))
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const ERROR = new RequestError('Ошибка. Повторите запрос');
        res.status(ERROR.statusCode).send({ message: ERROR.message });
        return;
      }
      res.status(err.statusCode).send({
        message: err.statusCode === 500
          ? 'Internal Server error'
          : err.message,
      });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId,
    { $pull: { likes: req.user._id } }, { new: true })
    .orFail(new NotFoundError('Не найдена карточка с данным id'))
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const ERROR = new RequestError('Ошибка. Повторите запрос');
        res.status(ERROR.statusCode).send({ message: ERROR.message });
        return;
      }
      res.status(err.statusCode).send({
        message: err.statusCode === 500
          ? 'Internal Server error'
          : err.message,
      });
    });
};
