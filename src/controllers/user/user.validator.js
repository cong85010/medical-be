const joi = require("joi");
const { response } = require("../../utils/response");
const { StatusCodes } = require("http-status-codes");
const { TYPE_EMPLOYEE } = require("../../../constants");

const validation = joi.object({
  phone: joi.string().max(100).required(),
  email: joi.string().email().trim(true).required(),
  userType: joi
    .string()
    .valid(
      TYPE_EMPLOYEE.admin,
      TYPE_EMPLOYEE.administrative,
      TYPE_EMPLOYEE.doctor,
      TYPE_EMPLOYEE.sales,
      TYPE_EMPLOYEE.user
    )
    .required(),
});

const userValidation = async (req, res, next) => {
  const data = {
    phone: req.body.phone,
    email: req.body.email,
    userType: req.body.userType,
  };
  const { error } = validation.validate(data);
  if (error) {
    let msg = `Error in User Data : ${error.message}`;
    return response(res, StatusCodes.NOT_ACCEPTABLE, false, {}, msg);
  } else {
    next();
  }
};
module.exports = { userValidation };
