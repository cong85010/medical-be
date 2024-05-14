const { User } = require("../../models/User.model");
const { compare } = require("bcrypt");
const { createToken } = require("../../utils/config");
const { verifyToken } = require("../../utils/protected");
const { StatusCodes } = require("http-status-codes");
const { response } = require("../../utils/response");
const { securePassword } = require("../../utils/securePassword");
const { PASSWORD_DEFAULT } = require("../../../constants");

//register new account
const register = async (req, res) => {
  const { phone, password } = req.body;
  try {
    const oldUser = await User.findOne({
      phone: phone,
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
      phone: phone,
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

    return response(res, StatusCodes.ACCEPTED, true, { user, token }, null);
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
  const { phone, password } = req.body;

  if (!phone || !password) {
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
      $or: [{ email: phone }, { phone }],
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
          return response(
            res,
            StatusCodes.ACCEPTED,
            true,
            { user, token },
            null
          );
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
          "Tài khoản đã bị khóa"
        );
      }
    } else {
      return response(
        res,
        StatusCodes.NOT_ACCEPTABLE,
        false,
        {},
        "Mật khẩu không chính xác"
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
        return response(
          res,
          StatusCodes.OK,
          true,
          { user, token: newToken },
          null
        );
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

const changePassword = async (req, res) => {
  try {
    const { oldPassword, password: newPassword, userId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return response(res, StatusCodes.NOT_FOUND, false, {}, "User not found");
    }

    const matched = await compare(oldPassword, user.password);
    if (!matched) {
      return response(
        res,
        StatusCodes.NOT_ACCEPTABLE,
        false,
        {},
        "Mật khẩu cũ không chính xác"
      );
    }

    const hashedPassword = await securePassword(newPassword);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { password: hashedPassword },
      { new: true }
    );
    if (!updatedUser) {
      return response(
        res,
        StatusCodes.BAD_REQUEST,
        false,
        {},
        "Không thể cập nhật mật khẩu!"
      );
    }

    return response(
      res,
      StatusCodes.ACCEPTED,
      true,
      { user: updatedUser },
      null
    );
  } catch (error) {
    console.log("====================================");
    console.log(error);
    console.log("====================================");
    return response(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      {},
      error.message
    );
  }
};

const resetPassword = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return response(res, StatusCodes.NOT_FOUND, false, {}, "User not found");
    }

    const hashedPassword = await securePassword(PASSWORD_DEFAULT);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { password: hashedPassword },
      { new: true }
    );
    if (!updatedUser) {
      return response(
        res,
        StatusCodes.BAD_REQUEST,
        false,
        {},
        "Không thể cập nhật mật khẩu!"
      );
    }

    console.log("====================================");
    console.log(updatedUser);
    console.log("====================================");
    return response(
      res,
      StatusCodes.ACCEPTED,
      true,
      { user: updatedUser },
      null
    );
  } catch (error) {
    console.log("====================================");
    console.log(error);
    console.log("====================================");
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
  changePassword,
  resetPassword,
};
