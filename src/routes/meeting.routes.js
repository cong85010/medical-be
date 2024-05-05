const { Router } = require("express");
const router = Router();

const meetingController = require("../controllers/meeting/meeting.controller");

router.post("/list", meetingController.getMeetings);
router.get("/:id", meetingController.getMeeting);
router.post("/", meetingController.createMeeting);
router.put("/", meetingController.updateMeeting);
router.delete("/:id", meetingController.deleteMeeting);
module.exports = router;
