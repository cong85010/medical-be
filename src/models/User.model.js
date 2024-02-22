var { Schema, model } = require("mongoose");

//User Schema
var UserSchema = Schema(
  {
    fullName: {
      type: String,
    },
    username: {
      type: String,
    },
    email: {
      type: String,
    },
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
    birthday: {
      type: Date,
    },
    address: {
      type: String,
    },
    note: {
      type: String,
    },
    photo: {
      type: String,
    },
  },
  { timestamps: true }
);

const User = model("user", UserSchema);

module.exports = { User };
