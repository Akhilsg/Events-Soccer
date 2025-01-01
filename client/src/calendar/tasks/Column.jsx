import {
  defaultAnimateLayoutChanges,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Box, Stack, styled } from "@mui/material";
import React, { useEffect, useState } from "react";
import AddTask from "./AddTask";
import { kanbanClasses } from "./classes";
import Item from "./Item";
import Toolbar from "./Toolbar";
import axios from "axios";
import { useSelector } from "react-redux";

const StyledRoot = styled(Stack)(({ theme }) => ({
  flexShrink: 0,
  minHeight: theme.spacing(68),
  maxHeight: theme.spacing(68),
  borderWidth: 1,
  position: "relative",
  borderStyle: "solid",
  borderColor: "transparent",
  padding: "20px 16px 16px 16px",
  borderRadius: "16px",
  backgroundColor: "#1C252E",
  backgroundImage: "none",
  transition: theme.transitions.create(["background-color"]),
  "&::before": {
    top: 0,
    left: 0,
    content: '""',
    width: "100%",
    height: "100%",
    position: "absolute",
    borderRadius: "inherit",
    backgroundColor: "transparent",
    transition: theme.transitions.create(["background-color"]),
  },
  [`&.${kanbanClasses.state.hover}`]: {
    "&::before": {
      backgroundColor: "rgba(145 158 171 / 0.16)",
    },
  },
  [`&.${kanbanClasses.state.dragging}`]: { opacity: 0 },
}));

const SortableItem = ({ task, onItemClick }) => {
  const {
    setNodeRef,
    listeners,
    isDragging,
    isSorting,
    transform,
    transition,
  } = useSortable({
    id: task?._id,
  });

  const mounted = useMountStatus();
  const mountedWhileDragging = isDragging && !mounted;

  return (
    <Item
      ref={setNodeRef}
      task={task}
      transform={transform}
      listeners={listeners}
      transition={transition}
      isSorting={isSorting}
      isDragging={isDragging}
      fadeIn={mountedWhileDragging}
      onItemClick={onItemClick}
    />
  );
};

const Column = ({ priority, tasks, setColumns, onItemClick, id }) => {
  const { user } = useSelector((state) => state.auth);
  const [showAddTask, setShowAddTask] = useState(false);
  const priorityIdentifier =
    priority === 1 ? "High" : priority === 2 ? "Medium" : "Low";

  const { setNodeRef, over, active } = useSortable({
    id: `column-${id}`,
    data: { type: "container", children: tasks },
    animateLayoutChanges,
  });

  const tasksIds = tasks.map((task) => task?._id);
  const isOverContainer = over
    ? (`column-${id}` === over.id &&
        active?.data.current?.type !== "container") ||
      tasksIds.includes(over.id)
    : false;

  const className = kanbanClasses.column.concat(
    (isOverContainer && ` ${kanbanClasses.state.hover}`) || ""
  );

  const handleAddTask = async (taskName) => {
    if (!taskName.trim()) {
      return;
    }

    try {
      const priorityValue = priority;

      const newTask = {
        title: taskName,
        priority: priorityValue,
        userId: user.id,
      };

      const response = await axios.post(
        "http://localhost:5000/events/add",
        newTask
      );

      const createdTask = response.data;

      setColumns((prevColumns) => {
        const updatedTasks = [...prevColumns[id].tasks, createdTask];
        return {
          ...prevColumns,
          [id]: {
            ...prevColumns[id],
            tasks: updatedTasks,
          },
        };
      });
    } catch (error) {
      console.error("Error adding new task:", error);
    } finally {
      setShowAddTask(false);
    }
  };

  return (
    <StyledRoot ref={setNodeRef} className={className} sx={{ gap: 2.5 }}>
      <Toolbar totalTasks={tasks.length} setShowAddTask={setShowAddTask}>
        {priorityIdentifier}
      </Toolbar>
      {showAddTask && (
        <form onSubmit={handleAddTask}>
          <AddTask setShowAddTask={setShowAddTask} onAddTask={handleAddTask} />
        </form>
      )}
      <SortableContext
        items={tasks.map((task) => task._id)}
        strategy={verticalListSortingStrategy}
      >
        <Box
          className={kanbanClasses.columnList}
          sx={{
            minHeight: 80,
            display: "flex",
            gap: "15px",
            flexDirection: "column",
          }}
        >
          {tasks.map((task, index) => (
            <SortableItem
              key={task._id}
              task={task}
              index={index}
              onItemClick={onItemClick}
            />
          ))}
        </Box>
      </SortableContext>
    </StyledRoot>
  );
};

export default Column;

const animateLayoutChanges = (args) =>
  defaultAnimateLayoutChanges({ ...args, wasDragging: true });

function useMountStatus() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setIsMounted(true), 500);

    return () => clearTimeout(timeout);
  }, []);

  return isMounted;
}
