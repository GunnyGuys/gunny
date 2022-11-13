const httpStatus = require("http-status");
const { Message, Agency } = require("../models");
const { getLotteryResults } = require("../utils/lottery");
const tinhLoLai = require("../common/tinhLoLai");
const tinhTongLoLai = require("../utils/tinhTongLoLai");
const tryParseMessage = require("../common/dsk3");
const dinhDangKetQuaXoSo = require("../common/xuLyKetQuaSoXo");
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

  const messages = await Message.find({
    date: messageBody.date,
    messageContent: messageBody.messageContent,
    customerName: messageBody.customerName,
    agency: messageBody.agency,
  });

  if (messages && messages.length > 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "This message already exist!");
  }

  try {
    const messages = tryParseMessage(messageBody.messageContent);
    messageBody.messages = messages;
  } catch {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Tin nhắn không hợp lệ. Vui lòng coi kỹ lại"
    );
  }
  messageBody.confirmed = false;
  messageBody.profit = 0;
  messageBody.loss = 0;

  var message = await Message.create(messageBody);
  let dealer = "mien-trung";
  if (messageBody.check === 0) {
    dealer = "mien-nam";
  } else if (messageBody.check === 2) {
    dealer = "mien-bac";
  }

  const messageDate = new Date(messageBody.date);

  const result = await getLotteryResults(dealer, messageDate);

  /// Start check
  if (result && result["ket_qua"]) {
    const kq = result["ket_qua"];
    var index = messageDate.getDay() === 0 ? 6 : messageDate.getDay() - 1;
    var order = agency.dealerOrder[index].replace(/Thành Phố/g, "TP.HCM");
    const dealerOrder = order.split(" - ");
    const ketQuaSoXo = [];
    for (let k = 0; k < dealerOrder.length; k++) {
      ketQuaSoXo.push(result["ket_qua"].find((x) => x[dealerOrder[k]]));
    }
    const newMessages = tinhLoLai(
      message,
      dinhDangKetQuaXoSo(ketQuaSoXo, dealerOrder)
    );
    const summary = tinhTongLoLai(newMessages.messages);
    newMessages.summary = summary;
    message = await newMessages.save();
  }

  return message;
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
 * @param {Object} date
 * @returns {Promise<QueryResult>}
 */
const filterMessage = async (agencyId, date, userId) => {
  const agency = await Agency.findById(agencyId);
  if (!agency) {
    throw new ApiError(httpStatus.NOT_FOUND, "Agency id is not found");
  }
  if (!agency.contractor.equals(userId)) {
    throw new ApiError(httpStatus.FORBIDDEN, "Forbidden");
  }

  // var startDate = new Date(start);
  // var endDate = new Date(end);
  // const messages = await Message.find({
  //   createdAt: { $gte: startDate, $lt: endDate },
  // });
  const messages = await Message.find({
    date: { $eq: date },
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
  try {
    const message = await getMessageById(messageId, userId);
    if (message.confirmed) {
      return message;
    }

    const now = new Date();
    const d = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      16,
      25,
      0,
      0,
      0
    );

    if (
      message.createdAt.getFullYear() === now.getFullYear() &&
      message.createdAt.getMonth() === now.getMonth() &&
      message.createdAt.getDate() === now.getDate()
    ) {
      var difference = (d - message.createdAt) / (1000 * 60); // minutes
      if (difference > 0) {
        throw new ApiError(
          httpStatus.FORBIDDEN,
          "Không thể cập nhật tin nhắn. Đã qua giờ xổ"
        );
      }
    }

    const messages = tryParseMessage(updateBody.messageContent);
    updateBody.messages = messages;
    Object.assign(message, updateBody);
    await message.save();
    return message;
  } catch {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Tin nhắn không hợp lệ. Vui lòng coi kỹ lại"
    );
  }
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
    var difference = (d - message.createdAt) / (1000 * 60); // minutes
    if (difference <= 0) {
      throw new ApiError(httpStatus.ACCEPTED, "Please waiting until draw time");
    }
  }

  const result = await getLotteryResults(dealer, message.createdAt);
  /// Start check
  if (result["ket_qua"]) {
    const kq = result["ket_qua"];
    const agency = await Agency.findById(message.agency);
    var index =
      message.createdAt.getDay() === 0 ? 6 : message.createdAt.getDay() - 1;
    var order = agency.dealerOrder[index].replace(/Thành Phố/g, "TP.HCM");
    const dealerOrder = order.split(" - ");
    const ketQuaSoXo = [];
    for (let k = 0; k < dealerOrder.length; k++) {
      ketQuaSoXo.push(result["ket_qua"].find((x) => x[dealerOrder[k]]));
    }
    const newMessages = tinhLoLai(
      message,
      dinhDangKetQuaXoSo(ketQuaSoXo, dealerOrder)
    );
    const summary = tinhTongLoLai(newMessages.messages);
    newMessages.summary = summary;
    await newMessages.save();
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
