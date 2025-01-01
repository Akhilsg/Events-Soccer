require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const router = express.Router();

app.use(cors());
app.use(express.json());

mongoose.connect(
  `mongodb+srv://${process.env.MONGO_NAME}:${process.env.MONGO_PASSWORD}@cluster0.3ieir.mongodb.net/${process.env.MONGO_DATABASE_NAME}`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.error(`MongoDB connection error: ${err}`);
});

const eventRoutes = require("./routes/events");
const userRoutes = require("./routes/auth");
const classroomRoutes = require("./routes/classroom");

app.use("/events", eventRoutes);
app.use("/auth", userRoutes);
app.use("/classroom", classroomRoutes);

app.get("/", (req, res) => {
  res.send("AI Scheduling App Backend is running.");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
