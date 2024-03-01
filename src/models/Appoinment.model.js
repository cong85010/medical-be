const { Schema, model } = require("mongoose");

const AppointmentSchema = Schema({
  patientId: { require: true, type: Schema.Types.ObjectId, ref: "user" },
  patientName: String,
  doctorId: { type: Schema.Types.ObjectId, ref: "user" },
  doctorName: String,
  date: String,
  time: String,
  purpose: String,
  status: String,
  specialty: String,
  counter: Number,
});

const Appointment = model("appointment", AppointmentSchema);

module.exports = { Appointment };
