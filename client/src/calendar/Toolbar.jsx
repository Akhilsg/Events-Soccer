import { Icon } from "@iconify/react";
import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { PickerLeftIcon, PickerRightIcon } from "../custom/DatePicker";

export default function CustomToolbar({ label, onNavigate, onView }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [view, setView] = useState({
    title: "Month",
    icon: "mingcute:calendar-month-line",
  });

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (newView, icon) => {
    setAnchorEl(null);
    setView({
      title: newView.charAt(0).toUpperCase() + newView.slice(1),
      icon,
    });
    onView(newView);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
        color: "#fff",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Button
          onClick={handleClick}
          color="inherit"
          startIcon={<Icon icon={view.icon} />}
          endIcon={
            <Icon icon="solar:alt-arrow-down-linear" width="22" height="22" />
          }
        >
          {view.title}
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          <MenuItem
            onClick={() => handleClose("month", "mingcute:calendar-month-line")}
          >
            <Icon icon="mingcute:calendar-month-line" />
            &nbsp; Month
          </MenuItem>
          <MenuItem
            onClick={() => handleClose("week", "mingcute:calendar-week-line")}
          >
            <Icon icon="mingcute:calendar-week-line" /> &nbsp; Week
          </MenuItem>
          <MenuItem
            onClick={() => handleClose("day", "mingcute:calendar-day-line")}
          >
            <Icon icon="mingcute:calendar-day-line" /> &nbsp; Day
          </MenuItem>
        </Menu>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center" }}>
        <IconButton onClick={() => onNavigate("PREV")}>
          <PickerLeftIcon />
        </IconButton>
        <Typography variant="h6" sx={{ margin: "0 10px" }}>
          {label}
        </Typography>
        <IconButton onClick={() => onNavigate("NEXT")}>
          <PickerRightIcon />
        </IconButton>
      </Box>

      <Button
        variant="contained"
        onClick={() => onNavigate("TODAY")}
        sx={{
          backgroundColor: "#ff5f40",
          boxShadow: 0,
          transition:
            "background-color 250ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1), border-color 250ms cubic-bezier(0.4, 0, 0.2, 1), color 250ms cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            backgroundColor: "#B71D18",
            boxShadow: "rgba(255, 86, 48, 0.24) 0px 8px 16px 0px",
          },
        }}
      >
        Today
      </Button>
    </Box>
  );
}
