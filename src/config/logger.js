const winston = require("winston");

const config = require("./config");

// {
//   emerg: 0,
//   alert: 1,
//   crit: 2,
//   error: 3,
//   warning: 4,
//   notice: 5,
//   info: 6,
//   debug: 7
// }

const enumerateErrorFormat = winston.format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }
  return info;
});

const logger = winston.createLogger({
  level: config.env === "development" ? "debug" : "info",
  format: winston.format.combine(
    enumerateErrorFormat(),
    winston.format.combine(
      config.env === "development"
        ? winston.format.colorize()
        : winston.format.uncolorize(),
      winston.format.splat(), // String interpolation splat for %d %s-style messages.
      winston.format.printf(
        ({ level, message }) => `[Gunny log] ${level}: ${message}`
      )
    )
  ),
  transports: [
    new winston.transports.Console({
      stderrLevels: ["error"],
    }),
    // save to a file: combined.log
    // new winston.transports.File({ filename: "combined.log" , maxsize: 5242880}), // 5MB
  ],
});

module.exports = logger;
