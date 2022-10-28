const httpStatus = require("http-status");
const { Message, Agency } = require("../models");
const { getLotteryResults } = require("../utils/lottery");
const ApiError = require("../utils/ApiError");

/**
 * Create a message
 * @param {Object} messageBody
 * @returns {Promise<Message>}
 */
const createMessage = async (messageBody, userId) => {
  const agency = await Agency.findById(messageBody.agency);
  if (!agency) {
    throw new ApiError(httpStatus.NOT_FOUND, "Agency id is not found");
  }
  if (!agency.contractor.equals(userId)) {
    throw new ApiError(httpStatus.FORBIDDEN, "Forbidden");
  }
  messageBody.confirmed = false;
  return Message.create(messageBody);
};

/**
 * Create messages
 * @param {Object} messageBody
 * @returns {Promise<Message>}
 */
const createMessages = async (messageBody, userId) => {
  for (let i = 0; i < messageBody.length; i++) {
    const agency = await Agency.findById(messageBody[i].agency);
    if (!agency) {
      throw new ApiError(httpStatus.NOT_FOUND, "Agency id is not found");
    }
    if (!agency.contractor.equals(userId)) {
      throw new ApiError(httpStatus.FORBIDDEN, "Forbidden");
    }
    messageBody[i].confirmed = false;
    messageBody.winNumbers = "";
  }
  return Message.insertMany(messageBody);
};

/**
 * Query for messages
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryMessages = async (filter, options, userId) => {
  const agency = await Agency.findById(filter.agency);
  if (!agency) {
    throw new ApiError(httpStatus.NOT_FOUND, "Agency id is not found");
  }
  if (!agency.contractor.equals(userId)) {
    throw new ApiError(httpStatus.FORBIDDEN, "Forbidden");
  }

  const messages = await Message.paginate(filter, options);
  return messages;
};

/**
 * Get message by id
 * @param {ObjectId} id
 * @returns {Promise<Message>}
 */
const getMessageById = async (id, userId) => {
  const message = await Message.findById(id);
  if (!message) {
    throw new ApiError(httpStatus.NOT_FOUND, "Message not found");
  }
  const agency = await Agency.findById(message.agency);
  if (!agency.contractor.equals(userId)) {
    throw new ApiError(httpStatus.FORBIDDEN, "Forbidden");
  }
  return message;
};

/**
 * Find message from start to end
 * @param {Number} start
 * @param {Number} end
 * @returns {Promise<QueryResult>}
 */
const filterMessage = async (agencyId, start, end, userId) => {
  const agency = await Agency.findById(agencyId);
  if (!agency) {
    throw new ApiError(httpStatus.NOT_FOUND, "Agency id is not found");
  }
  if (!agency.contractor.equals(userId)) {
    throw new ApiError(httpStatus.FORBIDDEN, "Forbidden");
  }

  var startDate = new Date(start);
  var endDate = new Date(end);
  const messages = await Message.find({
    createdAt: { $gte: startDate, $lt: endDate },
  });
  return messages;
};

/**
 * Update message by id
 * @param {ObjectId} messageId
 * @param {Object} updateBody
 * @returns {Promise<Message>}
 */
const updateMessageById = async (messageId, userId, updateBody) => {
  const message = await getMessageById(messageId, userId);
  Object.assign(message, updateBody);
  await message.save();
  return message;
};

/**
 * Delete message by id
 * @param {ObjectId} messageId
 * @returns {Promise<Message>}
 */
const deleteMessageById = async (messageId, userId) => {
  const message = await getMessageById(messageId, userId);
  await message.remove();
  return message;
};

const checkMessageById = async (messageId, userId) => {
  const message = await getMessageById(messageId, userId);
  let dealer = "mien-trung";
  if (message.check === 0) {
    dealer = "mien-nam";
  } else if (message.check === 2) {
    dealer = "mien-bac";
  }

  if (message.confirmed) {
    return message;
  }

  const now = new Date();
  const d = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    16,
    35,
    0,
    0,
    0
  );

  if (
    message.createdAt.getFullYear() === now.getFullYear() &&
    message.createdAt.getMonth() === now.getMonth() &&
    message.createdAt.getDate() === now.getDate()
  ) {
    if (message.createdAt < d) {
      throw new ApiError(httpStatus.ACCEPTED, "Please waiting until draw time");
    }
  }

  const result = await getLotteryResults(dealer, message.createdAt);
  /// Start check
  if (result["ket_qua"]) {
    const kq = result["ket_qua"];
    const agency = await Agency.findById(message.agency);
    const dealerOrder = agency.dealerOrder;
  }
  return message;
};

module.exports = {
  createMessage,
  createMessages,
  queryMessages,
  getMessageById,
  filterMessage,
  updateMessageById,
  deleteMessageById,
  checkMessageById,
};
