import {
  Box,
  Button,
  Checkbox,
  createSvgIcon,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { MobileDateTimePicker } from "@mui/x-date-pickers/MobileDateTimePicker";
import moment from "moment";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createEvent } from "../actions/event";
import { Scrollbar } from "../custom/scrollbar/Scrollbar";
import Draggable from "react-draggable";

const PickerIcon = createSvgIcon(
  <>
    <path
      fill="#637381"
      d="M6.96 2c.418 0 .756.31.756.692V4.09c.67-.012 1.422-.012 2.268-.012h4.032c.846 0 1.597 0 2.268.012V2.692c0-.382.338-.692.756-.692s.756.31.756.692V4.15c1.45.106 2.403.368 3.103 1.008c.7.641.985 1.513 1.101 2.842v1H2V8c.116-1.329.401-2.2 1.101-2.842c.7-.64 1.652-.902 3.103-1.008V2.692c0-.382.339-.692.756-.692"
    />
    <path
      fill="#637381"
      d="M22 14v-2c0-.839-.013-2.335-.026-3H2.006c-.013.665 0 2.161 0 3v2c0 3.771 0 5.657 1.17 6.828C4.349 22 6.234 22 10.004 22h4c3.77 0 5.654 0 6.826-1.172C22 19.657 22 17.771 22 14"
      opacity="0.5"
    />
    <path fill="#637381" d="M18 16.5a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0" />
  </>,
  "PickerIcon"
);

function PaperComponent(props) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

