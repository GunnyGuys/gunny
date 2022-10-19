const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const agencySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    contractor: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    deOrRe: {
      type: Boolean,
      default: true,
    },
    type: {
      type: Boolean,
      default: true,
    },
    isAlert: {
      type: Boolean,
      default: true,
    },
    syntax: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      default: "DSK",
    },
    calKI: {
      type: Number,
      default: 0,
    },
    divide: {
      type: String,
      minlength: 5,
      default: "0,0,0",
    },
    northern: {
      type: String,
      trim: true,
      default:
        "75.5,75.5,66.0,66.0,75.5,75.5,66.0,66.0,66.0,75,75,650,6000,680,75,650,650,6000",
    },
    central: {
      type: String,
      trim: true,
      default:
        "75.5,75.5,66.0,66.0,66.0,75.5,75.5,75.7,66.0,66.0,66.0,75.5,75,75,650,650,6000,750,75,75,650,650,6000,550",
    },
    south: {
      type: String,
      trim: true,
      default:
        "75.5,75.5,66.0,66.0,66.0,75.5,75.5,75.7,66.0,66.0,66.0,75.5,75,75,650,650,6000,750,75,75,650,650,6000,550",
    },
    dealerOrder: {
      type: Array,
      default: [
        "Thành Phố - Đồng Tháp - Cà Mau",
        "Bến Tre - Vũng Tàu - Bạc Liêu",
        "Đồng Nai - Cần Thơ - Sóc Trăng",
        "Tây Ninh - An Giang - Bình Thuận",
        "Vĩnh Long - Bình Dương - Trà Vinh",
        "Thành Phố - Long An - Bình Phước - Hậu Giang",
        "Tiền Giang - Kiên Giang - Đà Lạt",
      ],
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
agencySchema.plugin(toJSON);
agencySchema.plugin(paginate);

/**
 * @typedef Agency
 */
const Agency = mongoose.model("Agency", agencySchema);

module.exports = Agency;
