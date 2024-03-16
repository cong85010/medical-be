const { StatusCodes } = require("http-status-codes");
const { Appointment } = require("../../models/Appoinment.model");
const { response } = require("../../utils/response");
const {
  generateTimeSlots,
  STATUS_BOOKING,
  removeEmpty,
  queryStringToArrayObjects,
  queryStringToObject,
  FORMAT_DATE,
  FORMAT_DATE_TIME,
  formatedDate,
  formatedDateTimeISO,
} = require("../../utils/constants");
const { User } = require("../../models/User.model");
const dayjs = require("dayjs");
dayjs.locale("en"); // Chọn 'en' cho tiếng Anh

const createAppointment = async (req, res) => {
  try {
    const { date, time, patientId, doctorId } = req.body;
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
    const appointment = {
      ...req.body,
      dateTime: formatedDateTimeISO(
        `${req.body.date} ${req.body.time}`,
        FORMAT_DATE_TIME
      ),
    };

    console.log("appointment", appointment);
    const newAppointment = new Appointment(appointment);

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
    let query = { date, status: STATUS_BOOKING.booked };

    // Add doctorId to the query if provided
    if (doctorId) {
      query.doctorId = doctorId;
    }

    const bookedTimeSlots = await Appointment.find(query).distinct("time");

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
    const query = removeEmpty(req.query);
    let sorted = null;
    if (query.startDate) {
      query["dateTime"] = {
        $gte: dayjs(query.startDate, FORMAT_DATE).toISOString(),
        $lte: dayjs(query.endDate, FORMAT_DATE).toISOString(),
      };

      delete query.startDate;
      delete query.endDate;
    }

    console.log(query);

    if (query.sort) {
      sorted = queryStringToObject(query.sort);
      delete query.sort;
    }

    const renderSort = (sort) => {
      if (sort.length === 1) {
        return sort[0];
      }
      return sort;
    };

    const appointments = await Appointment.find(query)
      .populate({
        path: "patientId",
        model: "user",
        select: "_id fullName phone",
      })
      .populate({
        path: "doctorId",
        model: "user",
        select: "_id fullName phone",
      })
      .sort(sorted ? renderSort(sorted) : { updatedAt: -1, time: 1 })
      .exec();

    return response(
      res,
      StatusCodes.OK,
      true,
      { appointments: appointments },
      null
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate({
        path: "patientId",
        model: "user",
        select: "_id fullName phone",
      })
      .populate({
        path: "doctorId",
        model: "user",
        select: "_id fullName phone",
      });
    return response(res, StatusCodes.OK, true, { appointment }, null);
  } catch (error) {
    return response(
      res,
      StatusCodes.BAD_REQUEST,
      true,
      { appointment: {} },
      null
    );
  }
};

const updateAppointment = async (req, res) => {
  try {
    const newAppt = {
      ...req.body,
      dateTime: dayjs(
        `${req.body.time} ${req.body.date} `,
        "DD/MM/YYYY HH:mm"
      ).toISOString(),
      updatedAt: dayjs().toISOString(),
    };

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      newAppt,
      { new: true }
    );
    return response(
      res,
      StatusCodes.OK,
      true,
      { appointment: updatedAppointment },
      null
    );
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

const updateStatusAppointment = async (req, res) => {
  try {
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.body.appointmentId,
      {
        status: req.body.status,
        updatedAt: dayjs().toISOString(),
      },
      { new: true }
    );
    return response(
      res,
      StatusCodes.OK,
      true,
      { appointment: updatedAppointment },
      null
    );
  } catch (error) {
    console.log(error);
    return response(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      {},
      error.message
    );
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
  updateStatusAppointment,
};
