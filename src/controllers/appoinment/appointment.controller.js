const { StatusCodes } = require("http-status-codes");
const { Appointment } = require("../../models/Appoinment.model");
const { response } = require("../../utils/response");
const { generateTimeSlots } = require("../../utils/constants");
const { User } = require("../../models/User.model");
const dayjs = require("dayjs");

const createAppointment = async (req, res) => {
  try {
    const { date, time, patientId } = req.body;
    const timeSlots = await getTimeSlots(date);

    if (!timeSlots.includes(time)) {
      return response(
        res,
        StatusCodes.CONFLICT,
        false,
        null,
        "Thời gian đang chọn đã có người đặt, vui lòng chọn thời gian khác!"
      );
    }
    const newAppointment = new Appointment(req.body);
    const result = await newAppointment.save();

    const currentDate = dayjs().format("YYYY-MM-DD");

    const totalBooked = await Appointment.countDocuments({
      patientId: patientId,
      date: { $gte: currentDate },
      status: "booked",
    });

    await User.findByIdAndUpdate(
      patientId,
      {
        updatedAt: new Date(),
        totalBooked,
      },
      {
        new: true,
      }
    ).exec();
    res.status(201).json(result);
  } catch (error) {
    console.log("====================================");
    console.log(error);
    console.log("====================================");
    res.status(500).json({ error: error.message });
  }
};

const getTimeSlots = async (date) => {
  try {
    const bookedTimeSlots = await Appointment.find({
      date,
    }).distinct("time");

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
    const availableTimeSlots = await getTimeSlots(date);

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
    const currentDate = dayjs().format("DD/MM/YYYY");

    const appointments = await Appointment.find({
      patientId: req.query.patientId,
      date: { $gte: currentDate },
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
