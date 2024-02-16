var { Schema, model } = require("mongoose");

//User Schema
var UserSchema = Schema({
  name: {
    type: String,
  },
  email: {
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
  mobile: {
    type: String,
  },
  photo: {
    type: String,
  },
}, {timestamps: true});

const User = model("user", UserSchema);

module.exports = { User };
