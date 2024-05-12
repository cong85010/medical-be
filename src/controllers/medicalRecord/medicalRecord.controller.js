// Import any necessary modules or dependencies

const { StatusCodes } = require("http-status-codes");
const MedicalRecord = require("../../models/MedicalRecord.model");
const { response } = require("../../utils/response");
const { Appointment } = require("../../models/Appoinment.model");
const dayjs = require("dayjs");
const { formatedDateTimeISO, FORMAT_DATE } = require("../../utils/constants");

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

    const newMedicalRecord = new MedicalRecord(medicalRecord);

    const result = await newMedicalRecord.save();
    // update isExamined in appointment
    await Appointment.findByIdAndUpdate(
      medicalRecord.appointmentId,
      { isExamined: true },
      { new: true }
    );

    return response(
      res,
      StatusCodes.ACCEPTED,
      true,
      { medicalRecord: result },
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
    const medicalRecord = await MedicalRecord.find({ _id: id })
      .populate({
        path: "patientId",
        model: "user",
        select: "_id fullName phone birthday",
      })
      .populate({
        path: "doctorId",
        model: "user",
        select: "_id fullName phone",
      })
      .sort({ updatedAt: -1 })
      .exec();
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

    if (query.date) {
      query.updatedAt = {
        $gte: formatedDateTimeISO(dayjs(query.date, FORMAT_DATE).startOf("day")),
        $lt: formatedDateTimeISO(dayjs(query.date, FORMAT_DATE).endOf("day")),
      };

      delete query.date;
    }

    console.log("====================================");
    console.log(query);
    console.log("====================================");

    const medicalRecords = await MedicalRecord.find(query)
      .populate({
        path: "patientId",
        model: "user",
        select: "_id fullName phone birthday",
      })
      .populate({
        path: "doctorId",
        model: "user",
        select: "_id fullName phone",
      })
      .sort({ updatedAt: -1 })
      .where(
        searchKey
          ? {
              $or: [
                {
                  result: { $regex: searchKey, $options: "i" },
                },
              ],
            }
          : null
      )
      .exec();

    return response(res, StatusCodes.OK, true, { medicalRecords }, null);
  } catch (error) {
    console.log(error);
    return response(res, StatusCodes.BAD_REQUEST, { error: error.message });
  }
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
