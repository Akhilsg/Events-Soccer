
import axios from "axios";

const API_URL = "http://localhost:5000/classroom/";

const uploadSchedule = () => {
  return axios.post(API_URL + "upload-schedule");
};

export default {
  uploadSchedule,
};
