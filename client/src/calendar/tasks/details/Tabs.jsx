import { NoSsr, tabClasses, Tabs, tabsClasses } from "@mui/material";
import React from "react";

export function CustomTabs({ children, slotProps, sx, ...other }) {
  return (
    <Tabs
      sx={{
        gap: { sm: 0 },
        minHeight: 38,
        flexShrink: 0,
        alignItems: "center",
        bgcolor: "background.neutral",
        [`& .${tabsClasses.scroller}`]: {
          p: 1,
          ...slotProps?.scroller,
        },
        [`& .${tabsClasses.flexContainer}`]: {
          gap: 0,
          ...slotProps?.flexContainer,
        },
        [`& .${tabsClasses.scrollButtons}`]: {
          borderRadius: 1,
          minHeight: "inherit",
          ...slotProps?.scrollButtons,
        },
        [`& .${tabsClasses.indicator}`]: {
          py: 1,
          height: 1,
          bgcolor: "transparent",
          "& > span": {
            width: 1,
            height: 1,
            borderRadius: "8px",
            display: "block",
            boxShadow: "0 1px 2px 0 rgba(0 0 0 / 0.16)",
            bgcolor: "#141A21",
            ...slotProps?.indicator,
          },
        },
        [`& .${tabClasses.root}`]: {
          py: 1,
          px: 2,
          zIndex: 1,
          minHeight: "auto",
          textTransform: "capitalize",
          ...slotProps?.tab,
          [`&.${tabClasses.selected}`]: {
            ...slotProps?.selected,
          },
        },
        ...sx,
      }}
      {...other}
      TabIndicatorProps={{
        children: (
          <NoSsr>
            <span />
          </NoSsr>
        ),
      }}
    >
      {children}
    </Tabs>
  );
}
