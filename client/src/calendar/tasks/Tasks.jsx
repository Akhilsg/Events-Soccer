import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MeasuringStrategy,
  MouseSensor,
  TouchSensor,
  defaultDropAnimationSideEffects,
  rectIntersection,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { Grid, Portal, Stack } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { kanbanClasses } from "./classes";
import Column from "./Column";
import EventSidebar from "./details/Sidebar";
import Item from "./Item";
import ItemSkeleton from "./Skeleton";
import { coordinateGetter } from "./utils";

const dropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: { active: { opacity: "0.5" } },
  }),
};

const Tasks = () => {
  const { user } = useSelector((state) => state.auth);
  const [columns, setColumns] = useState({
    high: { tasks: [] },
    medium: { tasks: [] },
    low: { tasks: [] },
  });
  const [loading, setLoading] = useState(true);
  const [activeTask, setActiveTask] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/events/user/${user.id}`
        );
        const fetchedTasks = response.data;

        const newColumns = {
          high: {
            tasks: fetchedTasks
              .filter((task) => task.priority === 1)
              .sort((a, b) => a.order - b.order),
          },
          medium: {
            tasks: fetchedTasks
              .filter((task) => task.priority === 2)
              .sort((a, b) => a.order - b.order),
          },
          low: {
            tasks: fetchedTasks
              .filter((task) => task.priority === 3)
              .sort((a, b) => a.order - b.order),
          },
        };

        setColumns(newColumns);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setLoading(false);
      }
    };

    fetchTasks();
  }, [sidebarOpen, selectedTask]);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter })
  );

  const collisionDetectionStrategy = rectIntersection;

  const findColumn = (id) => {
    for (const [columnId, column] of Object.entries(columns)) {
      if (column.tasks.some((task) => task._id === id)) {
        return columnId;
      }
    }
    return null;
  };

  const onDragStart = ({ active }) => {
    const activeColumnId = findColumn(active.id);
    const task = columns[activeColumnId]?.tasks.find(
      (task) => task._id === active.id
    );
    setActiveTask(task);
  };

  const onDragOver = ({ active, over }) => {
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeColumnId = findColumn(activeId);
    const overColumnId = overId.startsWith("column-")
      ? overId.slice(7)
      : findColumn(overId);

    if (!activeColumnId || !overColumnId) {
      return;
    }

    if (activeId !== overId) {
      setColumns((prevColumns) => {
        const activeTasks = [...prevColumns[activeColumnId].tasks];
        const overTasks = [...prevColumns[overColumnId].tasks];

        const activeIndex = activeTasks.findIndex(
          (task) => task._id === activeId
        );

        const overIndex =
          overId.startsWith("column-") && overId === `column-${overColumnId}`
            ? overTasks.length
            : overTasks.findIndex((task) => task._id === overId);

        if (activeColumnId !== overColumnId) {
          if (activeIndex !== -1) {
            const [movedTask] = activeTasks.splice(activeIndex, 1);
            overTasks.splice(overIndex, 0, movedTask);

            return {
              ...prevColumns,
              [activeColumnId]: {
                ...prevColumns[activeColumnId],
                tasks: activeTasks,
              },
              [overColumnId]: {
                ...prevColumns[overColumnId],
                tasks: overTasks,
              },
            };
          }
        } else {
          if (activeIndex !== overIndex) {
            const [movedTask] = activeTasks.splice(activeIndex, 1);
            activeTasks.splice(overIndex, 0, movedTask);

            return {
              ...prevColumns,
              [activeColumnId]: {
                ...prevColumns[activeColumnId],
                tasks: activeTasks,
              },
            };
          }
        }

        return prevColumns;
      });
    }
  };

  const onDragEnd = async ({ over }) => {
    setActiveTask(null);

    if (!over) return;

    try {
      const updatedTasks = [];

      Object.keys(columns).forEach((columnId) => {
        const priority =
          columnId === "high" ? 1 : columnId === "medium" ? 2 : 3;
        columns[columnId].tasks.forEach((task, index) => {
          updatedTasks.push({
            _id: task._id,
            priority: priority,
            order: index,
          });
        });
      });

      await axios.put("http://localhost:5000/events/reorder", {
        tasks: updatedTasks,
      });
      console.log("Successfully updated backend with reordered tasks");
    } catch (error) {
      console.error("Error updating tasks:", error);
    }
  };

  const handleTaskDelete = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5000/events/delete/${taskId}`);

      setColumns((prevColumns) => {
        const columnId = findColumn(taskId);
        if (!columnId) return prevColumns;

        return {
          ...prevColumns,
          [columnId]: {
            tasks: prevColumns[columnId].tasks.filter(
              (task) => task._id !== taskId
            ),
          },
        };
      });

      setSidebarOpen(false);
      setSelectedTask(null);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleTaskUpdate = async (updatedTask) => {
    try {
      await axios.put(
        `http://localhost:5000/events/update/${updatedTask._id}`,
        updatedTask
      );

      const updatedTaskFromBackend = await axios.get(
        `http://localhost:5000/events/${updatedTask._id}`
      );

      setColumns((prevColumns) => {
        const oldPriorityColumn = findColumn(updatedTask._id);
        const newPriorityColumn =
          updatedTask.priority === 1
            ? "high"
            : updatedTask.priority === 2
            ? "medium"
            : "low";

        if (oldPriorityColumn === newPriorityColumn) {
          return {
            ...prevColumns,
            [oldPriorityColumn]: {
              tasks: prevColumns[oldPriorityColumn].tasks.map((task) =>
                task._id === updatedTask._id
                  ? updatedTaskFromBackend.data
                  : task
              ),
            },
          };
        }

        const newColumns = {
          ...prevColumns,
          [oldPriorityColumn]: {
            tasks: prevColumns[oldPriorityColumn].tasks.filter(
              (task) => task._id !== updatedTask._id
            ),
          },
          [newPriorityColumn]: {
            tasks: [
              ...prevColumns[newPriorityColumn].tasks,
              updatedTaskFromBackend.data,
            ],
          },
        };

        return newColumns;
      });

      setSelectedTask(updatedTaskFromBackend.data);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleItemClick = (task) => {
    if (!selectedTask || selectedTask._id !== task._id) {
      setSelectedTask(task);
    }
    setSidebarOpen(true);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetectionStrategy}
      measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
    >
      {!loading && (
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack sx={{ flex: "1 1 auto", overflowX: "auto" }}>
            <Stack
              sx={{
                pb: 3,
                minHeight: 0,
                display: "flex",
                flex: "1 1 auto",
              }}
            >
              <Grid
                container
                spacing={3}
                sx={{
                  minHeight: 0,
                  flex: "1 1 auto",
                  [`& .${kanbanClasses.columnList}`]: {
                    msOverflowStyle: "none",
                    scrollbarWidth: "none",
                    overflowY: "auto",
                    "&::-webkit-scrollbar": { display: "none" },
                    flex: "1 1 auto",
                  },
                }}
              >
                {Object.keys(columns).map((columnId) => (
                  <Grid key={columnId} item xs={4}>
                    <Column
                      id={columnId}
                      priority={
                        columnId === "high" ? 1 : columnId === "medium" ? 2 : 3
                      }
                      tasks={columns[columnId].tasks}
                      onItemClick={handleItemClick}
                      setColumns={setColumns}
                    />
                  </Grid>
                ))}
              </Grid>
            </Stack>
          </Stack>
        </Stack>
      )}
      {loading && (
        <Stack direction="row" alignItems="flex-start" sx={{ gap: "24px" }}>
          <ItemSkeleton />
        </Stack>
      )}

      <Portal>
        <DragOverlay adjustScale={false} dropAnimation={dropAnimation}>
          {activeTask ? (
            <Item dragOverlay={true} task={activeTask} index={0} />
          ) : null}
        </DragOverlay>
      </Portal>

      {selectedTask && (
        <EventSidebar
          key={selectedTask?._id}
          open={sidebarOpen}
          task={selectedTask}
          onClose={() => setSidebarOpen(false)}
          onUpdate={handleTaskUpdate}
          onDelete={handleTaskDelete}
        />
      )}
    </DndContext>
  );
};

export default Tasks;
