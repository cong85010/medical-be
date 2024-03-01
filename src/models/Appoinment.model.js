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
  serviceType: String,
  specialty: String,
  counter: Number,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Appointment = model("appointment", AppointmentSchema);

module.exports = { Appointment };
