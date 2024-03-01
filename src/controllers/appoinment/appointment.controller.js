const { StatusCodes } = require("http-status-codes");
const { Appointment } = require("../../models/Appoinment.model");
const { response } = require("../../utils/response");
const { generateTimeSlots } = require("../../utils/constants");
const { User } = require("../../models/User.model");
const dayjs = require("dayjs");

const createAppointment = async (req, res) => {
  try {
    const { date, time, patientId, doctorId} = req.body;
    const timeSlots = await getTimeSlots(date, doctorId);

    if (!timeSlots.includes(time)) {
      return response(
        res,
        StatusCodes.CONFLICT,
        false,
        null,
        "Thời gian đang chọn đã có người đặt, vui lòng chọn thời gian khác!"
      );
    }

    console.log(req.body);
    const newAppointment = new Appointment(req.body);
    const result = await newAppointment.save();

    return response(
      res,
      StatusCodes.ACCEPTED,
      false,
      null,
      "Đặt lịch thành công!"
    );
  } catch (error) {
    console.log("====================================");
    console.log(error);
    console.log("====================================");
    return response(
      res,
      StatusCodes.BAD_REQUEST,
      false,
      null,
      "Đặt lịch thất bại!"
    );
  }
};

const getTimeSlots = async (date, doctorId) => {
  try {
    let query = { date };

    // Add doctorId to the query if provided
    if (doctorId) {
      query.doctorId = doctorId;
    }

    console.log('====================================');
    console.log(query);
    const bookedTimeSlots = await Appointment.find(query).distinct("time");
    console.log(bookedTimeSlots);
    console.log('====================================');

    // Loại bỏ những thời gian đã đặt
    const availableTimeSlots = generateTimeSlots(date).filter(
      (timeSlot) => !bookedTimeSlots.includes(timeSlot)
    );

    return availableTimeSlots;
  } catch (error) {
    console.error("Error getting available time slots:", error);
    return []; // Xử lý lỗi và trả về một mảng trống nếu có lỗi
  }
};

const getAvailableTimeSlots = async (req, res) => {
  try {
    const date = req.query.date;
    const doctorId = req.query.doctorId;
    const availableTimeSlots = await getTimeSlots(date, doctorId);

    return response(
      res,
      StatusCodes.ACCEPTED,
      true,
      { times: availableTimeSlots },
      null
    );
  } catch (error) {
    console.error("Error getting available time slots:", error);
    return []; // Xử lý lỗi và trả về một mảng trống nếu có lỗi
  }
};

const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      patientId: req.query.patientId,
    })
      .sort({ date: 1 })
      .sort({ time: 1 })
      .exec();
    return response(
      res,
      StatusCodes.OK,
      true,
      { appointments: appointments },
      null
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateAppointment = async (req, res) => {
  try {
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedAppointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteAppointment = async (req, res) => {
  try {
    const deletedAppointment = await Appointment.findByIdAndDelete(
      req.params.id
    );
    res.json(deletedAppointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
  getAvailableTimeSlots,
};
