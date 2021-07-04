const Card = require('../models/card');

const ERROR_CODE_400 = {
  status: 400,
  message: 'Переданы некорректные данные.',
};

const ERROR_CODE_404 = {
  status: 404,
  message: 'Карточка с указанным _id не найдена.',
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => res.status(500).send(err.message));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((cards) => res.send(cards))
    .catch((err) => {
      if (err.name === 'ValidationError') res.status(ERROR_CODE_400.status).send({ message: ERROR_CODE_400.message });
      res.status(500).send(err.message);
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((cards) => res.send(cards))
    .catch((err) => {
      if (err.name === 'CastError') res.status(ERROR_CODE_404.status).send({ message: ERROR_CODE_404.message });
      res.status(500).send(err.message);
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((cards) => res.send(cards))
    .catch((err) => {
      if (err.name === 'ValidationError') res.status(ERROR_CODE_400.status).send({ message: ERROR_CODE_400.message });
      res.status(500).send(err.message);
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((cards) => res.send(cards))
    .catch((err) => {
      if (err.name === 'ValidationError') res.status(ERROR_CODE_400.status).send({ message: ERROR_CODE_400.message });
      res.status(500).send(err.message);
    });
};
