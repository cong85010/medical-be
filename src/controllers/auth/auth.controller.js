const { User } = require("../../models/User.model");
const { compare } = require("bcrypt");
const { createToken } = require("../../utils/config");
const { verifyToken } = require("../../utils/protected");
const { StatusCodes } = require("http-status-codes");
const { response } = require("../../utils/response");
const { securePassword } = require("../../utils/securePassword");

//register new account
const register = async (req, res) => {
 const { email, password, name, mobile } = req.body;
 try {
  const oldUser = await User.findOne({
   email: email,
  });
  if (oldUser) {
   return response(
    res,
    StatusCodes.NOT_ACCEPTABLE,
    false,
    {},
    "This Email Already have an Account"
   );
  }

  const hashedPassword = await securePassword(req.body.password);

  const user = await User.create({
   email: email,
   password: hashedPassword,
   userType: "user",
   activeStatus: false,
   name: name,
   mobile: mobile,
  });

  if (!user) {
   return response(
    res,
    StatusCodes.FORBIDDEN,
    false,
    {},
    "Could not create user due to user error"
   );
  }

  return response(res, StatusCodes.ACCEPTED, true, { user: user }, null);
 } catch (error) {
  return response(
   res,
   StatusCodes.INTERNAL_SERVER_ERROR,
   false,
   {},
   error.message
  );
 }
};

//login
const login = async (req, res) => {
 const { email, password } = req.body;

 if (!email || !password) {
  return response(
   res,
   StatusCodes.BAD_REQUEST,
   false,
   {},
   "Could not login, Please Provide all information"
  );
 }

 try {
  const user = await User.findOne({
   email: email,
  });

  if (!user) {
   return response(
    res,
    StatusCodes.NOT_FOUND,
    false,
    {},
    "No account exists with this email"
   );
  }
  const matched = await compare(password, user.password);
  if (matched) {
   if (user.activeStatus) {
    const token = await createToken(user);
    if (token) {
     return response(res, StatusCodes.OK, true, { token: token }, null);
    }

    return response(res, StatusCodes.BAD_REQUEST, false, {}, "Could not login");
   } else {
    return response(
     res,
     StatusCodes.NOT_ACCEPTABLE,
     false,
     {},
     "Account is not active"
    );
   }
  } else {
   return response(
    res,
    StatusCodes.NOT_ACCEPTABLE,
    false,
    {},
    "Incorrect Password!"
   );
  }
 } catch (error) {
  return response(
   res,
   StatusCodes.INTERNAL_SERVER_ERROR,
   false,
   {},
   error.message
  );
 }
};

//Re-Login
const reAuth = async (req, res) => {
 const { token } = req.body;

 if (!token) {
  return response(res, StatusCodes.BAD_REQUEST, false, {}, "No Token Found");
 }

 try {
  const result = await verifyToken(token.split("Bearer ")[1]);
  if (result) {
   const user = await User.findById(result._id);

   if (!user || !user.activeStatus) {
    return response(
     res,
     StatusCodes.BAD_REQUEST,
     false,
     {},
     "Could not authenticate"
    );
   }

   const newToken = await createToken(user);

   if (newToken) {
    return response(res, StatusCodes.OK, true, { token: newToken }, null);
   }
  } else {
   return response(
    res,
    StatusCodes.BAD_REQUEST,
    false,
    {},
    "Please Login Again"
   );
  }
 } catch (error) {
  return response(
   res,
   StatusCodes.INTERNAL_SERVER_ERROR,
   false,
   {},
   error.message
  );
 }
};

module.exports = {
 register,
 login,
 reAuth,
};
