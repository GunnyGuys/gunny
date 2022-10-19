const httpStatus = require("http-status");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { messageService } = require("../services");

const createMessage = catchAsync(async (req, res) => {
  if (!req.user || !req.user._id) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Bad Request");
  }
  const message = await messageService.createMessage(req.body, req.user._id);
  res.status(httpStatus.CREATED).send(message);
});

const getMessages = catchAsync(async (req, res) => {
  if (!req.user || !req.user._id) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Bad Request");
  }
  let filters = pick(req.query, ["agency"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const messages = await messageService.queryMessages(
    filters,
    options,
    req.user._id
  );
  res.send(messages);
});

const getMessage = catchAsync(async (req, res) => {
  if (!req.user || !req.user._id) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Bad Request");
  }
  const message = await messageService.getMessageById(
    req.params.messageId,
    req.user._id
  );
  res.send(message);
});

const updateMessage = catchAsync(async (req, res) => {
  const message = await messageService.updateMessageById(
    req.params.messageId,
    req.user._id,
    req.body
  );
  res.send(message);
});

const deleteMessage = catchAsync(async (req, res) => {
  await messageService.deleteMessageById(req.params.messageId, req.user._id);
  res.status(httpStatus.NO_CONTENT).send();
});

const checkWin = catchAsync(async (req, res) => {
  if (!req.user || !req.user._id) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Bad Request");
  }
  const result = await messageService.checkMessageById(
    req.params.messageId,
    req.user._id
  );
  res.status(httpStatus.OK).send(result);
});

module.exports = {
  createMessage,
  getMessages,
  getMessage,
  updateMessage,
  deleteMessage,
  checkWin,
};
