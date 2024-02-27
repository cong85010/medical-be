const joi = require("joi");
const { response } = require("../../utils/response");
const { StatusCodes } = require("http-status-codes");

const validation = joi.object({
 phone: joi.string().max(100).required(),
 password: joi.string().min(6).trim(true).required(),
});

const authValidation = async (req, res, next) => {
 const data = {
  phone: req.body.phone,
  password: req.body.password,
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
