import {
  ClickAwayListener,
  FormHelperText,
  InputBase,
  inputBaseClasses,
  Paper,
} from "@mui/material";
import React, { useState } from "react";

const AddTask = ({ setShowAddTask, onAddTask }) => {
  const [taskName, setTaskName] = useState("");

  const handleCancel = () => {
    setShowAddTask(false);
  };

  return (
    <ClickAwayListener onClickAway={handleCancel}>
      <div>
        <Paper
          sx={{
            borderRadius: "10px",
            backgroundImage: "none",
            backgroundColor: "background.default",
            boxShadow: "0 1px 2px 0 rgba(0 0 0 / 0.16)",
          }}
        >
          <InputBase
            autoFocus
            fullWidth
            placeholder="Untitled"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setShowAddTask(false);
                setTaskName("");
              } else if (e.key === "Enter") {
                e.preventDefault();
                onAddTask(taskName);
                setShowAddTask(false);
                setTaskName("");
              }
            }}
            sx={{
              px: 2,
              height: 56,
              [`& .${inputBaseClasses.input}`]: {
                p: 0,
                typography: "subtitle2",
              },
            }}
          />
        </Paper>

        <FormHelperText sx={{ mx: 1 }}>
          Press <strong>Enter</strong> to create the task.
        </FormHelperText>
      </div>
    </ClickAwayListener>
  );
};

export default AddTask;
