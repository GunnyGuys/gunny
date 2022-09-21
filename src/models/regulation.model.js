const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");
const regulations = require("../config/regulation");

const regulationSchema = mongoose.Schema(
  {
    agency: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Agency",
      required: true,
    },
    dai: {
      type: String,
      required: true,
      enum: regulations,
      default: "bac",
    },
    key: {
      type: String,
      required: true,
      trim: true,
    },
    value: {
      type: Array,
      required: true,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
regulationSchema.plugin(toJSON);
regulationSchema.plugin(paginate);

/**
 * @typedef Regulation
 */
const Regulation = mongoose.model("Regulation", regulationSchema);

module.exports = Regulation;
