import { Box, ListItem, Stack, styled, Typography } from "@mui/material";
import React, { forwardRef, memo, useEffect } from "react";
import { kanbanClasses } from "./classes";
import { Icon } from "@iconify/react";
import moment from "moment";

export const StyledItemWrap = styled(ListItem)(() => ({
  "@keyframes fadeIn": { "0%": { opacity: 0 }, "100%": { opacity: 1 } },
  transform:
    "translate3d(var(--translate-x, 0), var(--translate-y, 0), 0) scaleX(var(--scale-x, 1)) scaleY(var(--scale-y, 1))",
  transformOrigin: "0 0",
  touchAction: "manipulation",
  [`&.${kanbanClasses.state.fadeIn}`]: { animation: "fadeIn 500ms ease" },
  [`&.${kanbanClasses.state.dragOverlay}`]: { zIndex: 999 },
}));

export const StyledItem = styled(Stack)(({ theme }) => ({
  width: "100%",
  cursor: "grab",
  outline: "none",
  overflow: "hidden",
  position: "relative",
  transformOrigin: "50% 50%",
  touchAction: "manipulation",
  boxShadow: "0 1px 2px 0 rgba(0 0 0 / 0.16)",
  borderRadius: "12px",
  WebkitTapHighlightColor: "transparent",
  transition: theme.transitions.create(["box-shadow"]),
  backgroundColor: "#141A21",
  [`&.${kanbanClasses.state.dragOverlay}`]: {
    backdropFilter: `blur(6px)`,
    boxShadow: "0 20px 40px -4px rgba(0 0 0 / 0.16)",
    backgroundColor: "rgba(20 26 33 / 0.48)",
  },
  [`&.${kanbanClasses.state.dragging}`]: {
    opacity: 0.2,
    filter: "grayscale(1)",
  },
  [`&.${kanbanClasses.state.sorting}`]: {},
}));

const Item = forwardRef(
  (
    {
      task,
      transform,
      listeners,
      transition,
      isSorting,
      isDragging,
      dragOverlay = false,
      fadeIn,
      onItemClick,
    },
    ref
  ) => {
    useEffect(() => {
      if (!dragOverlay) {
        return;
      }

      document.body.style.cursor = "grabbing";

      return () => {
        document.body.style.cursor = "";
      };
    }, [dragOverlay]);

    const handleClick = () => {
      onItemClick(task);
    };

    const itemWrapClassName = kanbanClasses.itemWrap.concat(
      (fadeIn && ` ${kanbanClasses.state.fadeIn}`) ||
        (dragOverlay && ` ${kanbanClasses.state.dragOverlay}`) ||
        ""
    );

    const itemClassName = kanbanClasses.item.concat(
      (isDragging && ` ${kanbanClasses.state.dragging}`) ||
        (isSorting && ` ${kanbanClasses.state.sorting}`) ||
        (dragOverlay && ` ${kanbanClasses.state.dragOverlay}`) ||
        ""
    );

    return (
      <StyledItemWrap
        ref={ref}
        disablePadding
        onClick={handleClick}
        className={itemWrapClassName}
        sx={{
          ...(!!transition && { transition: transition }),
          ...(!!transform && {
            "--translate-x": `${Math.round(transform.x)}px`,
            "--translate-y": `${Math.round(transform.y)}px`,
            "--scale-x": `${transform.scaleX}`,
            "--scale-y": `${transform.scaleY}`,
          }),
        }}
      >
        <StyledItem
          {...listeners}
          data-cypress="draggable-item"
          tabIndex={0}
          className={itemClassName}
        >
          <Stack spacing={2} sx={{ px: 2, py: 2.5, position: "relative" }}>
            <Typography variant="subtitle2">{task.title}</Typography>
            <Stack direction="row" alignItems="center">
              <Stack
                flexGrow={1}
                direction="row"
                alignItems="center"
                sx={{ typography: "caption", color: "text.disabled" }}
              >
                <Icon
                  icon="solar:clock-circle-bold"
                  width="16"
                  height="16"
                  style={{ marginRight: "2px" }}
                />
                <Box component="span" sx={{ mr: 1 }}>
                  {task?.duration} hours
                </Box>

                <Icon
                  icon="solar:calendar-date-bold"
                  width="16"
                  height="16"
                  style={{ marginRight: "3px" }}
                />
                <Box component="span">{moment(task?.dueDate).fromNow()}</Box>
              </Stack>
            </Stack>
          </Stack>
        </StyledItem>
      </StyledItemWrap>
    );
  }
);

export default memo(Item);
