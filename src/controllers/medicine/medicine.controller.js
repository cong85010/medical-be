const { StatusCodes } = require("http-status-codes");
const { response } = require("../../utils/response");
const { removeEmpty } = require("../../utils/constants");
const { Medicine } = require("../../models/Medicine.model");

const getMedicines = async (req, res) => {
  try {
    const query = removeEmpty(req.query);
    const searchKey = query.searchKey || "";
    const medicines = await Medicine.find()
      .where({
        $or: [
          {
            name: { $regex: searchKey, $options: "i" },
          },
        ],
      })
      .exec();

    return response(res, StatusCodes.OK, true, { medicines }, null);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const getMedicineById = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    return response(res, StatusCodes.OK, true, { medicine }, null);
  } catch (error) {
    return response(res, StatusCodes.BAD_REQUEST, true, { Medicine: {} }, null);
  }
};

const createMedicine = async (req, res) => {
  try {
    const { name, note, description, price, quantity, usage } = req.body;

    const medicineExists = await Medicine.findOne({ name });
    if (medicineExists) {
      return response(
        res,
        StatusCodes.BAD_REQUEST,
        false,
        null,
        "Thuốc đã tồn tại"
      );
    }
    const medicine = await Medicine.create({
      name,
      description,
      price,
      quantity,
      usage,
      note,
    });
    return response(res, StatusCodes.CREATED, true, { medicine }, null);
  } catch (error) {
    return response(res, StatusCodes.BAD_REQUEST, true, { Medicine: {} }, null);
  }
};

const updateMedicine = async (req, res) => {
  try {
    const _id = req.params.id;
    const { name, note, description, price, quantity, usage } = req.body;

    if (_id === undefined)
      return response(
        res,
        StatusCodes.BAD_REQUEST,
        false,
        null,
        "Id is required"
      );

    const medicineExists = await Medicine.findOne({ _id });
    if (medicineExists) {
      // Update existing medicine in the database

      medicineExists.name = name;
      medicineExists.note = note;
      medicineExists.usage = usage;
      medicineExists.price = price;
      medicineExists.description = description;
      medicineExists.quantity = quantity;
      medicineExists.updatedAt = new Date();

      await medicineExists.save();
      return response(
        res,
        StatusCodes.OK,
        true,
        { medicine: medicineExists },
        null
      );
    } else {
      return response(
        res,
        StatusCodes.BAD_REQUEST,
        false,
        null,
        "Medicine not found"
      );
    }
  } catch (error) {
    return response(res, StatusCodes.BAD_REQUEST, true, { Medicine: {} }, null);
  }
};

const deleteMedicine = async (req, res) => {
  try {
    const _id = req.params.id;
    const medicine = await Medicine.findById(_id);
    if (medicine) {
      await Medicine.findByIdAndRemove(_id).exec();
      return response(res, StatusCodes.OK, true, { medicine }, null);
    }
    return response(
      res,
      StatusCodes.BAD_REQUEST,
      false,
      null,
      "Medicine not found"
    );
  } catch (error) {
    return response(res, StatusCodes.BAD_REQUEST, false, null, error.message);
  }
};

module.exports = {
  getMedicines,
  getMedicineById,
  createMedicine,
  updateMedicine,
  deleteMedicine,
};
