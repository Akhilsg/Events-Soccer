import { InputBase, inputBaseClasses } from "@mui/material";
import React from "react";

export function CustomInput({ ...other }) {
  return (
    <InputBase
      sx={{
        [`&.${inputBaseClasses.root}`]: {
          py: 0.75,
          borderRadius: "8px",
          typography: "h6",
          borderWidth: 2,
          borderStyle: "solid",
          borderColor: "transparent",
          transition: (theme) =>
            theme.transitions.create(["padding-left", "border-color"]),
          [`&.${inputBaseClasses.focused}`]: {
            pl: "6px",
            borderColor: "text.primary",
          },
        },
        [`& .${inputBaseClasses.input}`]: { typography: "h6" },
      }}
      {...other}
    />
  );
}
