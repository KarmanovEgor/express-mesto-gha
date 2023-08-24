const Card = require('../models/card');

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      Card.findById(card._id)
        .populate('owner')
        .then((data) => res.status(201).send(data))
        .catch(() => res.status(404).send({ message: 'бро, карточка с данным _id не найдена' }));
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: err.message });
      } else {
        res.status(500).send({ message: 'Ошибка на сервере' });
      }
    });
};
module.exports.getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.status(201).send(cards))
    .catch(() => res.status(500).send({ message: 'бро, ошибка на сервере' }));
};
module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  if (cardId.length !== 24) {
    res.status(400).send({ message: 'Некорректный идентификатор карточки' });
    return;
  }
  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Карточка не найдена' });
        return;
      }
      res.send({ message: 'Карточка удалена' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Некорректный идентификатор карточки' });
        return;
      }
      res.status(500).send({ message: 'бро, ошибка на сервере' });
    });
};
module.exports.likeCard = (req, res) => {
  if (req.params.cardId.length === 24) {
    Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
      .populate(['owner', 'likes'])
      .then((card) => {
        if (!card) {
          res.status(404).send({ message: 'бро, карточка по данному _id не найдена' });
          return;
        }
        res.send(card);
      })
      .catch(() => res.status(404).send({ message: 'бро, карточка по данному _id не найдена' }));
  } else {
    res.status(400).send({ message: 'бро, некорректный _id ' });
  }
};
module.exports.dislikeCard = (req, res) => {
  if (req.params.cardId.length === 24) {
    Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
      .populate(['owner', 'likes'])
      .then((card) => {
        if (!card) {
          res.status(404).send({ message: 'бро, карточка по данному _id не найдена' });
          return;
        }
        res.send(card);
      })
      .catch(() => res.status(404).send({ message: 'бро, карточка по данному _id не найдена' }));
  } else {
    res.status(400).send({ message: 'бро, некорректный _id ' });
  }
};
