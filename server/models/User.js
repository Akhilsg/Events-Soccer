const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  fName: { type: String },
  lName: { type: String },
  username: { type: String },
  email: { type: String },
  password: { type: String },
  emailVerificationToken: { type: String },
  resetPasswordToken: { type: String },
  emailVerificationTokenExpiration: { type: Date },
  resetPasswordTokenExpiration: { type: Date },
  uploadedSchedule: { type: Boolean, default: false },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  profileImage: {
    data: Buffer,
    contentType: String,
  },
  preferences: {
    preferredWorkTimes: [
      {
        day: { type: String },
        startTime: { type: String },
        endTime: { type: String },
      },
    ],
  },
  googleAccessToken: { type: String },
  googleClassroomId: { type: String },
  courses: [
    {
      courseId: { type: String },
      courseName: { type: String },
      startTime: { type: String },
      endTime: { type: String },
      days: [String],
    },
  ],
  assignments: [
    {
      assignmentId: { type: String },
      courseId: { type: String },
      title: { type: String },
      dueDate: { type: Date },
      estimatedTime: { type: Number },
      timeBlocks: [
        {
          day: { type: String },
          startTime: { type: String },
          endTime: { type: String },
        },
      ],
      completed: { type: Boolean, default: false },
    },
  ],
  calendarEvents: [
    {
      title: { type: String },
      startTime: { type: Date },
      endTime: { type: Date },
      description: { type: String },
    },
  ],
});

module.exports = mongoose.model("User", UserSchema);
