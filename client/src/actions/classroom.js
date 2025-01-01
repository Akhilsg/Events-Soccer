import { UPLOAD_SCHEDULE_SUCCESS, UPLOAD_SCHEDULE_FAIL, SET_MESSAGE } from "../types/types";
import ClassroomService from "../api/Classroom";

export const uploadSchedule = () => (dispatch) => {
  return ClassroomService.uploadSchedule().then(
    (response) => {
      dispatch({
        type: UPLOAD_SCHEDULE_SUCCESS,
        payload: response.data,
      });

      return Promise.resolve();
    },
    (error) => {
      const message = 
        (error.response && 
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      dispatch({
        type: UPLOAD_SCHEDULE_FAIL,
      });

      dispatch({
        type: SET_MESSAGE,
        payload: message,
      });

      return Promise.reject();
    }
  );
};
