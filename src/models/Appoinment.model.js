const dayjs = require("dayjs");
const { Schema, model } = require("mongoose");
const { FORMAT_DATE_TIME, formatedDateTimeISO } = require("../utils/constants");

const AppointmentSchema = Schema({
  patientId: { require: true, type: Schema.Types.ObjectId, ref: "user" },
  doctorId: { type: Schema.Types.ObjectId, ref: "user" },
  date: String,
  time: String,
  dateTime: {
    type: Date,
    default: function () {
      const combinedDateTime = `${this.date} ${this.time}`;
      return dayjs(combinedDateTime).format(FORMAT_DATE_TIME);
    },
  },
  purpose: String,
  status: String,
  serviceType: String,
  specialty: String,
  counter: Number,
  isExamined: {
    type: Boolean,
    default: false,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Appointment = model("appointment", AppointmentSchema);

module.exports = { Appointment };
