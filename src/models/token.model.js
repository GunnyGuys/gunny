const mongoose = require("mongoose");
const { toJSON } = require("./plugins");

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
      enum: ["refresh", "changePassword"],
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
