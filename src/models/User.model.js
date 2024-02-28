const { Schema, model } = require("mongoose");

//User Schema
const UserSchema = Schema(
  {
    fullName: String,
    email: String,
    phone: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      required: true,
    },
    activeStatus: Boolean,
    userType: {
      type: String,
      required: true,
    },
    birthday: Date,
    address: String,
    note: String,
    gender: String,
    photo: String,
    totalBooked: Number,
    specialty: String,
  },
  { timestamps: true }
);

const User = model("user", UserSchema);

module.exports = { User };
