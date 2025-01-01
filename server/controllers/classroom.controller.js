const { google } = require("googleapis");
const db = require("../models");
const User = db.user;

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.REDIRECT_URI
);

const uploadClassroomSchedule = async (req, res) => {
  const classroom = google.classroom({ version: "v1", auth: oauth2Client });

  try {
    // Get courses
    const coursesResponse = await classroom.courses.list();
    const courses = coursesResponse.data.courses;

    // Get assignments for each course
    const assignments = [];
    for (const course of courses) {
      const courseWork = await classroom.courses.courseWork.list({
        courseId: course.id,
      });

      if (courseWork.data.courseWork) {
        assignments.push(
          ...courseWork.data.courseWork.map((work) => ({
            assignmentId: work.id,
            courseId: course.id,
            title: work.title,
            dueDate: work.dueDate ? new Date(work.dueDate) : null,
            estimatedTime: work.workloadHours || 1,
          }))
        );
      }
    }

    // Update user's courses and assignments
    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        courses: courses.map((course) => ({
          courseId: course.id,
          courseName: course.name,
        })),
        assignments: assignments,
        uploadedSchedule: true,
      },
      { new: true }
    );

    res.status(200).json({
      message: "Schedule uploaded successfully",
      courses: user.courses,
      assignments: user.assignments,
    });
  } catch (error) {
    console.error("Error uploading schedule:", error);
    res
      .status(500)
      .json({ message: "Failed to upload schedule from Google Classroom" });
  }
};

const setGoogleCredentials = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    console.log(oath2Cl)
    if (!user || !user.googleAccessToken) {
      return res.status(401).json({
        message: "Please sign in with Google to access classroom features.",
      });
    }

    // Check if the access token is expired and refresh if needed (optional step, see below)
    oauth2Client.setCredentials({
      access_token: user.googleAccessToken,
    });

    // Check if the access token has expired, and refresh if needed
    const tokensInfo = await oauth2Client.getTokenInfo(user.googleAccessToken);

    // If token is expired or expiring soon, refresh the token
    if (Date.now() >= tokensInfo.expiry_date - 10000) {
      if (!user.googleRefreshToken) {
        return res
          .status(401)
          .json({ message: "Missing Google refresh token." });
      }

      const newTokens = await oauth2Client.refreshAccessToken();
      const { access_token } = newTokens.credentials;

      // Update user with new access token
      user.googleAccessToken = access_token;
      await user.save();

      // Set new access token in oauth2Client
      oauth2Client.setCredentials({
        access_token: access_token,
      });
    }

    next();
  } catch (error) {
    console.error("Error setting Google credentials:", error);
    res.status(500).json({ message: "Failed to authenticate Google access." });
  }
};

const getGoogleClassroomCourses = async (req, res) => {
  const classroom = google.classroom({ version: "v1", auth: oauth2Client });

  try {
    const response = await classroom.courses.list();
    const courses = response.data.courses;

    if (!courses || courses.length === 0) {
      return res.status(404).json({ message: "No courses found." });
    }

    res.status(200).json(courses);
  } catch (error) {
    console.error("Error fetching Classroom courses:", error);
    res
      .status(500)
      .json({ message: "Failed to retrieve Google Classroom courses." });
  }
};

const getGoogleClassroomAssignments = async (req, res) => {
  const { courseId } = req.params;
  const classroom = google.classroom({ version: "v1", auth: oauth2Client });

  try {
    const response = await classroom.courses.courseWork.list({
      courseId: courseId,
    });
    const assignments = response.data.courseWork;

    if (!assignments || assignments.length === 0) {
      return res
        .status(404)
        .json({ message: "No assignments found for this course." });
    }

    res.status(200).json(assignments);
  } catch (error) {
    console.error("Error fetching Classroom assignments:", error);
    res
      .status(500)
      .json({ message: "Failed to retrieve assignments for the course." });
  }
};

module.exports = {
  setGoogleCredentials,
  getGoogleClassroomCourses,
  getGoogleClassroomAssignments,
  uploadClassroomSchedule,
};
