const Joi = require("joi");
const { objectId, dealerOrder } = require("./custom.validation");

const createAgency = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    deOrRe: Joi.boolean(),
    type: Joi.boolean(),
    isAlert: Joi.boolean(),
    syntax: Joi.string(),
    calKI: Joi.number(),
    divide: Joi.string(),
    northern: Joi.string(),
    central: Joi.string(),
    south: Joi.string(),
    dealerOrder: Joi.array().custom(dealerOrder),
  }),
};

const getAgencies = {
  query: Joi.object().keys({
    name: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getAgency = {
  params: Joi.object().keys({
    agencyId: Joi.string().custom(objectId),
  }),
};

const updateAgency = {
  params: Joi.object().keys({
    agencyId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      deOrRe: Joi.boolean(),
      type: Joi.boolean(),
      isAlert: Joi.boolean(),
      syntax: Joi.string(),
      calKI: Joi.number(),
      divide: Joi.string(),
      northern: Joi.string(),
      central: Joi.string(),
      south: Joi.string(),
      dealerOrder: Joi.array().custom(dealerOrder),
    })
    .min(1),
};

const deleteAgency = {
  params: Joi.object().keys({
    agencyId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createAgency,
  getAgencies,
  getAgency,
  updateAgency,
  deleteAgency,
};
