const { StatusCodes } = require("http-status-codes");
const { response } = require("../../utils/response");
const { removeEmpty } = require("../../utils/constants");
const { Prescription } = require("../../models/Prescription.model");

const getPrescriptions = async (req, res) => {
  try {
    const query = removeEmpty(req.query);
    const searchKey = query.searchKey || "";
    const prescriptions = await Prescription.find()
      .where({
        $or: [
          {
            name: { $regex: searchKey, $options: "i" },
          },
        ],
      })
      .exec();

    return response(res, StatusCodes.OK, true, { prescriptions }, null);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const getPrescriptionById = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id);
    return response(res, StatusCodes.OK, true, { prescription }, null);
  } catch (error) {
    return response(
      res,
      StatusCodes.BAD_REQUEST,
      true,
      { Prescription: {} },
      null
    );
  }
};
module.exports = {
  getPrescriptions,
  getPrescriptionById,
};
