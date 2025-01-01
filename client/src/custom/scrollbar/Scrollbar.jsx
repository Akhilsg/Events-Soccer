import Box from "@mui/material/Box";
import React, { forwardRef } from "react";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import "./styles.css";

export const Scrollbar = forwardRef(
  ({ slotProps, children, fillContent, naturalScroll, sx, ...other }, ref) => (
    <Box
      component={SimpleBar}
      scrollableNodeProps={{ ref }}
      clickOnTrack={false}
      sx={{
        minWidth: 0,
        minHeight: 0,
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        "& .simplebar-wrapper": slotProps?.wrapper,
        "& .simplebar-content-wrapper": slotProps?.contentWrapper,
        "& .simplebar-content": {
          ...(fillContent && {
            minHeight: 1,
            display: "flex",
            flex: "1 1 auto",
            flexDirection: "column",
          }),

          ...slotProps?.content,
        },
        ...sx,
      }}
      {...other}
    >
      {children}
    </Box>
  )
);
