const { StatusCodes } = require("http-status-codes");
const Meeting = require("../../models/Meeting.model");
const { response } = require("../../utils/response");
const {
  removeEmpty,
  formatedDateTimeISO,
  FORMAT_DATE,
} = require("../../utils/constants");
const dayjs = require("dayjs");

// CREATE
const createMeeting = async (req, res) => {
  try {
    const newMeeting = req.body;


    // code Validate dubplicate meeting in timeline
    const meetings = await Meeting.find({
      room: newMeeting.room,
      startDate: { $lte: newMeeting.endDate },
      endDate: { $gte: newMeeting.startDate },
    });

    if (meetings.length > 0) {
      return response(
        res,
        StatusCodes.BAD_REQUEST,
        false,
        null,
        "Trùng lịch họp với lịch họp khác"
      );
    }

    newMeeting.participants.push(newMeeting.owner);
    const meeting = new Meeting(newMeeting);
    meeting.save();
    return response(res, StatusCodes.OK, true, { meeting }, null);
  } catch (error) {
    console.error("Error creating meeting:", error);
    return response(res, StatusCodes.BAD_REQUEST, true, { meeting: {} }, null);
  }
};

// READ
const getMeetings = async (req, res) => {
  try {
    const query = removeEmpty(req.body);

    if (query.startDate) {
      query.startDate = {
        $gte: dayjs(query.startDate, FORMAT_DATE).startOf("day").toISOString(),
      };
    }
    if (query.endDate) {
      query.endDate = {
        $lte: dayjs(query.endDate, FORMAT_DATE).endOf("day").toISOString(),
      };
    }

    const participant = query.participant;

    if (participant) {
      query.participants = { $in: [participant] };
      delete query.participant;
    }

    const meetings = await Meeting.find(query);
    return response(res, StatusCodes.OK, true, { meetings }, null);
  } catch (error) {
    console.error("Error getting meetings:", error);
    return response(res, StatusCodes.BAD_REQUEST, true, { meetings: [] }, null);
  }
};

// READ
const getMeeting = async (req, res) => {
  try {
    const id = req.params.id;
    const meeting = await Meeting.findOne({ _id: id });
    return response(res, StatusCodes.OK, true, { meeting }, null);
  } catch (error) {
    console.error("Error getting meetings:", error);
    return response(res, StatusCodes.BAD_REQUEST, true, { meeting: {} }, null);
  }
};

// UPDATE
const updateMeeting = async (req, res) => {
  try {
    const id = req.params.id;
    const newData = req.body;
    const updatedMeeting = await Meeting.findByIdAndUpdate(id, newData, {
      new: true,
    });
    console.log("Updated meeting:", updatedMeeting);
    return updatedMeeting;
  } catch (error) {
    console.error("Error updating meeting:", error);
    throw error;
  }
};

// DELETE
const deleteMeeting = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedMeeting = await Meeting.findByIdAndDelete(id);
    console.log("Deleted meeting:", deletedMeeting);
    return deletedMeeting;
  } catch (error) {
    console.error("Error deleting meeting:", error);
    throw error;
  }
};

module.exports = {
  getMeeting,
  createMeeting,
  getMeetings,
  updateMeeting,
  deleteMeeting,
};
