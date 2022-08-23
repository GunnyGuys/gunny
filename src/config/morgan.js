const morgan = require("morgan");
const config = require("./config");
const logger = require("./logger");

// The message keywork will be match with in message keywork in chain
// successResponseFormat and errorResponseFormat
morgan.token("message", (req, res) => res.locals.errorMessage || "");

const getIpFormat = () => (config.env === "production" ? ":remote-add - " : "");

const successResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms`;
const errorResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms - message: :message`;

// morgan(format, options)
const successHandler = morgan(successResponseFormat, {
  skip: (req, res) => res.statusCode >= 400,
  stream: { write: (message) => logger.info(message.trim()) },
});

const errorHandler = morgan(errorResponseFormat, {
  skip: (req, res) => res.statusCode < 400,
  stream: { write: (message) => logger.error(message.trim()) },
});

module.exports = {
  successHandler,
  errorHandler,
};