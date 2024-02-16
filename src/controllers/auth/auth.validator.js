const joi = require("joi");
const { response } = require("../../utils/response");
const { StatusCodes } = require("http-status-codes");

const validation = joi.object({
 name: joi.string().max(100).required(),
 email: joi.string().email().trim(true).required(),
 password: joi.string().min(6).trim(true).required(),
 mobile: joi
  .string()
  .length(14)
  .pattern(/(^(\+8801|8801|01|008801))[1|3-9]{1}(\d){8}$/)
  .required(),
});

const authValidation = async (req, res, next) => {
 const data = {
  name: req.body.name,
  email: req.body.email,
  password: req.body.password,
  mobile: req.body.mobile,
 };
 const { error } = validation.validate(data);
 if (error) {
  let msg = `Error in User Data : ${error.message}`;
  return response(res, StatusCodes.NOT_ACCEPTABLE, false, {}, msg);
 } else {
  next();
 }
};
module.exports = { authValidation };
