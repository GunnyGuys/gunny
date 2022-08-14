const { version } = require("../../package.json");
const config = require("../config/config");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "English word API documentation",
    version,
    license: {
      name: "MIT",
      url: "https://github.com/Otters149/gunny",
    },
  },
  servers: [
    {
      url: `http://localhost:${config.port}/v1`,
    },
  ],
};

module.exports = swaggerDefinition;
