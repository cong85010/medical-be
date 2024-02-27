const { sign } = require("jsonwebtoken");

const config = {
  secrets: {
    jwt: "PJaHvt8ASQvFgSgYI2gyc8a9TdHzLh5Rx98s7aB4nhUz4rvW92zsKvN6zbPIub",
    jwtExp: "30d",
  },
};

const createToken = (user) => {
  return sign(
    {
      _id: user._id,
      phone: user.phone,
    },
    config.secrets.jwt,
    {
      expiresIn: config.secrets.jwtExp,
    }
  );
};

module.exports = { createToken, config };
