const mongoose = require("mongoose");
const config = require("./config");
const logger = require("./logger");

mongoose
  .connect(config.mongodbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    logger.info("Connected MongoDB");
  });
