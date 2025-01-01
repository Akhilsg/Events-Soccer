import { Badge, badgeClasses, Box } from "@mui/material";
import {
  DateCalendar,
  DayCalendarSkeleton,
  PickersDay,
} from "@mui/x-date-pickers";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  PickerLeftIcon,
  PickerRightIcon,
  PickerSwitchIcon,
} from "../../custom/DatePicker";

const DayComponent = (props) => {
  const { eventDays = [], day, outsideCurrentMonth, index, ...other } = props;
  const eventCount = eventDays.filter(
    (eventDay) => eventDay === day.date()
  ).length;

  const dayStyle = index === 0 ? { mt: "0px" } : {};

  return (
    <Badge
      key={day.toString()}
      overlap="circular"
      color="primary"
      badgeContent={eventCount}
      sx={{
        [`& .${badgeClasses.badge}`]: {
          fontSize: "12px",
          scale: "0.9",
        },
      }}
    >
      <PickersDay
        {...other}
        outsideCurrentMonth={outsideCurrentMonth}
        day={day}
        selected={false}
        sx={dayStyle}
      />
    </Badge>
  );
};

export default function SmallCalendar() {
  const [eventDays, setEventDays] = useState([]);
  const [loading, setLoading] = useState(false);

  const { events } = useSelector((state) => state.event);

  useEffect(() => {
    const extractEventDays = () => {
      const days = events.map((event) => moment(event.start).date());
      setEventDays(days);
    };

    extractEventDays();
  }, [events]);

  const handleMonthChange = (month) => {
    setLoading(true);
    const startOfMonth = month.clone().startOf("month");
    const endOfMonth = month.clone().endOf("month");

    const eventsInCurrentMonth = events.filter((event) => {
      const startDate = moment(event.start);
      return startDate.isBetween(startOfMonth, endOfMonth, null, "[]");
    });

    const days = eventsInCurrentMonth.map((event) =>
      moment(event.start).date()
    );
    setEventDays(days);
    setLoading(false);
  };

  return (
    <Box
      sx={{
        border: "1px solid rgba(145 158 171 / 0.16)",
        borderRadius: "16px",
      }}
    >
      <DateCalendar
        loading={loading}
        onMonthChange={handleMonthChange}
        renderLoading={() => <DayCalendarSkeleton />}
        slots={{
          day: (slotProps) => (
            <DayComponent {...slotProps} eventDays={eventDays} />
          ),
          leftArrowIcon: PickerLeftIcon,
          rightArrowIcon: PickerRightIcon,
          switchViewButton: PickerSwitchIcon,
        }}
        view="day"
        slotProps={{
          day: (date, index) => ({
            day: date,
            index,
          }),
        }}
      />
    </Box>
  );
}
