import { Icon } from "@iconify/react/dist/iconify.js";
import { Box, IconButton, Stack, styled, Typography } from "@mui/material";
import React from "react";

const StyledLabel = styled(Box)(({ theme }) => ({
  height: 24,
  minWidth: 24,
  lineHeight: 0,
  cursor: "default",
  alignItems: "center",
  whiteSpace: "nowrap",
  display: "inline-flex",
  justifyContent: "center",
  padding: theme.spacing(0, 0.75),
  fontSize: "12px",
  fontWeight: theme.typography.fontWeightBold,
  borderRadius: "6px",
  transition: theme.transitions.create("all", {
    duration: theme.transitions.duration.shorter,
  }),
  color: theme.palette.text.secondary,
  backgroundColor: "rgba(145 158 171 / 0.16)",
}));

const Toolbar = ({ children, totalTasks, setShowAddTask }) => {
  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between">
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <StyledLabel
          sx={{
            borderRadius: "50%",
            borderColor: "rgba(145 158 171)",
          }}
        >
          {totalTasks}
        </StyledLabel>

        <Typography variant="h6" sx={{ mx: 1 }}>
          {children}
        </Typography>
      </Box>

      <div>
        <IconButton
          size="small"
          color="inherit"
          onClick={() => setShowAddTask(true)}
        >
          <Icon icon="solar:add-circle-bold" />
        </IconButton>
        <IconButton size="small">
          <Icon icon="solar:menu-dots-bold-duotone" />
        </IconButton>
      </div>
    </Stack>
  );
};

export default Toolbar;
