const mongoose = require("mongoose");
const { toJSON } = require("./plugins");
const { tokenTypes } = require("../config/tokens");

const tokenSchema = mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      index: true,
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: [tokenTypes.REFRESH, tokenTypes.CHANGE_PASSWORD],
      required: true,
    },
    expires: {
      type: Date,
      required: true,
    },
    blacklisted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamp: true,
    toObject: { getters: true },
    toJSON: { getters: true },
  }
);

/**
 * @typedef Token
 */
const Token = mongoose.model("Token", tokenSchema);

module.exports = Token;
