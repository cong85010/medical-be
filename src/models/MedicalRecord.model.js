const mongoose = require("mongoose");

const medicalRecordSchema = new mongoose.Schema({
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
  image: String,
  result: {
    required: true,
    type: String,
  },
  note: String,
  prescriptions: {
    type: [mongoose.Schema.Types.Mixed],
    default: [],
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