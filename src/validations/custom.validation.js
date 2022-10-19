const Joi = require("joi");
const {
  monday,
  tuesday,
  wednesday,
  thursday,
  friday,
  saturday,
  sunday,
} = require("../utils/constant.util");

const objectId = (value, helpers) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message('"{{#label}}" must be a valid mongo id');
  }
  return value;
};

const password = (value, helpers) => {
  if (value.length < 8) {
    return helpers.message("password must be at least 8 characters");
  }
  if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
    return helpers.message(
      "password must contain at least 1 letter and 1 number"
    );
  }
  return value;
};

const dealerOrder = (value, helpers) => {
  if (value.length !== 7) {
    return helpers.message("Please enter a valid dealer order");
  }

  if (
    !monday.includes(value[0]) ||
    !tuesday.includes(value[1]) ||
    !wednesday.includes(value[2]) ||
    !thursday.includes(value[3]) ||
    !friday.includes(value[4]) ||
    !saturday.includes(value[5]) ||
    !sunday.includes(value[6])
  ) {
    return helpers.message("Please enter a valid dealer order");
  }

  return value;
};

const lotteryDealer = (value, helpers) => {
  if (value !== "mien-nam" || value !== "mien-trung" || value !== "mien-bac") {
    return helpers.message("Please enter a valid dealer");
  }

  return value;
};

const lotteryDate = (value, helpers) => {
  if (value.length !== 10) {
    return helpers.message("Please enter a date has a format DD-MM-YYYY");
  }

  if (!value.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/)) {
    return helpers.message("Please enter a date has a format DD-MM-YYYY");
  }
  return value;
};

module.exports = {
  objectId,
  password,
  dealerOrder,
  lotteryDealer,
  lotteryDate,
};
