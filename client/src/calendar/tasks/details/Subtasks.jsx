import React, { useRef, useState } from "react";
import {
  TextField,
  Button,
  Stack,
  LinearProgress,
  Typography,
  FormGroup,
  Menu,
  MenuItem,
  Box,
  IconButton,
  Checkbox,
} from "@mui/material";
import { Icon } from "@iconify/react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const SubTasks = ({ task, onUpdate }) => {
  const [subTasks, setSubTasks] = useState(task.subTasks || []);
  const [newSubTask, setNewSubTask] = useState("");
  const [menuPosition, setMenuPosition] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [selectedSubTask, setSelectedSubTask] = useState(null);
  const [dragMode, setDragMode] = useState(false);

  const handleOpenMenu = (event, subTask) => {
    event.preventDefault();
    setSelectedSubTask(subTask);
    setMenuPosition({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
    });
  };

  const handleCloseMenu = () => {
    setMenuPosition(null);
    setSelectedSubTask(null);
  };

  const handleStartEdit = (subTask) => {
    handleCloseMenu();
    setTimeout(() => {
      setEditingId(subTask.id);
      setEditText(subTask.title);
    }, 100);
  };

  const handleAddSubTask = () => {
    if (!newSubTask.trim()) return;
    const newOrder = subTasks.length; // This will be the last index + 1 since array indices start at 0

    const updatedSubTasks = [
      ...subTasks,
      {
        id: Date.now().toString(),
        title: newSubTask,
        completed: false,
        order: newOrder,
      },
    ];

    setSubTasks(updatedSubTasks);
    setNewSubTask("");

    onUpdate({
      ...task,
      subTasks: updatedSubTasks,
    });
  };

  const handleToggleSubTask = (id) => {
    const updatedSubTasks = subTasks.map((subTask) =>
      subTask.id === id
        ? { ...subTask, completed: !subTask.completed }
        : subTask
    );

    setSubTasks(updatedSubTasks);
    onUpdate({
      ...task,
      subTasks: updatedSubTasks,
    });
  };

  const handleDeleteSubTask = (id) => {
    const updatedSubTasks = subTasks.filter((subTask) => subTask.id !== id);

    setSubTasks(updatedSubTasks);
    onUpdate({
      ...task,
      subTasks: updatedSubTasks,
    });
  };

  const handleSaveEdit = () => {
    if (!editText.trim()) return;

    const updatedSubTasks = subTasks.map((subTask) =>
      subTask.id === editingId
        ? { ...subTask, title: editText.trim() }
        : subTask
    );

    setSubTasks(updatedSubTasks);
    setEditingId(null);
    setEditText("");

    onUpdate({
      ...task,
      subTasks: updatedSubTasks,
    });
  };

  const handleDragEnd = (e) => {
    const { active, over } = e;

    if (over && active.id !== over.id) {
      const oldIndex = subTasks.findIndex(
        (subTask) => subTask.id === active.id
      );
      const newIndex = subTasks.findIndex((subTask) => subTask.id === over.id);

      const updatedSubTasks = arrayMove(subTasks, oldIndex, newIndex);

      setSubTasks(updatedSubTasks);
      onUpdate({
        ...task,
        subTasks: updatedSubTasks,
      });
    }
  };

  const SortableItem = ({ subTask }) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({ id: subTask.id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    return (
      <Box
        ref={setNodeRef}
        style={style}
        sx={{ display: "flex", alignItems: "center", width: "100%" }}
      >
        {editingId === subTask.id ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flex: 1,
              gap: 3,
              my: 1,
            }}
          >
            <TextField
              fullWidth
              size="small"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setEditingId(null);
                }
              }}
              autoFocus
            />
            <Button
              onClick={handleSaveEdit}
              disabled={!editText.trim()}
              size="small"
              sx={{
                bgcolor: "rgba(0 167 111 / 0.08)",
                "&:hover": { bgcolor: "rgba(0 167 111 / 0.16)" },
              }}
              startIcon={
                <Icon
                  icon="mingcute:check-fill"
                  width={16}
                  style={{ marginRight: "-2px" }}
                />
              }
            >
              Save
            </Button>
          </Box>
        ) : (
          <>
            <Box
              sx={{
                position: "relative",
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "start",
                mr: 1,
                ml: -1,
              }}
            >
              {!dragMode ? (
                <Checkbox
                  disableRipple
                  checked={subTask.completed}
                  onChange={() => handleToggleSubTask(subTask.id)}
                />
              ) : (
                <IconButton
                  {...attributes}
                  {...listeners}
                  size="small"
                  color="iconButton"
                >
                  <Icon icon="nimbus:drag-dots" width={20} />
                </IconButton>
              )}
            </Box>
            <Typography sx={{ flex: 1 }}>{subTask.title}</Typography>
            {!dragMode && (
              <IconButton
                onClick={(event) => handleOpenMenu(event, subTask)}
                size="small"
                color="iconButton"
              >
                <Icon icon="eva:more-vertical-fill" />
              </IconButton>
            )}
          </>
        )}
      </Box>
    );
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={2}>
        <TextField
          fullWidth
          value={newSubTask}
          onChange={(e) => setNewSubTask(e.target.value)}
          placeholder="Add a subtask"
          size="small"
        />
        <Button
          variant="outlined"
          onClick={handleAddSubTask}
          startIcon={<Icon icon="eva:plus-fill" />}
          disabled={!newSubTask}
        >
          Add
        </Button>
      </Stack>

      {subTasks.length > 0 && (
        <div>
          <Typography variant="body2" sx={{ mb: 1 }}>
            {subTasks.filter((subTask) => subTask.completed).length} of{" "}
            {subTasks.length}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={
              (subTasks.filter((subTask) => subTask.completed).length /
                subTasks.length) *
              100
            }
          />
        </div>
      )}

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={subTasks.map((subTask) => subTask.id)}
          strategy={verticalListSortingStrategy}
        >
          <FormGroup>
            {subTasks.map((subTask) => (
              <SortableItem key={subTask.id} subTask={subTask} />
            ))}
          </FormGroup>
        </SortableContext>
      </DndContext>

      {dragMode && (
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="outlined"
            onClick={() => setDragMode(false)}
            startIcon={
              <Icon
                icon="mingcute:check-fill"
                width={16}
                style={{ marginRight: "-2px" }}
              />
            }
            sx={{ mb: 2 }}
          >
            Done
          </Button>
        </Box>
      )}

      {selectedSubTask && (
        <Menu
          anchorReference="anchorPosition"
          anchorPosition={
            menuPosition !== null
              ? { top: menuPosition.mouseY, left: menuPosition.mouseX }
              : undefined
          }
          open={Boolean(menuPosition)}
          onClose={handleCloseMenu}
        >
          <MenuItem onClick={() => handleStartEdit(selectedSubTask)}>
            <Icon icon="solar:pen-bold" width={20} style={{ marginRight: 8 }} />
            Edit
          </MenuItem>
          <MenuItem
            onClick={() => {
              setDragMode(true);
              handleCloseMenu();
            }}
          >
            <Icon
              icon="eva:move-outline"
              width={20}
              style={{ marginRight: 8 }}
            />
            Move
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleDeleteSubTask(selectedSubTask.id);
              handleCloseMenu();
            }}
            sx={{ color: "error.main" }}
          >
            <Icon
              icon="solar:trash-bin-trash-bold"
              width={20}
              style={{ marginRight: 8 }}
            />
            Delete
          </MenuItem>
        </Menu>
      )}
    </Stack>
  );
};

export default SubTasks;
