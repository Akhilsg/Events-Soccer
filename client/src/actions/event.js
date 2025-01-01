import {
  CREATE_EVENT,
  DELETE_EVENT,
  SET_EVENTS,
  SET_SELECTED_EVENT,
} from "../types/types";

export const setEvents = (events) => ({
  type: SET_EVENTS,
  payload: events,
});

export const setSelectedEvent = (selectedEvent) => ({
  type: SET_SELECTED_EVENT,
  payload: selectedEvent,
});

export const createEvent = (eventData) => ({
  type: CREATE_EVENT,
  payload: eventData,
});

export const deleteEvent = (eventId) => ({
  type: DELETE_EVENT,
  payload: eventId,
});
