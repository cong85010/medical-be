const dayjs = require("dayjs");
const { Schema, model } = require("mongoose");
const { FORMAT_DATE_TIME, formatedDateTimeISO } = require("../utils/constants");

const MedicineSchema = Schema({
  name: {
    type: String,
    require: true,
  },
  quantity: {
    type: Number,
    require: true,
  },
  price: {
    type: Number,
    require: true,
  },
  usage: {
    type: String,
  },
  note: {
    type: String,
  },
  description: {
    type: String,
    require: true,
  },
  outOfPill: Boolean,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Medicine = model("medicine", MedicineSchema);

module.exports = { Medicine };
