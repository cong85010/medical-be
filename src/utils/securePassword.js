const { hash } = require("bcrypt");

const securePassword = async (password) => {
 const hashedPassword = await hash(password, 9);
 return hashedPassword;
};

module.exports = { securePassword };
