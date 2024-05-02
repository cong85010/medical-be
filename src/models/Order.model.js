const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true,
  },
  medicalRecordId: {
    require: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: "medicalRecord",
  },
  salesId: {
    require: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  patientId: {
    require: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  medicines: {
    type: [mongoose.Schema.Types.Mixed],
    required: true,
    default: [],
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  note: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    default: "pending",
  },
  paymentMethod: {
    type: String,
    default: "cash",
  },
});

// Create a model for the order schema
const Order = mongoose.model("Order", orderSchema);

module.exports = { Order };
