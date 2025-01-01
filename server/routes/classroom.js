const express = require("express");
const router = express.Router();
const controller = require("../controllers/classroom.controller");

router.get(
  "/google-classroom/courses",
  controller.setGoogleCredentials,
  controller.getGoogleClassroomCourses
);

router.get(
  "/google-classroom/assignments/:courseId",
  controller.setGoogleCredentials,
  controller.getGoogleClassroomAssignments
);

router.post(
  "/upload-schedule",
  controller.setGoogleCredentials,
  controller.uploadClassroomSchedule
);

module.exports = router;
