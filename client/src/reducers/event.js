import {
  CREATE_EVENT,
  SET_SELECTED_EVENT,
  DELETE_EVENT,
  SET_EVENTS,
} from "../types/types";

const initialState = {
  selectedEvent: null,
  events: [],
};

const eventReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SELECTED_EVENT:
      return {
        ...state,
        selectedEvent: action.payload,
      };
    case CREATE_EVENT:
      return {
        ...state,
        events: [...state.events, action.payload],
        selectedEvent: null,
      };
    case DELETE_EVENT:
      return {
        ...state,
        events: state.events.filter((event) => event.id !== action.payload),
        selectedEvent: null,
      };
    case SET_EVENTS:
      return {
        ...state,
        events: action.payload,
      };

    default:
      return state;
  }
};

export default eventReducer;
