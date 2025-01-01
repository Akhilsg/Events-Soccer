import { Box, Typography, useTheme } from "@mui/material";
import React from "react";

const Section = ({ title, subtitle, image }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        height: "100vh",
        background:
          "linear-gradient(0deg, rgba(20, 26, 33, 0.92), rgba(20, 26, 33, 0.92)), url(https://assets.minimals.cc/public/assets/background/background-3-blur.webp)",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
        px: 3,
        pb: 3,
        width: 1,
        maxWidth: 480,
        display: "none",
        position: "relative",
        mt: "-64px",
        zIndex: theme.zIndex.appBar + 1,
        [theme.breakpoints.up("md")]: {
          gap: 8,
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          justifyContent: "center",
        },
      }}
    >
      <div>
        <Typography variant="h3" sx={{ textAlign: "center" }}>
          {title}
        </Typography>

        <Typography
          sx={{ color: "text.secondary", textAlign: "center", mt: 2 }}
        >
          {subtitle}
        </Typography>
      </div>

      <Box
        component="img"
        alt="Login"
        src={image}
        sx={{ width: 1, aspectRatio: "4/3", objectFit: "cover" }}
      />
    </Box>
  );
};

export default Section;
