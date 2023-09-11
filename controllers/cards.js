const { HTTP_STATUS_OK, HTTP_STATUS_CREATED } = require('http2').constants;
const { default: mongoose } = require('mongoose'); const Card = require('../models/card');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      card.populate('owner')
        .then((data) => res.status(HTTP_STATUS_CREATED).send(data))
        .catch(next);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(err.message));
      } else {
        next(err);
      }
    });
};

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.status(HTTP_STATUS_OK).send(cards))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError(`Карточка с идентификатором ${req.params.cardId} не найдена`);
      }
      if (!card.owner.equals(req.user._id)) {
        throw new ForbiddenError('Нельзя удалить чужую карточку');
      }
      return Card.deleteOne({ _id: card._id });
    })
    .then(() => {
      res.status(HTTP_STATUS_OK).send({ message: 'Карточка удалена' });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError || err instanceof ForbiddenError) {
        next(new BadRequestError(err.message));
      } else if (err instanceof NotFoundError) {
        next(err);
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail()
    .populate(['owner', 'likes'])
    .then((card) => {
      res.status(HTTP_STATUS_OK).send(card);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError(`карточка с данный идентификатором не найдена ${req.params.cardId}`));
      } else if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError(`Некорректный идентификатор карточки: ${req.params.cardId}`));
      } else {
        next(err);
      }
    });
};
module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail()
    .populate(['owner', 'likes'])
    .then((card) => {
      res.status(HTTP_STATUS_OK).send(card);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError(`карточка с данный идентификатором не найдена ${req.params.cardId}`));
      } else if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError(`Некорректный идентификатор карточки: ${req.params.cardId}`));
      } else {
        next(err);
      }
    });
};
