const Joi = require("joi");
const { lotteryDate } = require("./custom.validation");
const getLottery = {
  params: Joi.object().keys({
    dealer: Joi.string().required(),
    date: Joi.string().required().custom(lotteryDate),
  }),
};

module.exports = {
  getLottery,
};
