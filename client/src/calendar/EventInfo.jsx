import {
  Box,
  Button,
  DialogActions,
  DialogTitle,
  Divider,
  IconButton,
  Paper,
  Popover,
  TextField,
  Tooltip,
  Typography,
  useTheme,
  Zoom,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import { CalendarClock, Check, Edit2, Text, Trash2 } from "lucide-react";
import moment from "moment";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteEvent, setSelectedEvent } from "../actions/event";

export default function EventInfo({ anchorEl, setAnchorEl }) {
  const { selectedEvent } = useSelector((state) => state.event);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [eventData, setEventData] = useState(selectedEvent);
  const open = Boolean(anchorEl);
  const dispatch = useDispatch();
  const theme = useTheme();

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSaveEdit = () => {
    dispatch(setSelectedEvent(eventData));
    setEditMode(false);
  };

  const handleDelete = () => {
    if (confirmDelete === selectedEvent.id) {
      dispatch(deleteEvent(selectedEvent.id));
      setAnchorEl(null);
    } else {
      setConfirmDelete(selectedEvent.id);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Popover
      id={open ? `${selectedEvent.id}-popover` : undefined}
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      slotProps={{
        paper: {
          sx: {
            backgroundColor: "transparent",
            backgroundImage: "none",
            boxShadow: "-40px 40px 80px -8px rgba(0 0 0 / 0.24)",
            borderRadius: "16px",
            width: "300px",
          },
        },
      }}
    >
      <Paper elevation={0} sx={{ backgroundColor: "background.neutral" }}>
        <Box>
          <Typography variant="h6">
            {editMode ? (
              <TextField
                name="title"
                value={eventData.title}
                onChange={handleChange}
                fullWidth
                inputProps={{
                  style: {
                    fontSize: "18px",
                    lineHeight: "20px",
                  },
                }}
              />
            ) : (
              selectedEvent.title
            )}
          </Typography>
          {!editMode && (
            <Typography variant="caption">
              Created {moment(selectedEvent.createdAt).fromNow()}
            </Typography>
          )}
        </Box>
        <Box>
          {editMode ? (
            <>
              <Zoom in timeout={300}>
                <IconButton onClick={handleSaveEdit}>
                  <Check color="green" />
                </IconButton>
              </Zoom>
            </>
          ) : (
            <>
              <Tooltip title="Edit">
                <IconButton onClick={handleEdit}>
                  <Edit2 size={18} />
                </IconButton>
              </Tooltip>
              {confirmDelete === selectedEvent.id ? (
                <Zoom in timeout={300}>
                  <IconButton onClick={handleDelete}>
                    <Check color="green" />
                  </IconButton>
                </Zoom>
              ) : (
                <IconButton onClick={handleDelete}>
                  <Trash2 color="red" />
                </IconButton>
              )}
            </>
          )}
        </Box>
        <Typography
          variant="body1"
          fontSize="15px"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mb: 1,
          }}
        >
          {editMode ? (
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <DateTimePicker
                onChange={(newValue) => {
                  setEventData({ ...eventData, start: newValue });
                }}
                name="start"
                value={eventData.start}
                label="Start"
                slotProps={{
                  textField: {
                    fullWidth: true,
                  },
                }}
              />
              <DateTimePicker
                onChange={(newValue) => {
                  setEventData({ ...eventData, end: newValue });
                }}
                name="end"
                value={eventData.end}
                label="End"
                slotProps={{
                  textField: {
                    fullWidth: true,
                  },
                }}
                sx={{ my: 2 }}
              />
            </Box>
          ) : (
            <>
              <CalendarClock />
              <Typography sx={{ width: "80%" }}>
                {selectedEvent.start === null
                  ? "null"
                  : moment(selectedEvent.start).format(
                      "MMMM Do YYYY, h:mm:ss a"
                    )}{" "}
                -{" "}
                {selectedEvent.end === null
                  ? "null"
                  : moment(selectedEvent.end).format("MMMM Do YYYY, h:mm:ss a")}
              </Typography>
            </>
          )}
        </Typography>
        <Typography
          variant="body1"
          fontSize="15px"
          sx={{ display: "flex", alignItems: "center", gap: 2 }}
        >
          {editMode ? (
            <TextField
              label="Description"
              name="description"
              value={eventData.description}
              onChange={handleChange}
              fullWidth
              multiline
              rows={3}
            />
          ) : (
            <>
              <Tooltip title="Description">
                <Text />
              </Tooltip>
              <Typography sx={{ width: "80%" }}>
                {selectedEvent.description}
              </Typography>
            </>
          )}
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button onClick={() => setAnchorEl(null)} variant="contained">
            Close
          </Button>
        </Box>
      </Paper>
    </Popover>
  );
}
