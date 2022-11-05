const Joi = require("joi");
const { objectId } = require("./custom.validation");

const subMesasage = Joi.array().items(
  Joi.object().keys({
    tin: Joi.string(),
    dai: Joi.array(),
    so: Joi.string(),
    kieu: Joi.string(),
    tien: Joi.number(),
    donVi: Joi.number(),
  })
);

const createMessage = {
  body: Joi.object().keys({
    date: Joi.string(),
    customerName: Joi.string().required(),
    check: Joi.number(),
    messageContent: Joi.string().required(),
    agency: Joi.string().custom(objectId),
    profit: Joi.number(),
    loss: Joi.number(),
  }),
};

// const createMessages = {
//   body: Joi.array().items(
//     Joi.object().keys({
//       agency: Joi.string().custom(objectId),
//       name: Joi.string(),
//       customerName: Joi.string().required(),
//       check: Joi.number(),
//       dealer: Joi.string().required(),
//       numbers: Joi.string().required(),
//       type: Joi.string().required(),
//       bet: Joi.number(),
//       capital: Joi.number(),
//       win: Joi.boolean(),
//       profit: Joi.number(),
//       loss: Joi.number(),
//     })
//   ),
// };

const getMessages = {
  query: Joi.object().keys({
    agency: Joi.string().custom(objectId),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getMessage = {
  params: Joi.object().keys({
    messageId: Joi.string().custom(objectId),
  }),
};

const findMessage = {
  query: Joi.object().keys({
    agency: Joi.string().custom(objectId),
    start: Joi.number().integer().required(),
    end: Joi.number().integer().required(),
  }),
};

// const updateMessage = {
//   params: Joi.object().keys({
//     messageId: Joi.required().custom(objectId),
//   }),
//   body: Joi.object()
//     .keys({
//       date: Joi.string(),
//       customerName: Joi.string().required(),
//       check: Joi.number(),
//       messageContent: Joi.string().required(),
//       agency: Joi.string().custom(objectId),
//       messages: Joi.array().items(
//         Joi.object().keys({
//           tin: Joi.string(),
//           dai: Joi.array(),
//           so: Joi.string(),
//           kieu: Joi.string(),
//           tien: Joi.number(),
//           donVi: Joi.number(),
//         })
//       ),
//       profit: Joi.number(),
//       loss: Joi.number(),
//       confirmed: Joi.boolean(),
//     })
//     .min(1),
// };

const updateMessage = {
  params: Joi.object().keys({
    messageId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      date: Joi.string(),
      customerName: Joi.string().required(),
      check: Joi.number(),
      messageContent: Joi.string().required(),
      agency: Joi.string().custom(objectId),
      profit: Joi.number(),
      loss: Joi.number(),
    })
    .min(1),
};

const deleteMessage = {
  params: Joi.object().keys({
    messageId: Joi.string().custom(objectId),
  }),
};

const checkMessage = {
  params: Joi.object().keys({
    messageId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createMessage,
  getMessages,
  getMessage,
  findMessage,
  updateMessage,
  deleteMessage,
  checkMessage,
};
