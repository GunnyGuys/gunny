const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

// const subMessageSchema = mongoose.Schema({
//   name: {
//     type: String,
//     trim: true,
//   },
//   dealer: {
//     type: String,
//     trim: true,
//   },
//   numbers: {
//     type: String,
//     trim: true,
//   },
//   type: {
//     type: String,
//     trim: true,
//   },
//   bet: {
//     type: Number,
//     default: 0,
//   },
//   capital: {
//     type: Number,
//     default: 0,
//   },
//   win: {
//     type: Boolean,
//     default: false,
//   },
//   winNumbers: {
//     type: String,
//     trim: true,
//   },
// });

const messageSchema = mongoose.Schema(
  {
    date: {
      type: String,
      trim: true,
      required: true,
    },
    customerName: {
      type: String,
      trim: true,
      required: true,
    },
    check: {
      type: Number,
      default: 0, // N: 0, T: 1, B: 2
    },
    messageContent: {
      type: String,
      trim: true,
      required: true,
    },
    agency: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Agency",
      required: true,
    },
    messages: [
      {
        tin: {
          type: String,
          trim: true,
        },
        dai: {
          type: Array,
          default: [],
        },
        so: {
          type: String,
          trim: true,
        },
        kieu: {
          type: String,
          trim: true,
        },
        tien: {
          type: String,
          trim: true,
        },
        donVi: {
          type: Number,
          default: 1000,
        },
        xac: {
          type: Number,
          default: 0,
        },
        loi: {
          type: Number,
          default: 0,
        },
        lo: {
          type: Number,
          default: 0,
        },
        trung: {
          type: Boolean,
          default: false,
        },
        soTrung: {
          type: String,
          trim: true,
          default: "",
        },
      },
    ],
    profit: {
      type: Number,
      default: 0,
    },
    loss: {
      type: Number,
      default: 0,
    },
    summary: {
      type: Array,
      default: ["", "", "", "", "", "", "", "", "", ""],
    },
    confirmed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
messageSchema.plugin(toJSON);
messageSchema.plugin(paginate);

/**
 * @typedef Message
 */
const Message = mongoose.model("Message", messageSchema);
// const SubMessage = mongoose.model("SubMessage", subMessageSchema);

module.exports = Message;