export default function Create({ open, setOpen }) {
  const theme = useTheme();
  const [recOpen, setRecOpen] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    start: moment(),
    end: moment().add(1, "day"),
    recurrenceFrequency: "daily",
    recurrenceInterval: 1,
    recurringSelectedWeekdays: [],
    recurringEndOption: "never",
    recurringEndDate: moment().add(1, "month"),
    recurringOccurrences: 1,
  });
  const [errors, setErrors] = useState({
    title: "",
    description: "",
    end: "",
  });
  const dispatch = useDispatch();

  const handleRecurringEventChange = (e) => {
    setIsRecurring(e.target.checked);
    if (!isRecurring) {
      setRecOpen(true);
    }
  };

  const handleCheck = () => {
    const newErrors = {};
    const { title, description, start, end } = eventData;

    if (!title.trim()) {
      newErrors.title = "Title is required";
    }
    if (!description.trim()) {
      newErrors.description = "Description is required";
    }
    if (end < start) {
      newErrors.end = "End date must be after start date";
    }

    setErrors({ ...errors, ...newErrors });
  };

  const handleSubmit = () => {
    handleCheck();

    const {
      title,
      description,
      start,
      end,
      recurrenceFrequency,
      recurrenceInterval,
      recurringEndOption,
      recurringEndDate,
      recurringOccurrences,
      recurringSelectedWeekdays,
    } = eventData;

    if (!title.trim() || !description.trim() || end < start) {
      return;
    } else {
      if (!isRecurring) {
        dispatchCreateEvent(eventData);
      } else {
        const recurringEvents = [];

        const incrementUnit =
          recurrenceFrequency === "daily"
            ? "days"
            : recurrenceFrequency === "weekly"
            ? "weeks"
            : recurrenceFrequency === "monthly"
            ? "months"
            : "years";

        for (let i = 0; i < recurringOccurrences; i++) {
          if (
            recurrenceFrequency === "weekly" &&
            recurringSelectedWeekdays.length
          ) {
            recurringSelectedWeekdays.forEach((weekday) => {
              const eventStart = moment(start)
                .add(i * recurrenceInterval, incrementUnit)
                .day(weekday);
              const eventEnd = moment(end)
                .add(i * recurrenceInterval, incrementUnit)
                .day(weekday);

              if (
                recurringEndOption === "on" &&
                eventStart.isAfter(recurringEndDate)
              )
                return;
              if (recurringEndOption === "after" && i >= recurringOccurrences)
                return;

              recurringEvents.push(
                createRecurringEvent(
                  eventStart,
                  eventEnd,
                  eventData,
                  recurringEvents.length
                )
              );
            });
          } else {
            const eventStart = moment(start).add(
              i * recurrenceInterval,
              incrementUnit
            );
            const eventEnd = moment(end).add(
              i * recurrenceInterval,
              incrementUnit
            );

            if (
              recurringEndOption === "on" &&
              eventStart.isAfter(recurringEndDate)
            )
              break;
            if (recurringEndOption === "after" && i >= recurringOccurrences)
              break;

            recurringEvents.push(
              createRecurringEvent(
                eventStart,
                eventEnd,
                eventData,
                recurringEvents.length
              )
            );
          }
        }

        recurringEvents.forEach((event) => dispatch(createEvent(event)));
      }

      resetEventData();
      setOpen(false);
    }
  };

  const createRecurringEvent = (start, end, eventData, index) => ({
    ...eventData,
    id: Math.floor(Math.random() * 1000000000) + index,
    createdAt: new Date(),
    start: start.toDate(),
    end: end.toDate(),
  });

  const dispatchCreateEvent = (eventData) => {
    dispatch(
      createEvent({
        ...eventData,
        id: Math.floor(Math.random() * 1000000000),
        createdAt: new Date(),
      })
    );
  };

  const resetEventData = () => {
    setEventData({
      title: "",
      description: "",
      start: moment(),
      end: moment().add(1, "day"),
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData({ ...eventData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleWeekdayToggle = (index) => {
    const selectedWeekdays = [...eventData.recurringSelectedWeekdays];
    if (selectedWeekdays.includes(index)) {
      const indexToRemove = selectedWeekdays.indexOf(index);
      selectedWeekdays.splice(indexToRemove, 1);
    } else {
      selectedWeekdays.push(index);
    }
    setEventData({
      ...eventData,
      recurringSelectedWeekdays: selectedWeekdays,
    });
  };

  const renderWeekdayButtons = () => {
    if (eventData.recurrenceFrequency === "weekly") {
      return (
        <>
          <Typography sx={{ my: 2 }}>Repeat on</Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            {["S", "M", "T", "W", "Th", "F", "Sa"].map((day, index) => (
              <Box
                key={day}
                sx={[
                  {
                    padding: theme.spacing(2),
                    borderRadius: "50%",
                    display: "inline-flex",
                    boxSizing: "border-box",
                    alignItems: "center",
                    cursor: "pointer",
                    fontSize: "15px",
                    justifyContent: "center",
                    height: "32px",
                    width: "32px",
                    fontWeight: 600,
                    ...(eventData.recurringSelectedWeekdays.includes(index)
                      ? {
                          border: "1px solid transparent",
                          color: "black",
                          bgcolor: "primary.main",
                          "&:hover": {
                            bgcolor: "primary.main",
                            color: "black",
                          },
                        }
                      : {
                          border: "1px solid rgba(145 158 171 / 0.2)",
                          "&:hover": {
                            bgcolor: "rgba(145 158 171 / 0.08)",
                          },
                        }),
                  },
                  eventData.recurringSelectedWeekdays.includes(index)
                    ? {
                        color: "black",
                        bgcolor: "primary.main",
                      }
                    : {
                        bgcolor: "inherit",
                      },
                ]}
                onClick={() => handleWeekdayToggle(index)}
              >
                {day}
              </Box>
            ))}
          </Box>
        </>
      );
    }
  };

  const renderEndOptions = () => {
    if (eventData.recurringEndOption === "on") {
      return (
        <DatePicker
          required
          label="End on"
          value={eventData.recurringEndDate}
          onChange={(newValue) =>
            setEventData({ ...eventData, recurringEndDate: newValue })
          }
          slots={{ openPickerIcon: PickerIcon }}
          slotProps={{
            textField: {
              fullWidth: true,
            },
          }}
          sx={{ mt: 2 }}
        />
      );
    } else if (eventData.recurringEndOption === "after") {
      return (
        <TextField
          label="After"
          type="number"
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                occurrence{eventData.recurringOccurrences === 1 ? "" : "s"}
              </InputAdornment>
            ),
          }}
          value={eventData.recurringOccurrences}
          onChange={(e) =>
            setEventData({
              ...eventData,
              recurringOccurrences: e.target.value,
            })
          }
          sx={{ mt: 2 }}
        />
      );
    }
    return null;
  };

  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      open={open}
      onClose={() => setOpen(false)}
      PaperComponent={PaperComponent}
      transitionDuration={{
        enter: theme.transitions.duration.shortest,
        exit: theme.transitions.duration.shortest - 80,
      }}
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: "rgba(28 37 46 / 0.48)",
          },
        },
      }}
      PaperProps={{
        sx: {
          backgroundImage: "none",
          boxShadow: "-40px 40px 80px -8px rgba(0 0 0 / 0.24)",
          borderRadius: theme.shape.borderRadius,
          display: "flex",
          overflow: "hidden",
          flexDirection: "column",
        },
      }}
    >
      <DialogTitle
        sx={{ minHeight: 76, padding: theme.spacing(3), cursor: "move" }}
        id="draggable-dialog-title"
      >
        Add event
      </DialogTitle>

      <Scrollbar sx={{ p: 3, bgcolor: "background.neutral" }}>
        <Stack spacing={3}>
          <div>
            <Typography fontWeight="bold" variant="subtitle2">
              Details
            </Typography>
            <TextField
              onChange={handleChange}
              name="title"
              value={eventData.title}
              error={Boolean(errors.title)}
              helperText={errors.title}
              label="Title"
              fullWidth
              margin={Boolean(errors.title) ? "none" : "normal"}
              sx={{ mt: 2 }}
            />
            <TextField
              onChange={handleChange}
              name="description"
              value={eventData.description}
              error={Boolean(errors.description)}
              helperText={errors.description}
              label="Description"
              fullWidth
              multiline
              minRows={4}
              margin={Boolean(errors.description) ? "none" : "normal"}
              sx={{ mt: 2 }}
            />
          </div>
          <Typography fontWeight="bold" variant="subtitle2">
            Date options
          </Typography>
          <MobileDateTimePicker
            onChange={(newValue) =>
              setEventData({ ...eventData, start: newValue })
            }
            name="start"
            value={eventData.start}
            label="Start"
            slotProps={{
              textField: {
                fullWidth: true,
              },
            }}
          />
          <MobileDateTimePicker
            onChange={(newValue) => {
              setEventData({ ...eventData, end: newValue });
              if (newValue > eventData.start) {
                setErrors({ ...errors, end: "" });
              }
            }}
            name="end"
            value={eventData.end}
            label="End"
            slotProps={{
              textField: {
                fullWidth: true,
                error: Boolean(errors.end),
                helperText: errors.end,
              },
            }}
          />
          <Box sx={{ px: "4px" }}>
            <FormControl component="fieldset" variant="standard">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isRecurring}
                    onChange={handleRecurringEventChange}
                  />
                }
                label="Recurring Event"
              />
              <FormHelperText>
                Set options to add events based on a certain pattern
              </FormHelperText>
            </FormControl>
          </Box>
        </Stack>
      </Scrollbar>
      <DialogActions
        disableSpacing
        sx={{
          padding: theme.spacing(3),
          flexShrink: 0,
          "& > :not(:first-of-type)": { marginLeft: theme.spacing(1.5) },
        }}
      >
        <Box sx={{ flexGrow: 1 }} />
        <Button onClick={() => setOpen(false)} variant="outlined">
          Cancel
        </Button>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Create
        </Button>
      </DialogActions>
      <Dialog
        open={recOpen}
        onClose={() => setRecOpen(false)}
        hideBackdrop
        PaperProps={{
          sx: {
            width: 400,
            backgroundImage: "none",
            boxShadow: "-40px 40px 80px -8px rgba(0 0 0 / 0.24)",
            borderRadius: theme.shape.borderRadius,
            display: "flex",
            overflow: "hidden",
            flexDirection: "column",
          },
        }}
      >
        <DialogTitle sx={{ textAlign: "center", padding: theme.spacing(2) }}>
          Recurring Event Options
        </DialogTitle>
        <DialogContent
          sx={{
            padding: theme.spacing(0, 3),
            "&.MuiDialogContent-dividers": {
              borderTop: 0,
              borderBottomStyle: "dashed",
              paddingBottom: theme.spacing(3),
            },
          }}
          dividers
        >
          <Box
            sx={{
              display: "flex",
              gap: 2,
            }}
          >
            <FormControl sx={{ width: "50%" }} margin="normal">
              <InputLabel id="interval">Repeat every</InputLabel>
              <Select
                labelId="interval"
                label="Repeat every"
                value={eventData.recurrenceInterval}
                onChange={handleChange}
                name="recurrenceInterval"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((number) => (
                  <MenuItem key={number} value={number}>
                    {number}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel id="frequency">Frequency</InputLabel>
              <Select
                label="Frequency"
                labelId="frequency"
                value={eventData.recurrenceFrequency}
                onChange={handleChange}
                name="recurrenceFrequency"
              >
                <MenuItem value="daily">
                  Day{eventData.recurrenceInterval === "1" ? "" : "s"}
                </MenuItem>
                <MenuItem value="weekly">
                  Week{eventData.recurrenceInterval === "1" ? "" : "s"}
                </MenuItem>
                <MenuItem value="monthly">
                  Month{eventData.recurrenceInterval === "1" ? "" : "s"}
                </MenuItem>
                <MenuItem value="yearly">
                  Year{eventData.recurrenceInterval === "1" ? "" : "s"}
                </MenuItem>
              </Select>
            </FormControl>
          </Box>
          {renderWeekdayButtons()}
          <FormControl component="fieldset" fullWidth margin="normal">
            <Typography>Ends</Typography>
            <RadioGroup
              aria-label="endOption"
              name="recurringEndOption"
              value={eventData.recurringEndOption}
              onChange={handleChange}
            >
              <FormControlLabel value="on" control={<Radio />} label="On" />
              <FormControlLabel
                value="after"
                control={<Radio />}
                label="After"
              />
            </RadioGroup>
            {renderEndOptions()}
          </FormControl>
        </DialogContent>
        <DialogActions
          disableSpacing
          sx={{
            padding: theme.spacing(3),
            flexShrink: 0,
            "& > :not(:first-of-type)": { marginLeft: theme.spacing(1.5) },
          }}
        >
          <Button variant="outlined" onClick={() => setRecOpen(false)}>
            Close
          </Button>
          <Button onClick={() => setRecOpen(false)} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
}
