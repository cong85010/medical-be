// Import any necessary modules or dependencies

const { StatusCodes } = require("http-status-codes");
const MedicalRecord = require("../../models/MedicalRecord.model");
const { response } = require("../../utils/response");

// Define your controller functions
const createMedicalRecord = async (req, res) => {
  try {
    const medicalRecord = req.body;

    if (
      medicalRecord.patientId === undefined ||
      medicalRecord.doctorId === undefined ||
      medicalRecord.result === undefined
    ) {
      return response(
        res,
        StatusCodes.BAD_REQUEST,
        false,
        null,
        "Cung cấp đầy đủ thông tin"
      );
    }

    console.log(medicalRecord);

    const newMedicalRecord = await MedicalRecord.create({ medicalRecord: medicalRecord });

    return response(
      res,
      StatusCodes.ACCEPTED,
      true,
      { medicalRecord: newMedicalRecord },
      null
    );
  } catch (error) {
    console.log(error);
    return response(
      res,
      StatusCodes.BAD_REQUEST,
      false,
      null,
      "Có lỗi xảy ra, vui lòng thử lại sau"
    );
  }
};

const getMedicalRecordById = async (req, res) => {
  try {
    const { id } = req.query;
    const medicalRecord = await MedicalRecord.find({ _id: id });
    return response(
      res,
      StatusCodes.ACCEPTED,
      true,
      { medicalRecord: medicalRecord },
      null
    );
  } catch (error) {}
};

const getListMedicalRecord = async (req, res) => {
  try {
    const query = req.body;
    const searchKey = query.searchKey || "";
    let filter = {};
    if (query.patientId) {
      filter = { ...filter, patientId: query.patientId };
    }
    if (query.doctorId) {
      filter = { ...filter, doctorId: query.doctorId };
    }

    const medicalRecords = await MedicalRecord.find(filter)
      .where({
        $or: [
          {
            result: { $regex: searchKey, $options: "i" },
          },
        ],
      })
      .exec();

    return response(res, StatusCodes.OK, true, { medicalRecords }, null);
  } catch (error) {}
};

const updateMedicalRecord = async (req, res) => {
  try {
    const medicalRecord = req.body;

    if (
      medicalRecord._id === undefined ||
      medicalRecord.patientId === undefined ||
      medicalRecord.doctorId === undefined ||
      medicalRecord.result === undefined
    ) {
      return response(
        res,
        StatusCodes.BAD_REQUEST,
        false,
        null,
        "Cung cấp đầy đủ thông tin"
      );
    }

    const newMedicalRecord = await MedicalRecord.findByIdAndUpdate(
      medicalRecord._id,
      medicalRecord,
      { new: true }
    );

    return response(
      res,
      StatusCodes.ACCEPTED,
      true,
      { medicalRecord: newMedicalRecord },
      null
    );
  } catch (error) {
    return response(
      res,
      StatusCodes.BAD_REQUEST,
      false,
      null,
      "Có lỗi xảy ra, vui lòng thử lại sau"
    );
  }
};

const deleteMedicalRecord = (req, res) => {
  try {
    const { id } = req.query;
    MedicalRecord.findByIdAndDelete(id, (err, doc) => {
      if (err) {
        return response(
          res,
          StatusCodes.BAD_REQUEST,
          false,
          null,
          "Có lỗi xảy ra, vui lòng thử lại sau"
        );
      }
      return response(res, StatusCodes.ACCEPTED, true, null, null);
    });
  } catch (error) {
    return response(
      res,
      StatusCodes.BAD_REQUEST,
      false,
      null,
      "Có lỗi xảy ra, vui lòng thử lại sau"
    );
  }
};

// Export your controller functions
module.exports = {
  createMedicalRecord,
  getListMedicalRecord,
  getMedicalRecordById,
  updateMedicalRecord,
  deleteMedicalRecord,
};
