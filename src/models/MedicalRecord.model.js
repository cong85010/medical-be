const mongoose = require("mongoose");

const medicalRecordSchema = new mongoose.Schema({
  appointmentId: {
    require: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: "appointment",
  },
  patientId: {
    require: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  doctorId: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  files: [String],
  result: {
    required: true,
    type: String,
  },
  note: String,
  medicines: {
    type: [mongoose.Schema.Types.Mixed],
    default: [],
  },
  status: {
    type: String,
    default: "examined",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const MedicalRecord = mongoose.model("medicalRecord", medicalRecordSchema);

module.exports = MedicalRecord;
