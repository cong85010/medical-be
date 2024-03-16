const { adminAccountDefault } = require("../../constants");
const { User } = require("../models/User.model");
const { securePassword } = require("../utils/securePassword");

require("./conn");

async function addUser() {
  try {
    const user = await User.findOne({ email: adminAccountDefault.email });
    if (user) {
      console.error("Admin already exists");
      return;
    }
    const passHash = await securePassword(adminAccountDefault.password);
    adminAccountDefault.password = passHash;
    const result = await User.create(adminAccountDefault);
    console.log(`User added with the following id: ${result}`);
  } catch (error) {
    console.error("Error adding user:", error);
  }
}

addUser();
