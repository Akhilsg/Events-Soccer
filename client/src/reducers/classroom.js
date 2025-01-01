import { UPLOAD_SCHEDULE_SUCCESS, UPLOAD_SCHEDULE_FAIL } from "../types/types";

const initialState = {
  courses: [],
  assignments: [],
  isScheduleUploaded: false
};

const classroomReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case UPLOAD_SCHEDULE_SUCCESS:
      return {
        ...state,
        courses: payload.courses,
        assignments: payload.assignments,
        isScheduleUploaded: true
      };
    case UPLOAD_SCHEDULE_FAIL:
      return {
        ...state,
        isScheduleUploaded: false
      };
    default:
      return state;
  }
};

export default classroomReducer;
