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
    const owner = query.owner;

    if (participant) {
      query.participants = { $in: [participant] };
      delete query.participant;
    }

    if (owner) {
      query["$or"] = [{ participants: { $in: [participant] } }, { owner }];
      delete query.owner;
      delete query.participants;
    }

    const meetings = await Meeting.find(query).populate({
      path: "owner",
      model: "user",
      select: "_id fullName phone birthday",
    });

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
    const newMeeting = req.body;
    const id = newMeeting._id;

    // code Validate dubplicate meeting in timeline
    const meetings = await Meeting.find({
      _id: { $ne: id },
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

    const updatedMeeting = await Meeting.findByIdAndUpdate(id, newMeeting, {
      new: true,
    });
    return response(
      res,
      StatusCodes.OK,
      true,
      { meeting: updatedMeeting },
      null
    );
  } catch (error) {
    return response(res, StatusCodes.BAD_REQUEST, true, { meeting: {} }, null);
  }
};

// DELETE
const deleteMeeting = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedMeeting = await Meeting.findByIdAndDelete(id);
    console.log("Deleted meeting:", deletedMeeting);
    return response(
      res,
      StatusCodes.OK,
      true,
      { meeting: deletedMeeting },
      null
    );
  } catch (error) {
    console.error("Error deleting meeting:", error);
    return response(res, StatusCodes.BAD_REQUEST, true, { meeting: {} }, null);
  }
};

module.exports = {
  getMeeting,
  createMeeting,
  getMeetings,
  updateMeeting,
  deleteMeeting,
};
