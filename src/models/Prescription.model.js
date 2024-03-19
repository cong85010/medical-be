const dayjs = require("dayjs");
const { Schema, model } = require("mongoose");
const { FORMAT_DATE_TIME, formatedDateTimeISO } = require("../utils/constants");

const PrescriptionSchema = Schema({
  name: {
    type: String,
    require: true,
  },
  quantity: {
    type: Number,
    require: true,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Prescription = model("prescription", PrescriptionSchema);

module.exports = { Prescription };
