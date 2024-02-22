const { User } = require("../../models/User.model");
const { compare } = require("bcrypt");
const { createToken } = require("../../utils/config");
const { verifyToken } = require("../../utils/protected");
const { StatusCodes } = require("http-status-codes");
const { response } = require("../../utils/response");
const { securePassword } = require("../../utils/securePassword");

//register new account
const register = async (req, res) => {
  const { username, password } = req.body;
  try {
    const oldUser = await User.findOne({
      username: username,
    });
    if (oldUser) {
      return response(
        res,
        StatusCodes.NOT_ACCEPTABLE,
        false,
        {},
        "Tài khoản đã tồn tại"
      );
    }

    const hashedPassword = await securePassword(password);

    const user = await User.create({
      username: username,
      password: hashedPassword,
      userType: "user",
      activeStatus: true,
    });
    const token = await createToken(user);

    if (!user) {
      return response(
        res,
        StatusCodes.FORBIDDEN,
        false,
        {},
        "Could not create user due to user error"
      );
    }

    return response(res, StatusCodes.ACCEPTED, true, { user, token}, null);
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
  const { username, password } = req.body;

  if (!username || !password) {
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
      username: username,
    });

    if (!user) {
      return response(
        res,
        StatusCodes.NOT_FOUND,
        false,
        {},
        "Tài khoản không tồn tại"
      );
    }
    const matched = await compare(password, user.password);
    if (matched) {
      if (user.activeStatus) {
        const token = await createToken(user);
        if (token) {
            return response(res, StatusCodes.ACCEPTED, true, { user, token}, null);
        }

        return response(
          res,
          StatusCodes.BAD_REQUEST,
          false,
          {},
          "Could not login"
        );
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
    const result = await verifyToken(token);
    
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
        return response(res, StatusCodes.OK, true, { user, token: newToken }, null);
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