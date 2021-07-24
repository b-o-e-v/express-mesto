const Card = require('../models/card');

const RequestError = require('../errors/request-error');
const NotFoundError = require('../errors/notfound-error');
const ForbiddenError = require('../errors/forbidden-error');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new RequestError('Ошибка. Повторите запрос'));
      }
      next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(new NotFoundError('Не найдена карточка с данным id'))
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError('У Вас недостаточно прав');
      }
      card.remove().then(() => res.send({ message: 'Kарточка удалена' }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new RequestError('Ошибка. Повторите запрос'));
      }
      next(err);
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new NotFoundError('Не найдена карточка с данным id'))
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new RequestError('Ошибка. Повторите запрос'));
      }
      next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new NotFoundError('Не найдена карточка с данным id'))
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new RequestError('Ошибка. Повторите запрос'));
      }
      next(err);
    });
};
