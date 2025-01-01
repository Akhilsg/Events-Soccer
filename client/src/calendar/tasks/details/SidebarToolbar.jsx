import { Icon } from "@iconify/react/dist/iconify.js";
import {
  Button,
  IconButton,
  MenuItem,
  MenuList,
  Stack,
  Tooltip,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";
import { CustomPopover } from "../../../custom/popover";

const SidebarToolbar = ({ task, onUpdate, onClose, priority, onDelete }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentPriority, setCurrentPriority] = useState(
    priority === 1 ? "High" : priority === 2 ? "Medium" : "Low"
  );

  const theme = useTheme();
  const smUp = theme.breakpoints.up("sm");

  const handleChangeStatus = (newPriority) => {
    const priorityMap = {
      High: 1,
      Medium: 2,
      Low: 3,
    };

    setCurrentPriority(newPriority);
    const updatedTask = {
      ...task,
      priority: priorityMap[newPriority],
    };

    onUpdate(updatedTask);
    setAnchorEl(null);
  };

  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        sx={{
          p: (theme) => theme.spacing(2.5, 1, 2.5, 2.5),
          borderBottom: "1px solid rgba(145 158 171 / 0.2)",
        }}
      >
        {!smUp && (
          <Tooltip title="Back">
            <IconButton onClick={onClose} sx={{ mr: 1 }}>
              <Icon icon="eva:arrow-ios-back-fill" />
            </IconButton>
          </Tooltip>
        )}

        <Button
          size="small"
          variant="soft"
          color="inherit"
          onClick={(e) => setAnchorEl(e.currentTarget)}
          endIcon={
            <Icon
              icon="eva:arrow-ios-downward-fill"
              width={16}
              style={{ marginLeft: "-4px" }}
            />
          }
        >
          {currentPriority}
        </Button>

        <Stack direction="row" justifyContent="flex-end" flexGrow={1}>
          <Tooltip title="Delete task">
            <IconButton color="iconButton" onClick={onDelete}>
              <Icon icon="solar:trash-bin-trash-bold" width={20} />
            </IconButton>
          </Tooltip>

          <IconButton color="iconButton">
            <Icon icon="eva:more-vertical-fill" width={20} />
          </IconButton>
        </Stack>
      </Stack>

      <CustomPopover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        slotProps={{ arrow: { placement: "top-right" } }}
      >
        <MenuList>
          {["High", "Medium", "Low"].map((option) => (
            <MenuItem
              key={option}
              selected={currentPriority === option}
              onClick={() => {
                handleChangeStatus(option);
              }}
            >
              {option}
            </MenuItem>
          ))}
        </MenuList>
      </CustomPopover>

      {/* <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {taskName} </strong>?
          </>
        }
        action={
          <Button variant="contained" color="error" onClick={onDelete}>
            Delete
          </Button>
        }
      /> */}
    </>
  );
};

export default SidebarToolbar;
