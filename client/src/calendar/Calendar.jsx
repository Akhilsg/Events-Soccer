import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import { Box, Button, useTheme } from "@mui/material";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useDispatch, useSelector } from "react-redux";
import { setEvents, setSelectedEvent } from "../actions/event";
import "./Calendar.css";
import EventInfo from "./EventInfo";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/addons/dragAndDrop/styles.scss";
import CustomToolbar from "./Toolbar";
import axios from "axios";
import { Icon } from "@iconify/react/dist/iconify.js";
import { uploadSchedule } from "../actions/classroom";

const DragAndDropCalendar = withDragAndDrop(BigCalendar);
const localizer = momentLocalizer(moment);

export default function Calendar() {
  const { user } = useSelector((state) => state.auth);
  const { events, selectedEvent } = useSelector((state) => state.event);
  const [anchorEl, setAnchorEl] = useState(null);
  const darkMode = useTheme().palette.mode === "dark";
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/events/user/${user.id}`
        );
        const fetchedEvents = response.data;

        const calendarEvents = fetchedEvents.map((event) => ({
          id: event._id,
          title: event.title,
          start: new Date(event.startDateTime || event.dueDate),
          end: new Date(event.endDateTime || event.dueDate),
        }));

        dispatch(setEvents(calendarEvents));
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, [dispatch]);

  const handleEventClick = (event, target) => {
    dispatch(setSelectedEvent(event));
    setAnchorEl(target);
  };

  const moveEvent = useCallback(
    ({ event, start, end, isAllDay: droppedOnAllDaySlot = false }) => {
      const { allDay } = event;
      if (!allDay && droppedOnAllDaySlot) {
        event.allDay = true;
      }

      dispatch(
        setEvents(
          events.map((ev) =>
            ev.id === event.id ? { ...ev, start, end, allDay } : ev
          )
        )
      );
    },
    [dispatch, events]
  );

  const handleUploadSchedule = () => {
    dispatch(uploadSchedule())
      .then(() => {
        // Handle success - maybe show a notification
      })
      .catch(() => {
        // Handle error
      });
  };

  return (
    <div className={`calendar ${darkMode && "dark"}`}>
      {/* Schedule Events Button */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button
          variant="contained"
          onClick={() => handleUploadSchedule()}
          startIcon={
            <Icon icon="mdi:google-classroom" width="24" height="24" />
          }
        >
          Upload Schedule
        </Button>
      </Box>

      <Box sx={{ height: "83vh", width: "100%" }}>
        <DragAndDropCalendar
          localizer={localizer}
          events={events}
          views={{ month: true, week: true, day: true }}
          showMultiDayTimes
          popup
          selectable
          onSelectEvent={(event, e) => handleEventClick(event, e.currentTarget)}
          onEventDrop={moveEvent}
          components={{
            toolbar: (props) => <CustomToolbar {...props} />,
          }}
        />
      </Box>
      {selectedEvent && (
        <EventInfo anchorEl={anchorEl} setAnchorEl={setAnchorEl} />
      )}
    </div>
  );
}
