const rateLimit = require("express-rate-limit");

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // Limit each IP to 20 requests per `window` (here, per 15 minutes)
  skipSuccessfulRequests: true, // Don't count with successful requests
});

module.exports = {
  authLimiter,
};
