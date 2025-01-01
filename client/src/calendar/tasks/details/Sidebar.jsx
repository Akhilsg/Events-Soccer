import {
  Box,
  Button,
  Dialog,
  Drawer,
  InputAdornment,
  styled,
  Tab,
  TextField,
  Tooltip,
} from "@mui/material";
import { StaticDatePicker } from "@mui/x-date-pickers";
import moment from "moment";
import React, { useState } from "react";
import { Scrollbar } from "../../../custom/scrollbar/Scrollbar";
import { CustomInput } from "./Input";
import SidebarToolbar from "./SidebarToolbar";
import SubTasks from "./Subtasks";
import { CustomTabs } from "./Tabs";
import TagsList from "./Tags";

const StyledLabel = styled("span")(({ theme }) => ({
  lineHeight: 1.5,
  fontSize: theme.typography.pxToRem(13),
  width: 100,
  flexShrink: 0,
  color: theme.palette.text.secondary,
  fontWeight: 600,
}));

const EventSidebar = ({ open, task, onClose, onUpdate, onDelete }) => {
  const [editedTask, setEditedTask] = useState(task);
  const [currentTab, setCurrentTab] = useState("overview");
  const [dueDateOpen, setDueDateOpen] = useState(false);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(editedTask);
    onClose();
  };

  const handleDelete = () => {
    onDelete(task._id);
    onClose();
  };

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        disableEscapeKeyDown
        slotProps={{ backdrop: { invisible: true } }}
        PaperProps={{ sx: { width: { xs: 1, sm: 440 } } }}
      >
        <SidebarToolbar
          onClose={onClose}
          priority={task.priority}
          onUpdate={onUpdate}
          onDelete={handleDelete}
          task={task}
        />
        <CustomTabs
          value={currentTab}
          onChange={handleTabChange}
          variant="fullWidth"
          slotProps={{ tab: { px: 0 } }}
        >
          {[
            { value: "overview", label: "Overview" },
            {
              value: "subTasks",
              label: `Subtasks (${task.subTasks.length || 0})`,
            },
          ].map((tab) => (
            <Tab key={tab.value} value={tab.value} label={tab.label} />
          ))}
        </CustomTabs>
        <Scrollbar fillContent sx={{ py: 3, px: 2.5 }}>
          {currentTab === "overview" ? (
            <Box sx={{ gap: 3, display: "flex", flexDirection: "column" }}>
              <Tooltip title="Edit title" placement="right" arrow>
                <span>
                  <CustomInput
                    placeholder="Task name"
                    value={editedTask?.title}
                    onChange={(e) =>
                      setEditedTask({ ...editedTask, title: e.target.value })
                    }
                    onKeyDown={(e) => {
                      if (editedTask?.title) {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          onUpdate(editedTask);
                        }
                      }
                    }}
                    inputProps={{ id: `input-task-${editedTask?.title}` }}
                  />
                </span>
              </Tooltip>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <StyledLabel>Due Date</StyledLabel>
                <Button
                  size="small"
                  color="inherit"
                  onClick={() => setDueDateOpen(true)}
                >
                  {moment(editedTask?.dueDate).format("DD MMM YYYY")}
                </Button>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <StyledLabel>Duration</StyledLabel>
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  value={editedTask?.duration || 0}
                  onChange={(e) =>
                    setEditedTask({
                      ...editedTask,
                      duration: Number(e.target.value),
                    })
                  }
                  InputProps={{
                    sx: { typography: "body2" },
                    inputProps: { min: 0, max: 10 },
                    endAdornment: (
                      <InputAdornment sx={{ ml: 1 }} position="start">
                        hours
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "start",
                  alignItems: "center",
                }}
              >
                <StyledLabel>Tags</StyledLabel>
                <TagsList
                  tags={editedTask?.tags || []}
                  onUpdate={(newTags) =>
                    setEditedTask({ ...editedTask, tags: newTags })
                  }
                />
              </Box>
              <Box sx={{ display: "flex", alignItems: "start" }}>
                <StyledLabel>Description</StyledLabel>
                <TextField
                  fullWidth
                  multiline
                  size="small"
                  minRows={4}
                  value={editedTask?.description || ""}
                  onChange={(e) =>
                    setEditedTask({
                      ...editedTask,
                      description: e.target.value,
                    })
                  }
                  InputProps={{
                    sx: { typography: "body2" },
                  }}
                />
              </Box>
            </Box>
          ) : (
            <SubTasks task={task} onUpdate={onUpdate} />
          )}
        </Scrollbar>
        {currentTab !== "subTasks" && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              p: 2.5,
              borderTop: "1px dashed",
              borderColor: "divider",
            }}
          >
            <Button variant="contained" onClick={handleSubmit}>
              Save Changes
            </Button>
          </Box>
        )}
      </Drawer>
      <Dialog open={dueDateOpen} onClose={() => setDueDateOpen(false)}>
        <StaticDatePicker
          autoFocus
          value={moment(editedTask?.dueDate)}
          onChange={(newDate) => {
            setEditedTask({
              ...editedTask,
              dueDate: moment(newDate),
            });
            setDueDateOpen(false);
          }}
          onAccept={() => setDueDateOpen(false)}
        />
      </Dialog>
    </>
  );
};

export default EventSidebar;
